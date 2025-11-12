'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '@/lib/api/clientApi';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import css from './RegisterPage.module.css';

interface RegistrationFormValues {
  name: string;
  phone: string;
  password: string;
}

const initialValues: RegistrationFormValues = {
  name: '',
  phone: '',
  password: '',
};

const RegisterSchema = Yup.object().shape({
  name: Yup.string().max(32, 'Імʼя має бути не довше 32 символів').required('Імʼя обовʼязкове'),
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
      const { user } = await register(values);
      if (user) {
        setUser(user);
        router.push('/');
      } else {
        setError('Не вдалося створити обліковий запис. Спробуйте ще раз');
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
      <h1 className={css.title}>Реєстрація</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={RegisterSchema}
      >
        {({ errors, touched }) => (
          <Form className={css.form}>
            <label className={css.formLabel}>
              Імʼя*
              <Field
                className={`${css.input} ${errors.name && touched.name ? css.inputError : ''}`}
                type="text"
                name="name"
                placeholder="Ваше ім’я"
                required
              />
              <ErrorMessage className={css.inputError} component="span" name="name" />
            </label>
            <label className={css.formLabel}>
              Номер телефону*
              <Field
                className={`${css.input} ${errors.phone && touched.phone ? css.inputError : ''}`}
                type="tel"
                name="phone"
                placeholder="+38 (0__) ___-__-__"
                required
              />
              <ErrorMessage className={css.inputError} component="span" name="phone" />
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
              <ErrorMessage className={css.inputError} component="span" name="password" />
            </label>
            <button className={css.button} type="submit">
              Зареєструватися
            </button>
            {error && <p className={css.formError}>{error}</p>}
          </Form>
        )}
      </Formik>
    </>
  );
}
