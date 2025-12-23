import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '전남미래국제고',
  description: '전남미래국제고등학교 통합 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
