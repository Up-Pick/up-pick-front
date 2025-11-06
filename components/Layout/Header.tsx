'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  ShoppingCart,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { creditApi } from '@/lib/api/credit';
import { notificationsApi } from '@/lib/api/notifications';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 크레딧 조회
  const { data: creditData } = useQuery({
    queryKey: ['credit'],
    queryFn: creditApi.getCredit,
    enabled: isAuthenticated,
  });

  // 알림 조회
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getUnreadNotifications,
    enabled: isAuthenticated,
    refetchInterval: 30000, // 30초마다 갱신
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/');
  };

  const handleMyPage = () => {
    handleClose();
    router.push('/my-page');
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 로고 */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            UP-PICK
          </Typography>

          {/* 네비게이션 */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => router.push('/products')}>
              경매 상품
            </Button>
            {isAuthenticated && (
              <Button color="inherit" onClick={() => router.push('/products/register')}>
                상품 등록
              </Button>
            )}
          </Box>

          {/* 우측 메뉴 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                {/* 크레딧 표시 */}
                <Typography variant="body2" sx={{ mr: 2 }}>
                  💰 {creditData?.credit.toLocaleString() || 0} 원
                </Typography>

                {/* 알림 */}
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => router.push('/notifications')}
                >
                  <Badge badgeContent={notificationsData?.notifications.length || 0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* 프로필 메뉴 */}
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleMyPage}>마이페이지</MenuItem>
                  <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/login')}>
                  로그인
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => router.push('/signup')}
                >
                  회원가입
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
