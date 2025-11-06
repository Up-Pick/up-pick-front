'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Grid,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { auctionsApi } from '@/lib/api/auctions';
import { useAuth } from '@/lib/contexts/AuthContext';
import Header from '@/components/Layout/Header';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const productId = Number(params.id);

  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 상품 상세 조회
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getProduct(productId),
    enabled: !!productId,
  });

  // 입찰 Mutation
  const bidMutation = useMutation({
    mutationFn: (biddingPrice: number) =>
      auctionsApi.placeBid(product!.auction.auctionId, { biddingPrice }),
    onSuccess: () => {
      setSuccess('입찰이 완료되었습니다!');
      setError('');
      setBidAmount('');
      // 상품 정보 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['credit'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || '입찰에 실패했습니다.');
      setSuccess('');
    },
  });

  const handleBid = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const amount = Number(bidAmount);
    if (!amount || amount <= 0) {
      setError('올바른 입찰 금액을 입력해주세요.');
      return;
    }

    if (product && amount <= product.auction.currentBid) {
      setError(`현재가(${product.auction.currentBid.toLocaleString()}원)보다 높은 금액을 입력해주세요.`);
      return;
    }

    bidMutation.mutate(amount);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>로딩 중...</Typography>
        </Container>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>상품을 찾을 수 없습니다.</Typography>
        </Container>
      </>
    );
  }

  const isAuctionActive = product.auction.status === 'IN_PROGRESS';
  const auctionEndDate = new Date(product.auction.endAt);
  const isExpired = auctionEndDate < new Date();

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* 상품 이미지 */}
          <Box sx={{ flex: 1 }}>
            <Box
              component="img"
              src={product.imageUrl || '/placeholder.png'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </Box>

          {/* 상품 정보 및 입찰 */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={`${product.category.bigCategory} - ${product.category.smallCategory}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                {product.auction.status === 'IN_PROGRESS' && (
                  <Chip label="진행중" color="success" />
                )}
                {product.auction.status === 'FINISHED' && (
                  <Chip label="낙찰완료" color="info" />
                )}
                {product.auction.status === 'EXPIRED' && (
                  <Chip label="유찰" color="default" />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  판매자
                </Typography>
                <Typography variant="h6">{product.sellerNickname}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  시작가
                </Typography>
                <Typography variant="h6">
                  {product.auction.startBid.toLocaleString()} 원
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  현재가
                </Typography>
                <Typography variant="h4" color="primary">
                  {product.auction.currentBid.toLocaleString()} 원
                </Typography>
              </Box>

              {product.auction.winnerNickname && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    낙찰자
                  </Typography>
                  <Typography variant="h6">{product.auction.winnerNickname}</Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  마감일시
                </Typography>
                <Typography variant="h6" color={isExpired ? 'error' : 'inherit'}>
                  {auctionEndDate.toLocaleString('ko-KR')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 입찰 폼 */}
              {isAuctionActive && !isExpired && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    입찰하기
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    type="number"
                    label="입찰 금액"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`${(product.auction.currentBid + 1000).toLocaleString()}원 이상`}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleBid}
                    disabled={bidMutation.isPending}
                  >
                    {bidMutation.isPending ? '입찰 중...' : '입찰하기'}
                  </Button>
                </Box>
              )}

              {!isAuctionActive && (
                <Alert severity="info">경매가 종료되었습니다.</Alert>
              )}
            </Paper>
          </Box>
        </Box>

        {/* 상품 설명 */}
        <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            상품 설명
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {product.description}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
