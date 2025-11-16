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
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import Header from '@/components/Layout/Header';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<'REGISTERED_AT_DESC' | 'END_AT_DESC' | 'CURRENT_BID_DESC'>('REGISTERED_AT_DESC');
  const [categoryId, setCategoryId] = useState<number | undefined>();

  // 카테고리 목록 조회
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  // 기본 카테고리 설정: '전자제품 - 태블릿'을 우선으로, 없으면 첫 항목
  React.useEffect(() => {
    if (categories && categories.length > 0 && categoryId == null) {
      const match = categories.find((c) => /전자/.test(c.bigCategory) && /태블릿/.test(c.smallCategory));
      const defaultCat = match || categories[0];
      setCategoryId(defaultCat.categoryId);
    }
  }, [categories, categoryId]);

  // 상품 검색
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchKeyword, page, sortBy, categoryId],
    queryFn: () => {
      const params = {
        keyword: searchKeyword || undefined,
        page,
        size: 12,
        sortBy: sortBy as 'REGISTERED_AT_DESC' | 'END_AT_DESC' | 'CURRENT_BID_DESC',
        categoryId,
      };
      return productsApi.searchProducts(params);
    },
  });

  useEffect(() => {
    const keywordParam = searchParams.get('keyword');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKeyword(keywordParam || '');
    setSearchKeyword(keywordParam || '');
    setPage(0);
  }, [searchParams]);

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(0);
  };

  const parseUtcToLocalString = (iso?: string) => {
    if (!iso) return '-';
    try {
      // If iso already contains timezone info, use it. otherwise treat as UTC by appending 'Z'.
      const normalized = /[zZ]|[+-]\d{2}:?\d{2}/.test(iso) ? iso : `${iso}Z`;
      const d = new Date(normalized);
      return d.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="상품명으로 검색"
              sx={{ flex: { md: 2 } }}
            />
            <FormControl fullWidth sx={{ flex: { md: 1 } }}>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={categoryId ?? ''}
                onChange={(e) => {
                  setCategoryId(e.target.value ? Number(e.target.value) : undefined);
                  setPage(0);
                }}
                label="카테고리"
              >
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
                  setSortBy(e.target.value as 'REGISTERED_AT_DESC' | 'END_AT_DESC' | 'CURRENT_BID_DESC');
                  setPage(0);
                }}
                label="정렬"
              >
                <MenuItem value="REGISTERED_AT_DESC">최신순</MenuItem>
                <MenuItem value="END_AT_DESC">마감늦은순</MenuItem>
                <MenuItem value="CURRENT_BID_DESC">가격순</MenuItem>
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
              {productsData?.contents.filter((product) => {
                // 마감 날짜가 지나지 않은 상품만 표시
                if (product.endAt) {
                  const endAtString = product.endAt.endsWith('Z') ? product.endAt : `${product.endAt}Z`;
                  const endDate = new Date(endAtString);
                  const now = new Date();
                  return endDate > now;
                }
                return true;
              }).map((product) => {
                // Handle backend field name variations
                const productData = product as unknown as Record<string, unknown>;
                const auctionData = productData.auction as unknown as Record<string, unknown>;

                const rawCurrentBid =
                  (productData.currentBidPrice as number) ??
                  (productData.currentBid as number) ??
                  (auctionData?.currentBidPrice as number) ??
                  (auctionData?.currentBid as number) ??
                  null;

                const displayCurrentBid = (() => {
                  if (rawCurrentBid == null) return null;
                  const n = Number(rawCurrentBid);
                  return Number.isFinite(n) ? n : null;
                })();

                const imageUrl = (productData.image as string) || product.imageUrl || '/placeholder.png';

                return (
                  <Card
                    key={product.id}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 200ms ease',
                      boxShadow: 1,
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: 6,
                      },
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={imageUrl}
                        alt={product.name}
                        sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="subtitle1" gutterBottom noWrap sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      {typeof displayCurrentBid === 'number' ? (
                        <>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                            {displayCurrentBid.toLocaleString()} 원
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            시작가: {product.minBidPrice?.toLocaleString() ?? '-'} 원
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            시작가: {product.minBidPrice?.toLocaleString() ?? '-'} 원
                          </Typography>
                        </>
                      )}
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          마감: {parseUtcToLocalString(product.endAt)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
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
