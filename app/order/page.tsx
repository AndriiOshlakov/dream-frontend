// 'use client';
// import css from './CreateOrderPage.module.css';
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
// import * as Yup from 'yup';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
// import { useShopStore } from '@/lib/store/cartStore';
// import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
// interface OrderInput {
//   name: string;
//   surname: string;
//   phone: string;
//   city: string;
//   postNumber: string;
//   comment: string;
// }

// interface UserProfile {
//   name: string;
//   surname: string;
//   phone: string;
// }

// const initialValues: OrderInput = {
//   name: '',
//   surname: '',
//   phone: '',
//   city: '',
//   postNumber: '',
//   comment: '',
// };

// const validationSchema = Yup.object({
//   name: Yup.string().max(20, "Ім'я занадто довге").required("Ім'я є обов'язковим полем"),
//   surname: Yup.string().max(30, 'Прізвище занадто довге').required("Прізвище є обов'язковим полем"),
//   phone: Yup.string()
//     .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Недійсний номер телефону')
//     .required("Телефон є обов'язковим полем"),
//   city: Yup.string().required("Населений пункт є обов'язковим полем"),
//   postNumber: Yup.string().required('Вкажіть номер відділення Нової Пошти'),
//   comment: Yup.string().max(500, 'Коментар занадто довгий'),
// });

// export default function CreateOrder() {
//   const router = useRouter();
//   const [profileInitialValues, setProfileInitialValues] = useState<OrderInput>(initialValues);
//   const [modalInfo, setModalInfo] = useState<{
//     show: boolean;
//     text: string;
//     type: 'error' | 'warning';
//   }>({
//     show: false,
//     text: '',
//     type: 'error',
//   });

//   const { cartItems, clearCart } = useShopStore(); // ⭐️ LOGIC 1: Fetch User Profile Data (Correct) ⭐️

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const response = await fetch('/api/users/current');
//         if (!response.ok) {
//           if (response.status === 401 || response.status === 403) {
//             console.log('User not logged in. Proceeding with empty form.');
//             return;
//           }
//           throw new Error(`Failed to fetch user profile, status: ${response.status}`);
//         }
//         const data: UserProfile = await response.json();
//         setProfileInitialValues((prev) => ({
//           ...prev,
//           name: data.name,
//           surname: data.surname,
//           phone: data.phone,
//         }));
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       }
//     };
//     loadProfile();
//   }, []);

//   // ⭐️ LOGIC 3: Handle Form Submission (Corrected empty cart handling) ⭐️
//   const handleSubmit = async (values: OrderInput, actions: FormikHelpers<OrderInput>) => {
//     if (cartItems.length === 0) {
//       // 🚨 ADJUSTMENT: Use Modal instead of alert() 🚨
//       setModalInfo({
//         show: true,
//         text: 'Корзина порожня. Додайте товари для оформлення замовлення.',
//         type: 'warning',
//       });
//       actions.setSubmitting(false);
//       return;
//     } // Construct the payload matching the backend schema

//     const orderPayload = {
//       // Map store items (CartItem) to API payload items
//       goods: cartItems.map((item) => ({
//         productId: item.id, // Including size in title for backend record clarity
//         title: `${item.name} (${item.size})`,
//         quantity: item.quantity,
//         price: item.price,
//         total: item.price * item.quantity,
//       })), // ... other form values
//       name: values.name,
//       surname: values.surname,
//       phone: values.phone,
//       city: values.city,
//       postNumber: values.postNumber,
//       comment: values.comment,
//     };
//     try {
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderPayload),
//       });
//       if (!response.ok) {
//         throw new Error(`Order failed with status: ${response.status}`);
//       } // SUCCESS: Clear cart using the store action
//       clearCart();
//       actions.resetForm();
//       router.push('/goods');
//     } catch (error) {
//       console.error('Order submission failed:', error);
//       // Display error modal
//       setModalInfo({
//         show: true,
//         text: 'На жаль, не вдалося оформити ваше замовлення. Спробуйте ще раз.',
//         type: 'error',
//       });
//     } finally {
//       actions.setSubmitting(false);
//     }
//   }; // Use cartItems from the store for totals

//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div>
//       <h2 className={css.title}>Оформити замовлення</h2>
//       <div className={css.container}>
//         <ul className={css.list}>
//           {/* LEFT BLOCK: Goods List */}
//           <li className={css.goods}>
//             <h5 className={css.blockCartTitle}>Товари ({totalItems} шт.)</h5>
//             <div className={css.cart}>
//               {/* Render the actual cart content here */}
//               <GoodsOrderList />
//             </div>
//           </li>
//           <li className={css.personalInfo}>
//             <h5 className={css.blockInfoTitle}>Особиста інформація</h5>
//             <Formik<OrderInput>
//               initialValues={profileInitialValues}
//               validationSchema={validationSchema}
//               onSubmit={handleSubmit}
//               enableReinitialize={true}
//             >
//               {({ isSubmitting }) => (
//                 <Form className={css.form}>
//                   {/* ... Input Fields (Correct) ... */}
//                   <div className={css.nameGroup}>
//                     <div className={css.inputWrapper}>
//                       <label htmlFor="name" className={css.inputLabel}>
//                         Ім`я*
//                       </label>

//                       <Field
//                         className={css.input}
//                         type="text"
//                         name="name"
//                         id="name"
//                         placeholder="Ваше ім'я"
//                       />

//                       <ErrorMessage name="name" component="p" className={css.error} />
//                     </div>
//                     <div className={css.inputWrapper}>
//                       <label htmlFor="surname" className={css.inputLabel}>
//                         Прізвище*
//                       </label>
//                       <Field
//                         className={css.input}
//                         type="text"
//                         name="surname"
//                         id="surname"
//                         placeholder="Ваше прізвище"
//                       />
//                       <ErrorMessage name="surname" component="p" className={css.error} />
//                     </div>
//                   </div>
//                   <div className={css.inputWrapper}>
//                     <label htmlFor="phone" className={css.inputLabel}>
//                       Номер телефону*
//                     </label>
//                     <Field
//                       className={css.input}
//                       type="tel"
//                       name="phone"
//                       id="phone"
//                       placeholder="+38 (0__)__-__-__"
//                     />
//                     <ErrorMessage name="phone" component="p" className={css.error} />
//                   </div>
//                   <div className={css.deliveryGroup}>
//                     <div className={css.inputWrapper}>
//                       <label htmlFor="city" className={css.inputLabel}>
//                         Місто доставки*
//                       </label>
//                       <Field
//                         className={css.input}
//                         type="text"
//                         name="city"
//                         id="city"
//                         placeholder="Ваше місто"
//                       />
//                       <ErrorMessage name="city" component="p" className={css.error} />
//                     </div>
//                     <div className={css.inputWrapper}>
//                       <label htmlFor="postNumber" className={css.inputLabel}>
//                         Відділення Нової пошти*
//                       </label>
//                       <Field
//                         className={css.input}
//                         type="text"
//                         name="postNumber"
//                         id="postNumber"
//                         placeholder="1"
//                       />
//                       <ErrorMessage name="postNumber" component="p" className={css.error} />
//                     </div>
//                   </div>
//                   <div className={css.inputWrapper}>
//                     <label htmlFor="comment" className={css.inputLabel}>
//                       Коментар
//                     </label>
//                     <Field
//                       as="textarea"
//                       className={css.textarea}
//                       name="comment"
//                       id="comment"
//                       placeholder="Введіть Ваш коментар"
//                       rows={8}
//                     />
//                     <ErrorMessage name="comment" component="p" className={css.error} />
//                   </div>
//                   <button
//                     className={css.submitButton}
//                     type="submit"
//                     disabled={isSubmitting || cartItems.length === 0}
//                   >
//                     Оформити замовлення
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </li>
//         </ul>
//       </div>
//       {modalInfo.show && (
//         <div className={css.modalBackdrop}>
//           <div className={css.modalContent}>
//             <MessageNoInfo // Display dynamic text based on the error/warning
//               text={modalInfo.text}
//               buttonText="Закрити" // Reset the state to close the modal
//               onClick={() => setModalInfo({ show: false, text: '', type: 'error' })}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
  name: Yup.string().max(20, "Ім'я занадто довге").required("Ім'я є обов'язковим полем"),
  surname: Yup.string().max(30, 'Прізвище занадто довге').required("Прізвище є обов'язковим полем"),
  phone: Yup.string()
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Недійсний номер телефону')
    .required("Телефон є обов'язковим полем"),
  city: Yup.string().required("Населений пункт є обов'язковим полем"),
  postNumber: Yup.string().required('Вкажіть номер відділення Нової Пошти'),
  comment: Yup.string().max(500, 'Коментар занадто довгий'),
});

export default function CreateOrder() {
  const router = useRouter();
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
      actions.resetForm();

      setTimeout(() => {
        router.push('/goods');
      }, 2000);
    } catch (error) {
      console.error('Order submission failed:', error);

      let errorMessage = 'На жаль, не вдалося оформити ваше замовлення. Спробуйте ще раз.';

      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error || error.response?.data?.message;
        if (backendError) {
          errorMessage = `Помилка: ${backendError}`;
        }
      }

      setModalInfo({
        show: true,
        text: errorMessage,
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
