// import css from './Header.module.css';
'use client';

import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useState, useEffect } from 'react';
import MobileMenu from '../MobileMenu/MobileMenu';
import css from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);
  return (
    <header className={css.header}>
      <div className={css.container}>
        {/* icon */}
        <Link href="/" className={css.headerLogo}>
          Clothica
          {/* <svg width="84" height="36">
            <use href="../" />
          </svg> */}
        </Link>
        <nav className={css.headerNavigation}>
          {/* Navigation on web  */}

          <ul className={css.headerNavigationList}>
            <li>
              <Link href="/" className={css.headerLink}>
                Головна
              </Link>
            </li>
            <li>
              <Link href="/goods" className={css.headerLink}>
                Товари
              </Link>
            </li>
            <li>
              <Link href="/categories" className={css.headerLink}>
                Категорії
              </Link>
            </li>
            {/* navigation for auth or unauth user */}
          </ul>
        </nav>
        <AuthNavigation variant="header" />
        <div className={css.headerBtn}>
          <button onClick={() => setMenuOpen(true)} className={css.burgerBtn}>
            {/* <svg width="18.3" height="12.44">
            <use href="../" />
          </svg> */}
          </button>

          {/* basket */}
          <Link className={css.headerBasket} href="/order">
            <svg width="24" height="24">
              <use href="/" />
            </svg>
          </Link>
        </div>
      </div>
      {/* Mob menu */}
      {menuOpen && <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
