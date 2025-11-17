'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // 캐싱 비활성화 (백엔드에서 캐싱 처리)
            retry: 1,
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 갱신 비활성화
            refetchOnMount: false, // 컴포넌트 마운트 시 자동 갱신 비활성화
            refetchOnReconnect: false, // 재연결 시 자동 갱신 비활성화
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
