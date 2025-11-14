'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import { useAuth } from '@/lib/contexts/AuthContext';
import Header from '@/components/Layout/Header';

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 로그인 체크
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // 알림 조회
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getUnreadNotifications,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          알림
        </Typography>

        <Paper elevation={2}>
          {notificationsData && notificationsData.notifications.length > 0 ? (
            <List>
              {notificationsData.notifications.map((notification, index) => {
                const keyBase = notification.notificationId ?? `notif-${index}`;
                return (
                  <React.Fragment key={keyBase}>
                    <ListItem key={`li-${keyBase}`} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={notification.type === 'TRADE' ? '거래' : '입찰'}
                              color={notification.type === 'TRADE' ? 'success' : 'primary'}
                              size="small"
                            />
                            <Typography variant="h6" component="div" sx={{ margin: 0 }}>
                              {notification.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" component="div" color="text.secondary">
                              {new Date(notification.notifiedAt).toLocaleString('ko-KR')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < notificationsData.notifications.length - 1 && (
                      <Divider key={`div-${keyBase}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                읽지 않은 알림이 없습니다.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
