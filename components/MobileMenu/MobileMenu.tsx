import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import css from './MobileMenu.module.css';
import Container from '../Container/Container';

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Container>
      <div className={`${css.mobileMenu} ${isOpen ? css.isOpen : ''}`}>
        <div className={css.mobileMenuHeader}>
          <Link href="/">
            <svg width="84" height="36">
              <use href="symbol-defs.svg#icon-Company-Logo" />
            </svg>
          </Link>

          <div className={css.mobileMenuNavigationBtn}>
            <button className={css.mobileMenuCloseBtn} onClick={onClose}>
              <svg className={css.mobileMenuCloseBtnIcon} width="24" height="24">
                <use href="/symbol-defs.svg#icon-close" />
              </svg>
            </button>
            <Link className={css.mobileMenuBasket} href="/order" onClick={onClose}>
              <svg className={css.mobileMenuBasketIcon} width="19" height="20">
                <use href="/symbol-defs.svg#icon-shopping_cart" />
              </svg>
            </Link>
          </div>
        </div>

        <div className={css.mobileMenuListContainer}>
          <ul className={css.mobileMenuList}>
            <li className={css.mobileMenuItem}>
              <Link className={css.mobileMenuLink} href="/" onClick={onClose}>
                Головна
              </Link>
            </li>
            <li className={css.mobileMenuItem}>
              <Link className={css.mobileMenuLink} href="/goods" onClick={onClose}>
                Товари
              </Link>
            </li>
            <li className={css.mobileMenuItem}>
              <Link className={css.mobileMenuLink} href="/categories" onClick={onClose}>
                Категорії
              </Link>
            </li>
          </ul>
        </div>

        <AuthNavigation variant="mobile" />
      </div>
    </Container>
  );
}
