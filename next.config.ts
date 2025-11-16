import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 정적 HTML 내보내기
  images: {
    unoptimized: true, // S3는 Next.js Image Optimization 미지원
  },
  // 필요시 basePath 설정 (S3 하위 경로에 배포할 경우)
  // basePath: '/your-app-name',
};

export default nextConfig;
