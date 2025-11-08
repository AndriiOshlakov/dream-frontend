// components/AuthNavigation/AuthNavigation.tsx

'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

const AuthNavigation = () => {
  const { isAuthenticated, user } = useAuthStore();

  const handleLogout = () => {};

  return isAuthenticated ? (
    <li>
      <p>{user?.email}</p>
      <button onClick={handleLogout}>Вихід</button>
    </li>
  ) : (
    <>
      <li>
        <Link href="/sign-in">Вхід</Link>
      </li>
      <li>
        <Link href="/sign-up">Реєстрація</Link>
      </li>
    </>
  );
};

export default AuthNavigation;
