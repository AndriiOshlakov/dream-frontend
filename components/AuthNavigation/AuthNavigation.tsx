// components/AuthNavigation/AuthNavigation.tsx

'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

const AuthNavigation = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <li>
      <Link href="/profile">Кабінет</Link>
    </li>
  ) : (
    <>
      <li>
        <Link href="/auth/login">Вхід</Link>
      </li>
      <li>
        <Link href="/auth/register">Реєстрація</Link>
      </li>
    </>
  );
};

export default AuthNavigation;
