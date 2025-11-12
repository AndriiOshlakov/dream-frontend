"use client";
//import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList";
import css from "./CreateOrderPage.module.css";
import { Formik, Form, Field, ErrorMessage } from 'formik'; 
import * as Yup from 'yup'; 

 
const initialValues = {
    firstName: '',
    lastName: '',
    phone: '',
    deliveryPlace: '',
    novaPoshta: '',
    comment: '',
};

 const validationSchema = Yup.object({
    firstName: Yup.string()
        .max(20, 'Ім\'я занадто довге')
        .required("Ім'я є обов'язковим полем"),
    lastName: Yup.string()
        .max(30, 'Прізвище занадто довге')
        .required("Прізвище є обов'язковим полем"),
    phone: Yup.string()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Недійсний номер телефону')
        .required('Телефон є обов\'язковим полем'),
    deliveryPlace: Yup.string()
        .required("Населений пункт є обов'язковим полем"),
    novaPoshta: Yup.string()
        .required("Вулиця та номер будинку є обов'язковими"),
    comment: Yup.string()
        .max(500, 'Коментар занадто довгий'),
});

export default function CreateOrder() {
    
   
    const onSubmit = (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
        console.log('Order Submitted!', values);
        //  send 'values' to an API endpoint here.
        alert('Замовлення успішно оформлено! Дивіться консоль для даних.');
        
        // resetForm(); 
    };

    return (
        <>
            <h2 className={css.title}>Оформити замовлення</h2>
            <div className={css.container}>
                <ul className={css.list}>
                    {/* LEFT BLOCK: Cart/Goods */}
                    <li className={css.goods}>
                        <h5 className={css.blockCartTitle}>Товари</h5>
                        <div className={css.cart}>
                            {/* <GoodsOrderList/> */}
                            <p>Компонент корзина</p>
                        </div>
                    </li>

                    {/* RIGHT BLOCK: Personal Information & Formik Form */}
                    <li className={css.personalInfo}>
                        <h5 className={css.blockInfoTitle}>Особиста інформація</h5>
                        
                        {/* 6. Wrap the form in Formik */}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                           {({ isSubmitting }) => (
                                <Form className={css.form}>
                                    
                                    
                                    <div className={css.nameGroup}>
                                        <div className={css.inputWrapper}>
                                          
                                            <p className={css.inputLabel}>Ім"я*</p>
                                            <Field 
                                                className={css.input}
                                                type="text" 
                                                name="firstName" 
                                                placeholder="Ваше ім'я" 
                                            />
                                         
                                            <ErrorMessage name="firstName" component="div" className={css.error} />
                                        </div>
                                        
                                        <div className={css.inputWrapper}>
                                            <p className={css.inputLabel}>Прізвище*</p>
                                            <Field 
                                                className={css.input}
                                                type="text" 
                                                name="lastName" 
                                                placeholder="Ваше прізвище" 
                                            />
                                            <ErrorMessage name="lastName" component="div" className={css.error} />
                                        </div>
                                    </div>

                                 
                                    <div className={css.inputWrapper}>
                                        <p className={css.inputLabel}>Номер телефону*</p>
                                        <Field 
                                            className={css.input}
                                            type="tel" 
                                            name="phone" 
                                            placeholder="+38 (0__)__-__-__" 
                                        />
                                        <ErrorMessage name="phone" component="div" className={css.error} />
                                    </div>

                                 
                                    <div className={css.deliveryGroup}>
                                        <div className={css.inputWrapper}>
                                            <p className={css.inputLabel}>Місто доставки*</p>
                                            <Field 
                                                className={css.input}
                                                type="text" 
                                                name="deliveryPlace" 
                                                placeholder="Ваше місто" 
                                            />
                                            <ErrorMessage name="deliveryPlace" component="div" className={css.error} />
                                        </div>
                                        <div className={css.inputWrapper}>
                                            <p className={css.inputLabel}>Номер відділення Нової Пошти*</p>
                                            <Field 
                                                className={css.input}
                                                type="text" 
                                                name="novaPoshta"
                                                placeholder="1" 
                                            />
                                            <ErrorMessage name="novaPoshta" component="div" className={css.error} />
                                        </div>
                                    </div>

                                    
                                    <div className={css.inputWrapper}>
                                        <p className={css.inputLabel}>Коментар</p>
                                        <Field 
                                            as="textarea" 
                                            className={css.textarea}
                                            name="comment" 
                                            placeholder="Введіть Ваш коментар" 
                                            rows={8}
                                        />
                                        <ErrorMessage name="comment" component="div" className={css.error} />
                                    </div>

                                 
                                    <button 
                                        className={css.submitButton} 
                                        type="submit"
                                        disabled={isSubmitting} 
                                    >
                                        Оформити замовлення
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </li>
                </ul>
            </div>
        </>
    )
}