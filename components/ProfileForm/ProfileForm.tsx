import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './ProfileForm.module.css';

interface ProfileFormValues {
  firstname: string;
  lastname: string;
  phone: string;
  city: string;
  postOffice: string;
}

const initialValues: ProfileFormValues = {
  firstname: '',
  lastname: '',
  phone: '',
  city: '',
  postOffice: '',
};

const ProfileFormSchema = Yup.object().shape({
  firstname: Yup.string()
    .max(32, 'Імʼя має бути не довше 32 символів')
    .required('Імʼя обовʼязкове'),
  lastname: Yup.string()
    .max(32, 'Прізвище має бути не довше 32 символів')
    .required('Прізвище обовʼязкове'),
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Введіть коректний номер телефону у форматі +380XXXXXXXXX')
    .required('Номер телефону обовʼязковий'),
  city: Yup.string().required('Місто доставки обовʼязкове'),
  postOffice: Yup.string().required('Номер відділення обовʼязковий'),
});

export default function ProfileForm() {
  const handleSubmit = (values: ProfileFormValues, actions: FormikHelpers<ProfileFormValues>) => {
    try {
      console.log(values);
    } catch (err) {
      console.log(err);
    } finally {
      actions.resetForm();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ProfileFormSchema}
    >
      <Form className={css.form}>
        <div className={css.field}>
          <label htmlFor="firstname" className={css.formLabel}>
            Імʼя*
          </label>
          <Field
            className={css.input}
            type="text"
            name="firstname"
            placeholder="Ваше ім’я"
            required
          />
          <ErrorMessage className={css.inputError} component="span" name="firstname" />
        </div>
        <div className={css.field}>
          <label htmlFor="lastname" className={css.formLabel}>
            Прізвище*
          </label>
          <Field
            className={css.input}
            type="text"
            name="lastname"
            placeholder="Ваше прізвище"
            required
          />
          <ErrorMessage className={css.inputError} component="span" name="lastname" />
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
          <label className={css.formLabel}>Місто доставки*</label>
          <Field className={css.input} type="text" name="city" placeholder="Ваше місто" required />
          <ErrorMessage className={css.inputError} component="span" name="city" />
        </div>

        <div className={css.field}>
          <label className={css.formLabel}>Номер відділення Нової Пошти*</label>
          <Field className={css.input} type="text" name="postOffice" placeholder="1" required />
          <ErrorMessage className={css.inputError} component="span" name="postOffice" />
        </div>
        <div className={`${css.actions} ${css.full}`}>
          <button className={css.button} type="submit">
            Зберегти зміни
          </button>
        </div>
      </Form>
    </Formik>
  );
}
