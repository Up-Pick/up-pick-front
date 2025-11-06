'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { notificationsApi } from '@/lib/api/notifications';
import Header from '@/components/Layout/Header';

export default function HomePage() {
  const router = useRouter();

  // 최신 상품 조회
  const { data: productsData } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: () =>
      productsApi.searchProducts({
        page: 0,
        size: 6,
        sortBy: 'CREATED_AT',
      }),
  });

  // 인기 검색어 조회
  const { data: hotKeywords } = useQuery({
    queryKey: ['hotKeywords'],
    queryFn: notificationsApi.getHotKeywords,
  });

  return (
    <>
      <Header />
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            UP-PICK
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            실시간 경매로 원하는 상품을 입찰하세요!
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => router.push('/products')}
          >
            경매 상품 보러가기
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {/* 인기 검색어 */}
        {hotKeywords && hotKeywords.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mb: 6 }}>
            <Typography variant="h6" gutterBottom>
              🔥 인기 검색어 TOP 10
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              {hotKeywords.map((keyword) => (
                <Chip
                  key={keyword.rankNo}
                  label={`${keyword.rankNo}. ${keyword.keyword}`}
                  onClick={() =>
                    router.push(`/products?keyword=${encodeURIComponent(keyword.keyword)}`)
                  }
                  clickable
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* 최신 상품 */}
        <Typography variant="h4" component="h2" gutterBottom>
          최신 경매 상품
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {productsData?.contents.map((product) => (
            <Card
              key={product.productId}
              sx={{ cursor: 'pointer', height: '100%' }}
              onClick={() => router.push(`/products/${product.productId}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || '/placeholder.png'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.name}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {product.currentBid.toLocaleString()} 원
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  마감: {new Date(product.endAt).toLocaleString('ko-KR')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {productsData && productsData.contents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              아직 등록된 상품이 없습니다.
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}