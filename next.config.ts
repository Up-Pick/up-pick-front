import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Docker 배포를 위한 standalone 모드
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
  },
};

export default nextConfig;
