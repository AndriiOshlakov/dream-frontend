'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';

interface RegistrationFormValues {
  username: string;
  phone: string;
  password: string;
}

const initialValues: RegistrationFormValues = {
  username: '',
  phone: '',
  password: '',
};

const RegisterSchema = Yup.object().shape({
  username: Yup.string().max(32, 'Імʼя має бути не довше 32 символів').required('Імʼя обовʼязкове'),
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Введіть коректний номер телефону у форматі +380XXXXXXXXX')
    .required('Номер телефону обовʼязковий'),
  password: Yup.string()
    .min(8, 'Пароль має містити щонайменше 8 символів')
    .max(128, 'Пароль занадто довгий')
    .required('Пароль обовʼязковий'),
});

export default function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (
    values: RegistrationFormValues,
    actions: FormikHelpers<RegistrationFormValues>
  ) => {
    try {
      const response = await register(values);
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
      <h1>Реєстрація</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={RegisterSchema}
      >
        <Form>
          <label>
            Імʼя*
            <Field type="text" name="username" placeholder="Ваше ім’я" required />
            <ErrorMessage component="span" name="userName" />
          </label>
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
          <button type="submit">Зареєструватися</button>
          {error && <p>{error}</p>}
        </Form>
      </Formik>
    </>
  );
}
