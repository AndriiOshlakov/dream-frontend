'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/Container/Container';

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Container>
      <Link href="/auth/login">Вхід</Link>
      <Link href="/auth/register">Реєстрація</Link>
      {children}
    </Container>
  );
}
