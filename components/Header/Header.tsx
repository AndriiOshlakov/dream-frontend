import css from './Header.module.css';
import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function Header() {
  return (
    <header>
      <div>
        <nav>
          <Link href="/" aria-label="Home">
            Clothica
          </Link>
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
            <AuthNavigation />
          </ul>
        </nav>

        <a href="">Кошик</a>
        <button>burger</button>
      </div>
    </header>
  );
}
