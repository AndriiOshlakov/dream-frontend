export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
"use client";
import css from "./CreateOrderPage.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";
 

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

interface GoodItem {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
}

 const initialValues: OrderInput = {
    name: '', surname: '', phone: '', city: '', postNumber: '', comment: '',
};

const validationSchema = Yup.object({
    name: Yup.string().max(20, 'Ім\'я занадто довге').required("Ім'я є обов'язковим полем"),
    surname: Yup.string().max(30, 'Прізвище занадто довге').required("Прізвище є обов'язковим полем"),
    phone: Yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Недійсний номер телефону').required('Телефон є обов\'язковим полем'),
    city: Yup.string().required("Населений пункт є обов'язковим полем"),
    postNumber: Yup.string().required("Вкажіть номер відділення Нової Пошти"),
    comment: Yup.string().max(500, 'Коментар занадто довгий'),
});

 
export default function CreateOrder() {
    const router = useRouter();
    const [profileInitialValues, setProfileInitialValues] = useState<OrderInput>(initialValues);
    const [showErrorModal, setShowErrorModal] = useState(false);
    
    
    // ⭐️ NEW STATE: Cart Goods from localStorage ⭐️
    const [cartGoods, setCartGoods] = useState<GoodItem[]>([]);
    
    // ⭐️ LOGIC 1: Fetch User Profile Data (Handle Unauthenticated) ⭐️
useEffect(() => {
    const loadProfile = async () => {
        try {
            
            const response = await fetch('/api/users/current');
            
            if (!response.ok) {
               
                if (response.status === 401 || response.status === 403) {
                    console.log("User not logged in. Proceeding with empty form.");
                    return;  
                }
                
                throw new Error(`Failed to fetch user profile, status: ${response.status}`);
            }
            
            const data: UserProfile = await response.json();
            
               setProfileInitialValues(prev => ({
                ...prev,
                name: data.name,
                surname: data.surname,
                phone: data.phone,
            }));

        } catch (error) {
             
            console.error("Error fetching user profile:", error);
            
        }
    };
    loadProfile();
}, []);

    // ⭐️ LOGIC 2: Fetch Cart Data from localStorage ⭐️
    useEffect(() => {
       
        if (typeof window !== 'undefined') {
            try {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    const parsedCart: GoodItem[] = JSON.parse(storedCart);
                    // Ensure it's an array before setting the state
                    if (Array.isArray(parsedCart)) {
                        setCartGoods(parsedCart);
                    }
                }
            } catch (error) {
                console.error("Error parsing cart from localStorage:", error);
                setCartGoods([]);
            }
        }
    }, []);


    // ⭐️ LOGIC 3: Handle Form Submission (POST /api/orders) ⭐️
    const handleSubmit = async (
        values: OrderInput, 
        actions: FormikHelpers<OrderInput>
    ) => {
        
        // 🚨 VALIDATION CHECK: Ensure cart is not empty 🚨 ВИКОРИСТАТИ МОДАЛЬНЕ КОШИК ПОРОЖНІЙ 
        if (cartGoods.length === 0) {
            alert("Корзина пуста. Додайте товари для оформлення замовлення.");
            actions.setSubmitting(false);
            return;
        }

        // Construct the payload matching the backend schema
        const orderPayload = {
            // ⭐️ Sourcing goods from the cartGoods state (read from localStorage) ⭐️
            goods: cartGoods, 
            name: values.name,
            surname: values.surname,
            phone: values.phone,
            city: values.city,
            postNumber: values.postNumber,
            comment: values.comment,
        };
        
        try {
             
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });
            
            if (!response.ok) {
                throw new Error(`Order failed with status: ${response.status}`);
            }
            
            // SUCCESS: Clear cart from localStorage and redirect
            if (typeof window !== 'undefined') {
                 localStorage.removeItem('cart');
            }
            actions.resetForm();
            router.push('/goods');

        } catch (error) {
            console.error('Order submission failed:', error);
            setShowErrorModal(true);
        } finally {
            actions.setSubmitting(false);
        }
    };

   
    const totalItems = cartGoods.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <h2 className={css.title}>Оформити замовлення</h2>
            <div className={css.container}>
                <ul className={css.list}>
                    {/* LEFT BLOCK: Cart/Goods - Updated to use cartGoods state */}
                    <li className={css.goods}>
                        <h5 className={css.blockCartTitle}>Товари</h5>
                        <div className={css.cart}>
                            {/* Display count based on localStorage data */}
                            <p>
                                {/* ⚠️ You should render your actual Cart component here, passing cartGoods as a prop ⚠️ */}
                                Товарів у замовленні: **{totalItems}** шт.
                                {cartGoods.length === 0 && (
                                    <span style={{ color: 'red', display: 'block', marginTop: '8px' }}>
                                        Корзина порожня. Додайте товари для продовження.
                                    </span>
                                )}
                            </p>
                            
                        </div>
                    </li>

                    
                    <li className={css.personalInfo}>
                        <h5 className={css.blockInfoTitle}>Особиста інформація</h5>
                        
                        <Formik
                            initialValues={profileInitialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize={true} 
                        >
                            {({ isSubmitting }) => (
                                <Form className={css.form}>
                                   
                                    <div className={css.nameGroup}>
                                        <div className={css.inputWrapper}>
                                            <label htmlFor="name" className={css.inputLabel}>Ім`я*</label>
                                            <Field className={css.input} type="text" name="name" id="name" placeholder="Ваше ім'я" />
                                            <ErrorMessage name="name" component="p" className={css.error} />
                                        </div>
                                        <div className={css.inputWrapper}>
                                            <label htmlFor="surname" className={css.inputLabel}>Прізвище*</label>
                                            <Field className={css.input} type="text" name="surname" id="surname" placeholder="Ваше прізвище" />
                                            <ErrorMessage name="surname" component="p" className={css.error} />
                                        </div>
                                    </div>
                                    <div className={css.inputWrapper}>
                                        <label htmlFor="phone" className={css.inputLabel}>Номер телефону*</label>
                                        <Field className={css.input} type="tel" name="phone" id="phone" placeholder="+38 (0__)__-__-__" />
                                        <ErrorMessage name="phone" component="p" className={css.error} />
                                    </div>
                                    <div className={css.deliveryGroup}>
                                        <div className={css.inputWrapper}>
                                            <label htmlFor="city" className={css.inputLabel}>Місто доставки*</label>
                                            <Field className={css.input} type="text" name="city" id="city" placeholder="Ваше місто" />
                                            <ErrorMessage name="city" component="p" className={css.error} />
                                        </div>
                                        <div className={css.inputWrapper}>
                                            <label htmlFor="postNumber" className={css.inputLabel}>Відділення Нової пошти*</label>
                                            <Field className={css.input} type="text" name="postNumber" id="postNumber" placeholder="1" />
                                            <ErrorMessage name="postNumber" component="p" className={css.error} />
                                        </div>
                                    </div>
                                    <div className={css.inputWrapper}>
                                        <label htmlFor="comment" className={css.inputLabel}>Коментар</label>
                                        <Field as="textarea" className={css.textarea} name="comment" id="comment" placeholder="Введіть Ваш коментар" rows={8} />
                                        <ErrorMessage name="comment" component="p" className={css.error} />
                                    </div>

                                    <button 
                                        className={css.submitButton} 
                                        type="submit"
                                        disabled={isSubmitting || cartGoods.length === 0} 
                                    >
                                        Оформити замовлення
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </li>
                </ul>
            </div>
            
            {/* {showErrorModal && (
                <div className={css.modalBackdrop}>
                    <div className={css.modalContent}>
                        <h3>Помилка збереження </h3>
                        <p>На жаль, не вдалося оформити ваше замовлення. Спробуйте ще раз.</p>
                        <button onClick={() => setShowErrorModal(false)}>Закрити</button>
                    </div>
                </div>
            )} */}
{showErrorModal && (
    <div className={css.modalBackdrop}>
        <div className={css.modalContent}>
            {/* 1. Explicit Close Button for the Modal Wrapper (Keep this for accessibility/backup 'X') */}
            {/* <button 
                className={css.modalCloseButton}
                onClick={() => setShowErrorModal(false)}  
                aria-label="Закрити повідомлення про помилку"
            >
                &times;
            </button> */}

            {/* 2. MessageNoInfo Component (Using its internal button for closing) */}
            <MessageNoInfo
                text="Помилка збереження"
                buttonText="OK" 
                onClick={() => setShowErrorModal(false)} 
            />
        </div>
    </div>
)}

        </>
    )
}
   
