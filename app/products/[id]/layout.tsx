// 동적 라우트를 위한 generateStaticParams
// 최소 1개 이상의 경로를 생성해야 함
export async function generateStaticParams() {
  // 더미 경로 생성 (실제로는 클라이언트에서 동적 처리)
  return [{ id: '1' }];
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
