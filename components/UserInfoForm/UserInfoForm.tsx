import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import css from './UserInfoForm.module.css';
import { User, EditCurrentUser } from '@/types/user';

interface UserInfoFormValues {
  name: string;
  surname: string;
  phone: string;
}

const UserInfoFormSchema = Yup.object().shape({
  name: Yup.string().max(32, 'Імʼя має бути не довше 32 символів').required('Імʼя обовʼязкове'),
  surname: Yup.string()
    .max(32, 'Прізвище має бути не довше 32 символів')
    .required('Прізвище обовʼязкове'),
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Введіть коректний номер телефону у форматі +380XXXXXXXXX')
    .required('Номер телефону обовʼязковий'),
});

type UserInfoFormProps = {
  user: User | null;
  updateUser: (user: EditCurrentUser) => Promise<User>;
};

export default function UserInfoForm({ user, updateUser }: UserInfoFormProps) {
  const handleSubmit = async (
    values: UserInfoFormValues,
    actions: FormikHelpers<UserInfoFormValues>
  ) => {
    try {
      const updated = await updateUser(values);
      actions.setValues(updated);
      toast.success('Особиста інформація успішно оновлена!');
    } catch (err) {
      toast.error('Щось пішло не так');
      console.log(err);
    }
  };

  const initialValues = {
    name: user?.name || '',
    surname: user?.surname || '',
    phone: user?.phone || '',
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={UserInfoFormSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.field}>
            <label htmlFor="name" className={css.formLabel}>
              Імʼя*
            </label>
            <Field className={css.input} type="text" name="name" placeholder="Ваше ім’я" required />
            <ErrorMessage className={css.inputError} component="span" name="name" />
          </div>
          <div className={css.field}>
            <label htmlFor="surname" className={css.formLabel}>
              Прізвище*
            </label>
            <Field
              className={css.input}
              type="text"
              name="surname"
              placeholder="Ваше прізвище"
              required
            />
            <ErrorMessage className={css.inputError} component="span" name="surname" />
          </div>
          <div className={`${css.field} ${css.full}`}>
            <label className={css.formLabel}>Номер телефону*</label>
            <Field
              className={css.input}
              type="tel"
              name="phone"
              placeholder="+38 (0__) ___-__-__"
              required
            />
            <ErrorMessage className={css.inputError} component="span" name="phone" />
          </div>

          <div className={css.field}>
            <label className={css.formLabel}>Місто доставки</label>
            <input className={css.input} type="text" name="city" placeholder="Ваше місто" />
          </div>

          <div className={css.field}>
            <label className={css.formLabel}>Номер відділення Нової Пошти</label>
            <input className={css.input} type="text" name="postNumber" placeholder="1" />
          </div>
          <div className={`${css.actions} ${css.full}`}>
            <button className={css.button} type="submit" disabled={isSubmitting}>
              Зберегти зміни
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
