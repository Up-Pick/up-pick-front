import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import QueryProvider from "@/lib/contexts/QueryProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata: Metadata = {
  title: "UP-PICK - 경매 플랫폼",
  description: "실시간 경매로 원하는 상품을 입찰하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}