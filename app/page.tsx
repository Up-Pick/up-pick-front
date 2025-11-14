'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import Header from '@/components/Layout/Header';

export default function HomePage() {
  const router = useRouter();

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
              {hotKeywords.map((keyword, idx) => (
                <Chip
                  key={keyword.rankNo != null ? `${keyword.rankNo}-${keyword.keyword}` : `hot-${idx}`}
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
      </Container>
    </>
  );
}