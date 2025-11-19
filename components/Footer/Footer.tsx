'use client';

import css from './Footer.module.css';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscribeUser } from '@/lib/api/clientApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function Footer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      return subscribeUser(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email'] });
      toast.success('Дякуємо за підписку!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email є обов'язковим")
      .matches(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, 'Некоректний формат email'),
  });

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
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                mutation.mutate(values.email, {
                  onSuccess: () => {
                    resetForm();
                  },
                });
              }}
            >
              {({ isSubmitting }) => (
                <Form className={css.footerForm} noValidate>
                  <div className={css.inputWrapper}>
                    <Field
                      type="text"
                      name="email"
                      placeholder="Введіть ваш email"
                      className={css.footerInput}
                    />
                    <ErrorMessage name="email" component="div" className={css.errorMessage} />
                  </div>
                  <button
                    type="submit"
                    className={css.footerBtn}
                    disabled={mutation.isPending || isSubmitting}
                  >
                    {mutation.isPending ? 'Надсилаємо...' : 'Підписатися'}
                  </button>
                </Form>
              )}
            </Formik>
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
