import css from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.container}>
          <div className={css.footerLinks}>
            <a href="" aria-label="Головна" className={css.footerLogo}>
              <svg width="84" height="36" aria-hidden="true">
                <use href=""></use>
              </svg>
            </a>
            <div className={css.footerNav}>
              <h2 className={css.footerMenu}>Меню</h2>
              <ul className={css.footerNavList}>
                <li className={css.footerNavigation}>
                  <a href="">Головна</a>
                </li>
                <li className={css.footerNavigation}>
                  <a href="">Товари</a>
                </li>
                <li className={css.footerNavigation}>
                  <a href="">Категорії</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={css.footerSubscribe}>
            <h3 className={css.footerSub}>Підписатися</h3>
            <p className={css.footerDescription}>
              Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
            </p>
            <div className={css.footerFormContainer}>
              <form action="" className={css.footerForm}>
                <input
                  type="mail"
                  placeholder="Введіть ваш email"
                  className={css.footerInput}
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                />
                <button type="submit" className={css.footerBtn}>
                  Підписатися
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className={css.footerSocial}>
          <p className={css.rights}>© {new Date().getFullYear()} Clothica. Всі права захищені.</p>
          <ul className={css.socialContainer}>
            <li>
              <Link
                href="https://www.facebook.com"
                aria-label="facebook"
                target="_blank"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href=""></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.instagram.com"
                aria-label="instagram"
                target="_blank"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href=""></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link href="https://x.com" aria-label="x" target="_blank" className={css.socialLink}>
                <svg width="32" height="32" aria-hidden="true">
                  <use href=""></use>
                </svg>
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com"
                aria-label="youtube"
                target="_blank"
                className={css.socialLink}
              >
                <svg width="32" height="32" aria-hidden="true">
                  <use href=""></use>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
