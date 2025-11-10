import css from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.footerTop}>
          <div className={css.footerLinks}>
            <Link href="/" aria-label="Головна" className={css.footerLogo}>
              <svg width="84" height="36" aria-hidden="true">
                <use href="/symbol-defs.svg#icon-Company-Logo"></use>
              </svg>
            </Link>
            <nav className={css.footerNav}>
              <h2 className={css.footerMenu}>Меню</h2>
              <ul className={css.footerNavList}>
                <li className={css.footerNavigation}>
                  <Link href="/">Головна</Link>
                </li>
                <li className={css.footerNavigation}>
                  <Link href="/goods">Товари</Link>
                </li>
                <li className={css.footerNavigation}>
                  <Link href="/categories">Категорії</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={css.footerSubscribe}>
            <h3 className={css.footerSub}>Підписатися</h3>
            <p className={css.footerDescription}>
              Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
            </p>
            <div className={css.footerFormContainer}>
              <form action="" className={css.footerForm}>
                <input
                  type="email"
                  required
                  placeholder="Введіть ваш email"
                  className={css.footerInput}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />
              </form>
              <button type="submit" className={css.footerBtn}>
                Підписатися
              </button>
            </div>
          </div>
        </div>

        <div className={css.footerSocial}>
          <p className={css.rights}>© {new Date().getFullYear()} Clothica. Всі права захищені.</p>
          <ul className={css.socialContainer}>
            <li className={css.socialList}>
              <a
                href="https://www.facebook.com"
                aria-label="facebook"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-Facebook"></use>
                </svg>
              </a>
            </li>
            <li className={css.socialList}>
              <a
                href="https://www.instagram.com"
                aria-label="instagram"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-Instagram"></use>
                </svg>
              </a>
            </li>
            <li className={css.socialList}>
              <a
                href="https://x.com"
                aria-label="x"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-X"></use>
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com"
                aria-label="youtube"
                target="_blank"
                rel="noopener noreferrer"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href="/symbol-defs.svg#icon-Youtube"></use>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
