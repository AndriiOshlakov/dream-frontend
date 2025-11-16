'use client';

import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useState, useEffect } from 'react';
import MobileMenu from '../MobileMenu/MobileMenu';
import css from './Header.module.css';
import Container from '../Container/Container';
import CartIcon from '../CartIcon/CartIcon';
import { useShopStore } from '@/lib/store/cartStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useShopStore((s) => s.cartItems);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  return (
    <header className={css.header}>
      <Container>
        <div className={css.headerContainer}>
          <Link href="/" className={css.headerLogo}>
            <svg width="84" height="36">
              <use href="/symbol-defs.svg#icon-Company-Logo" />
            </svg>
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
            <button
              onClick={() => setMenuOpen(true)}
              className={`${css.burgerBtn} ${css.headerIconBtn}`}
            >
              <svg width="24" height="24">
                <use href="/symbol-defs.svg#icon-menu" />
              </svg>
            </button>

            {/* basket */}
            <Link className={`${css.headerBasket} ${css.headerIconBtn}`} href="/order">
              <svg className={css.headerBasketIcon} width="24" height="24">
                <use href="/symbol-defs.svg#icon-shopping_cart" />
              </svg>
              {totalCount > 0 && <span className={css.cartBadge}>{totalCount}</span>}
            </Link>
          </div>
        </div>
      </Container>
      {/* Mob menu */}
      {menuOpen && <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
