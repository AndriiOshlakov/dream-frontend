'use client';

import css from './Footer.module.css';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Footer() {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      try {
        const response = await axios.post('/api/subscriptions', { email });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || 'Помилка підписки';
          throw new Error(message);
        }
        throw new Error('Невідома помилка');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email'] });
      toast.success('Дякуємо за підписку!');
      setEmail('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

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
            <form className={css.footerForm} onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Введіть ваш email"
                className={css.footerInput}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              />
              <button type="submit" className={css.footerBtn} disabled={mutation.isPending}>
                {mutation.isPending ? 'Надсилаємо...' : 'Підписатися'}
              </button>
            </form>
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </footer>
  );
}
