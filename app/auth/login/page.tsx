'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';

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
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    try {
      const response = await login(values);
      if (response) {
        setUser(response);
        router.push('/');
      } else {
        setError('Неправильний номер телефону або пароль');
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.response?.data?.error ?? error.message ?? 'Ой... сталася помилка');
    } finally {
      actions.resetForm();
    }
  };

  return (
    <>
      <h1>Вхід</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={LoginSchema}>
        <Form>
          <label>
            Номер телефону*
            <Field type="tel" name="phone" placeholder="+38 (0__) ___-__-__" required />
            <ErrorMessage component="span" name="phone" />
          </label>
          <label>
            Пароль*
            <Field type="password" name="password" placeholder="********" required />
            <ErrorMessage component="span" name="phone" />
          </label>
          <button type="submit">Увійти</button>
          {error && <p>{error}</p>}
        </Form>
      </Formik>
    </>
  );
}
