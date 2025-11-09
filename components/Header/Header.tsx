// import css from './Header.module.css';
'use client';

import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import { useState } from 'react';
import MobileMenu from '../MobileMenu/MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header>
      <div>
        {/* icon */}
        <Link href="/">
          <svg width="84" height="36">
            <use href="/" />
          </svg>
        </Link>
        <nav>
          {/* Navigation on web  */}
          <ul>
            <li>
              <Link href="/">Головна</Link>
            </li>
            <li>
              <Link href="/goods">Товари</Link>
            </li>
            <li>
              <Link href="/categories">Категорії</Link>
            </li>
            {/* navigation for auth or unauth user */}
            <AuthNavigation />
          </ul>
        </nav>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          ☰
        </button>

        {/* basket */}
        <Link href="/order">
          <svg width="84" height="36">
            <use href="/" />
          </svg>
        </Link>
      </div>
      {/* Mob menu */}
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
}
