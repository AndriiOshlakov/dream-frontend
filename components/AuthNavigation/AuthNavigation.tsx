'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

interface AuthNavigationProps {
  variant?: 'header' | 'mobile';
  className?: string;
}

const AuthNavigation = ({ variant = 'header' }: AuthNavigationProps) => {
  const { isAuthenticated } = useAuthStore();

  // Класс для <ul>
  const containerClass = variant === 'header' ? css.authNavigationHeader : css.authNavigationMobile;

  // Класс для <li>
  const itemClass =
    variant === 'header' ? css.authNavigationItemHeader : css.authNavigationItemMobile;

  return (
    <ul className={containerClass}>
      {isAuthenticated ? (
        <li className={itemClass}>
          <Link
            href="/profile"
            className={variant === 'header' ? css.authNavigationLinkHeader : css.signInClass}
          >
            Кабінет
          </Link>
        </li>
      ) : (
        <>
          <li className={itemClass}>
            <Link
              href="/auth/login"
              className={variant === 'header' ? css.authNavigationLinkHeader : css.signInClass}
            >
              Вхід
            </Link>
          </li>
          <li className={variant === 'header' ? css.authNavigationLinkHeaderReg : itemClass}>
            <Link
              href="/auth/register"
              className={
                variant === 'header' ? css.authNavigationLinkHeader : css.registrationClass
              }
            >
              Реєстрація
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default AuthNavigation;
