'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { login } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/components/Loader/Loader';
import css from './LogInPage.module.css';

interface LoginFormValues {
  phone: string;
  password: string;
}

const initialValues: LoginFormValues = {
  phone: '',
  password: '',
};

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Введіть коректний номер телефону у форматі +380XXXXXXXXX')
    .required('Номер телефону обовʼязковий'),
  password: Yup.string().required('Пароль обовʼязковий'),
});

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    try {
      setIsLoading(true);
      const { user } = await login(values);
      if (user) {
        setUser(user);
        router.push('/');
      } else {
        toast.error('Неправильний номер телефону або пароль');
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.response?.data?.error ?? error.message ?? 'Ой... сталася помилка');
    } finally {
      setIsLoading(false);
      actions.resetForm();
    }
  };

  return (
    <>
      <h1 className={css.title}>Вхід</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={LoginSchema}>
        {({ errors, touched }) => (
          <Form className={css.form}>
            <label className={css.formLabel}>
              Номер телефону*
              <Field
                className={`${css.input} ${errors.phone && touched.phone ? css.inputError : ''}`}
                type="tel"
                name="phone"
                placeholder="+38 (0__) ___-__-__"
              />
              <ErrorMessage className={css.errorText} component="span" name="phone" />
            </label>
            <label className={css.formLabel}>
              Пароль*
              <Field
                className={`${css.input} ${errors.password && touched.password ? css.inputError : ''}`}
                type="password"
                name="password"
                placeholder="********"
              />
              <ErrorMessage className={css.errorText} component="span" name="password" />
            </label>
            <button className={css.button} type="submit" disabled={isLoading}>
              {isLoading ? 'Авторизація...' : 'Увійти'}
            </button>
          </Form>
        )}
      </Formik>
      {isLoading && <Loader />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}
