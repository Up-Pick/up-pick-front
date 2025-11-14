'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import Header from '@/components/Layout/Header';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<'REGISTERED_AT_DESC' | 'END_AT' | 'CURRENT_BID'>('REGISTERED_AT_DESC');
  const [categoryId, setCategoryId] = useState<number | undefined>();

  // 카테고리 목록 조회
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  // 상품 검색
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', keyword, page, sortBy, categoryId],
    queryFn: () => {
      const params = {
        keyword: keyword || undefined,
        page,
        size: 12,
        sortBy,
        categoryId,
      };
      console.debug('searchProducts called with params', params);
      return productsApi.searchProducts(params);
    },
  });

  useEffect(() => {
    const keywordParam = searchParams.get('keyword');
    if (keywordParam) {
      setKeyword(keywordParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setPage(0);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          경매 상품
        </Typography>

        {/* 검색 및 필터 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="상품명으로 검색"
              sx={{ flex: { md: 2 } }}
            />
            <FormControl fullWidth sx={{ flex: { md: 1 } }}>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={categoryId || ''}
                onChange={(e) => {
                  setCategoryId(e.target.value ? Number(e.target.value) : undefined);
                  setPage(0);
                }}
                label="카테고리"
              >
                <MenuItem value="">전체</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.bigCategory} - {cat.smallCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ flex: { md: 1 } }}>
              <InputLabel>정렬</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(0);
                }}
                label="정렬"
              >
                <MenuItem value="REGISTERED_AT_DESC">최신순</MenuItem>
                <MenuItem value="END_AT">마감임박순</MenuItem>
                <MenuItem value="CURRENT_BID">가격순</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSearch} sx={{ height: 56, minWidth: { xs: '100%', md: 100 } }}>
              검색
            </Button>
          </Box>
        </Box>

        {/* 상품 목록 */}
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography>로딩 중...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
              {productsData?.contents.map((product) => (
                <Card
                  key={product.id}
                  sx={{ cursor: 'pointer', height: '100%' }}
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    {product.currentBid ? (
                      <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                        현재 입찰가: {product.currentBid.toLocaleString()} 원
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        최소 입찰가: {product.minBidPrice.toLocaleString()} 원
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      마감: {new Date(product.endAt).toLocaleDateString('ko-KR')}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {productsData && productsData.contents.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  검색 결과가 없습니다.
                </Typography>
              </Box>
            )}

            {/* 페이지네이션 */}
            {productsData && productsData.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={productsData.totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
