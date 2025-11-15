'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { useAuth } from '@/lib/contexts/AuthContext';
import Header from '@/components/Layout/Header';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib/types/api';

export default function ProductRegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    startBid: '',
    endAt: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  // 로그인 체크
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 카테고리 목록 조회
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  // 상품 등록 Mutation
  const registerMutation = useMutation({
    mutationFn: productsApi.registerProduct,
    onSuccess: () => {
      alert('상품이 등록되었습니다!');
      router.push('/my-page');
    },
    onError: (err) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || '상품 등록에 실패했습니다.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('상품 이미지를 선택해주세요.');
      return;
    }

    // 마감일시를 ISO 8601 형식으로 변환
    const endAtDate = new Date(formData.endAt);
    const endAtISO = endAtDate.toISOString();

    registerMutation.mutate({
      name: formData.name,
      description: formData.description,
      categoryId: Number(formData.categoryId),
      startBid: Number(formData.startBid),
      endAt: endAtISO,
      image: imageFile,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            상품 등록
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="상품명"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="상품 설명"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>카테고리</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value as string })
                }
                label="카테고리"
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.bigCategory} - {cat.smallCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="시작가 (원)"
              name="startBid"
              type="number"
              value={formData.startBid}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="경매 마감일시"
              name="endAt"
              type="datetime-local"
              value={formData.endAt}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button variant="outlined" component="label" fullWidth>
                상품 이미지 선택
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? '등록 중...' : '상품 등록'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
