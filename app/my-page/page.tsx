'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { creditApi } from '@/lib/api/credit';
import { useAuth } from '@/lib/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib/types/api';
import type { StandardPageResponse, ProductSimpleInfo } from '@/lib/types/product';

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [chargeDialogOpen, setChargeDialogOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [error, setError] = useState('');

  // 로그인 체크
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 크레딧 조회
  const { data: creditData } = useQuery({
    queryKey: ['credit'],
    queryFn: creditApi.getCredit,
    enabled: isAuthenticated,
  });

  // 내 상품 조회
  const { data: sellingProducts } = useQuery({
    queryKey: ['myProducts', 'selling'],
    queryFn: () => productsApi.getMySellingProducts(0, 20),
    enabled: isAuthenticated && tabValue === 0,
  });

  const { data: soldProducts } = useQuery({
    queryKey: ['myProducts', 'sold'],
    queryFn: () => productsApi.getMySoldProducts(0, 20),
    enabled: isAuthenticated && tabValue === 1,
  });

  const { data: biddingProducts } = useQuery({
    queryKey: ['myProducts', 'bidding'],
    queryFn: () => productsApi.getMyBiddingProducts(0, 20),
    enabled: isAuthenticated && tabValue === 2,
  });

  const { data: purchasedProducts } = useQuery({
    queryKey: ['myProducts', 'purchased'],
    queryFn: () => productsApi.getMyPurchasedProducts(0, 20),
    enabled: isAuthenticated && tabValue === 3,
  });

  // 크레딧 충전 Mutation
  const chargeMutation = useMutation({
    mutationFn: creditApi.chargeCredit,
    onSuccess: () => {
      alert('크레딧이 충전되었습니다!');
      setChargeDialogOpen(false);
      setChargeAmount('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['credit'] });
    },
    onError: (err) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '충전에 실패했습니다.';
      setError(errorMessage);
    },
  });

  const handleChargeCredit = () => {
    const amount = Number(chargeAmount);
    if (!amount || amount <= 0) {
      setError('올바른 금액을 입력해주세요.');
      return;
    }
    chargeMutation.mutate({ amount });
  };

  const renderProductList = (products: StandardPageResponse<ProductSimpleInfo> | undefined) => {
    if (!products || products.contents.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">상품이 없습니다.</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
        {products.contents.map((product) => {
          const productImage = ((product as unknown as Record<string, unknown>).image as string) || product.imageUrl || '/placeholder.png';
          const currentBid = product.currentBid ?? 0;
          return (
            <Card
              key={product.id}
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="180"
                image={productImage}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                {currentBid > 0 && (
                  <Typography variant="h6" color="primary">
                    {currentBid.toLocaleString()} 원
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  마감: {new Date(product.endAt).toLocaleDateString('ko-KR')}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* 크레딧 정보 */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                내 크레딧
              </Typography>
              <Typography variant="h3" color="primary">
                💰 {creditData?.currentCredit.toLocaleString() || 0} 원
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => setChargeDialogOpen(true)}
              >
                크레딧 충전
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 내 상품 탭 */}
        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="판매중" />
            <Tab label="판매완료" />
            <Tab label="입찰중" />
            <Tab label="구매완료" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && renderProductList(sellingProducts)}
            {tabValue === 1 && renderProductList(soldProducts)}
            {tabValue === 2 && renderProductList(biddingProducts)}
            {tabValue === 3 && renderProductList(purchasedProducts)}
          </Box>
        </Paper>
      </Container>

      {/* 크레딧 충전 다이얼로그 */}
      <Dialog open={chargeDialogOpen} onClose={() => setChargeDialogOpen(false)}>
        <DialogTitle>크레딧 충전</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="충전 금액 (원)"
            type="number"
            fullWidth
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChargeDialogOpen(false)}>취소</Button>
          <Button
            onClick={handleChargeCredit}
            variant="contained"
            disabled={chargeMutation.isPending}
          >
            {chargeMutation.isPending ? '충전 중...' : '충전'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
