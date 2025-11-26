'use client';
import css from './CreateOrderPage.module.css';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import { useShopStore } from '@/lib/store/cartStore';
import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import { nextServer } from '@/lib/api/api';
import { toast, ToastContainer } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

interface OrderInput {
  name: string;
  surname: string;
  phone: string;
  city: string;
  postNumber: string;
  comment: string;
}

interface UserProfile {
  name: string;
  surname: string;
  phone: string;
}

const initialValues: OrderInput = {
  name: '',
  surname: '',
  phone: '',
  city: '',
  postNumber: '',
  comment: '',
};

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[А-Яа-яЁёЇїІіЄєҐґA-Za-z'-]+$/, "Ім'я має містити лише літери")
    .max(20, "Ім'я занадто довге")
    .required("Ім'я є обов'язковим полем"),
  surname: Yup.string()
    .matches(/^[А-Яа-яЁёЇїІіЄєҐґA-Za-z'-]+$/, 'Прізвище має містити лише літери')
    .max(30, 'Прізвище занадто довге')
    .required("Прізвище є обов'язковим полем"),
  phone: Yup.string()
    .max(13, 'Надто довгий номер тедефона')
    .min(13, 'Надто короткий номер тедефона')
    .matches(/^\+380\d{9}$/, 'Номер має бути у форматі +380XXXXXXXXX')
    .required("Телефон є обов'язковим полем"),
  city: Yup.string().required("Населений пункт є обов'язковим полем"),
  postNumber: Yup.string().required('Вкажіть номер відділення Нової Пошти'),
  comment: Yup.string().max(500, 'Коментар занадто довгий'),
});

export default function CreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [profileInitialValues, setProfileInitialValues] = useState<OrderInput>(initialValues);
  const [modalInfo, setModalInfo] = useState<{
    show: boolean;
    text: string;
    type: 'error' | 'warning';
  }>({
    show: false,
    text: '',
    type: 'error',
  });

  const { cartItems, clearCart } = useShopStore();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await nextServer.get<UserProfile>('/users/current');

        const data = response.data;
        setProfileInitialValues((prev) => ({
          ...prev,
          name: data.name,
          surname: data.surname,
          phone: data.phone,
        }));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            toast('ДЛЯ СКОРІШОГО ОБСЛУГОВУВАННЯ -АВТОРИЗУЙТЕСЬ!!!');
            return;
          }
        }
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (values: OrderInput, actions: FormikHelpers<OrderInput>) => {
    if (cartItems.length === 0) {
      setModalInfo({
        show: true,
        text: 'Корзина порожня. Додайте товари для оформлення замовлення.',
        type: 'warning',
      });
      actions.setSubmitting(false);
      return;
    }

    const totalPrice = JSON.parse(localStorage.getItem('totalPrice') || '0');

    const orderPayload = {
      // Map store items (CartItem) to API payload items
      goods: cartItems.map((item) => ({
        productId: item.id, // Including size in title for backend record clarity
        title: `${item.name} (${item.size})`,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })), // ... other form values
      name: values.name,
      surname: values.surname,
      phone: values.phone,
      city: values.city,
      postNumber: values.postNumber,
      comment: values.comment,
      totalAmount: totalPrice,
    };
    try {
      await nextServer.post('/orders', orderPayload);

      toast(
        `ВИ ЗРОБИЛИ ВДАЛЕ ЗАМОВЛЕННЯ НА СУМУ ${totalPrice} грн. ДЯКУЄМО, ЩО ОБРАЛИ DREAMCLOTH!`
      );
      clearCart();
      // Оновлюємо кеш запитів для моїх замовлень на сторінці профілю
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      actions.resetForm();

      setTimeout(() => {
        router.push('/goods');
      }, 2500);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast('Перевірте правильність введених даних і спробуйте замовити знову.');

      setModalInfo({
        show: true,
        text: 'Перевірте правильність введених даних і спробуйте замовити знову.',
        type: 'error',
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <ToastContainer position="top-center" />
      <h2 className={css.title}>Оформити замовлення</h2>
      <div className={css.container}>
        <ul className={css.list}>
          <li className={css.goods}>
            <h5 className={css.blockCartTitle}>Товари ({totalItems} шт.)</h5>
            <div className={css.cart}>
              <GoodsOrderList />
            </div>
          </li>
          <li className={css.personalInfo}>
            <h5 className={css.blockInfoTitle}>Особиста інформація</h5>
            <Formik<OrderInput>
              initialValues={profileInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting }) => (
                <Form className={css.form}>
                  <div className={css.nameGroup}>
                    <div className={css.inputWrapper}>
                      <label htmlFor="name" className={css.inputLabel}>
                        Ім`я*
                      </label>

                      <Field
                        className={css.input}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Ваше ім'я"
                      />

                      <ErrorMessage name="name" component="p" className={css.error} />
                    </div>
                    <div className={css.inputWrapper}>
                      <label htmlFor="surname" className={css.inputLabel}>
                        Прізвище*
                      </label>
                      <Field
                        className={css.input}
                        type="text"
                        name="surname"
                        id="surname"
                        placeholder="Ваше прізвище"
                      />
                      <ErrorMessage name="surname" component="p" className={css.error} />
                    </div>
                  </div>
                  <div className={css.inputWrapper}>
                    <label htmlFor="phone" className={css.inputLabel}>
                      Номер телефону*
                    </label>
                    <Field
                      className={css.input}
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="+38 (0__)__-__-__"
                    />
                    <ErrorMessage name="phone" component="p" className={css.error} />
                  </div>
                  <div className={css.deliveryGroup}>
                    <div className={css.inputWrapper}>
                      <label htmlFor="city" className={css.inputLabel}>
                        Місто доставки*
                      </label>
                      <Field
                        className={css.input}
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Ваше місто"
                      />
                      <ErrorMessage name="city" component="p" className={css.error} />
                    </div>
                    <div className={css.inputWrapper}>
                      <label htmlFor="postNumber" className={css.inputLabel}>
                        Відділення Нової пошти*
                      </label>
                      <Field
                        className={css.input}
                        type="text"
                        name="postNumber"
                        id="postNumber"
                        placeholder="1"
                      />
                      <ErrorMessage name="postNumber" component="p" className={css.error} />
                    </div>
                  </div>
                  <div className={css.inputWrapper}>
                    <label htmlFor="comment" className={css.inputLabel}>
                      Коментар
                    </label>
                    <Field
                      as="textarea"
                      className={css.textarea}
                      name="comment"
                      id="comment"
                      placeholder="Введіть Ваш коментар"
                      rows={8}
                    />
                    <ErrorMessage name="comment" component="p" className={css.error} />
                  </div>
                  <button
                    className={css.submitButton}
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    Оформити замовлення
                  </button>
                </Form>
              )}
            </Formik>
          </li>
        </ul>
      </div>
      {modalInfo.show && (
        <div className={css.modalBackdrop}>
          <div className={css.modalContent}>
            <MessageNoInfo
              text={modalInfo.text}
              buttonText="Закрити"
              onClick={() => setModalInfo({ show: false, text: '', type: 'error' })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
