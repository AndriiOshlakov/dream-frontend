'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/authStore';
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
    .matches(/^\+380\d{9}$/, 'Введіть коректний номер у форматі +380XXXXXXXXX')
    .required('Номер телефону обовʼязковий'),
  password: Yup.string().required('Пароль обовʼязковий'),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    try {
      const user = await login(values);
      console.log(user);

      if (user) {
        setUser(user);
        router.push('/');
      } else {
        setError('Неправильний номер телефону або пароль');
      }
    } catch (err) {
      setError('Ой... сталася помилка');
    } finally {
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
                required
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
                required
              />
              <ErrorMessage className={css.errorText} component="span" name="password" />
            </label>
            <button className={css.button} type="submit">
              Увійти
            </button>
            {error && <p className={css.formError}>{error}</p>}
          </Form>
        )}
      </Formik>
    </>
  );
}
