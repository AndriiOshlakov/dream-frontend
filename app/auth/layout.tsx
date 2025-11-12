'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/Container/Container';
import css from './AuthPage.module.css';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <section className={css.authOverlay}>
      <Container>
        <div className={css.authLayout}>
          <div className={css.authHeader}>
            <Link href="/">
              <svg className={css.companyLogoIcon} width="84" height="36">
                <use href="/symbol-defs.svg#icon-Company-Logo"></use>
              </svg>
            </Link>
          </div>
          <div className={css.authFormWrapper}>
            <ul className={css.authList}>
              <li
                className={`${css.authItem} ${pathname === '/auth/register' ? css.activeLink : ''}`}
              >
                <Link className={css.authLink} href="/auth/register">
                  Реєстрація
                </Link>
              </li>
              <li className={`${css.authItem} ${pathname === '/auth/login' ? css.activeLink : ''}`}>
                <Link className={css.authLink} href="/auth/login">
                  Вхід
                </Link>
              </li>
            </ul>
            <div className={css.authContent}>{children}</div>
          </div>
          <div className={css.authFooter}>© 2025 Clothica. Всі права захищені.</div>
        </div>
      </Container>
    </section>
  );
}
