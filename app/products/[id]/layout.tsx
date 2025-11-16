// 동적 라우트를 위한 빈 generateStaticParams
export async function generateStaticParams() {
  // 빈 배열 반환 - 모든 경로는 클라이언트에서 동적으로 처리
  return [];
}

export const dynamicParams = true; // 빌드 시 생성되지 않은 경로 허용

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
