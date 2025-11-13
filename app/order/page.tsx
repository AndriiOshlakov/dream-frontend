"use client";
//import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList";
import css from "./CreateOrderPage.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'; 
import * as Yup from 'yup'; 

interface OrderInput{
    name: string;
    surname: string;
    phone: string;
    city: string;
    postNumber: string;
    comment: string;  
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
        .max(20, 'Ім\'я занадто довге')
        .required("Ім'я є обов'язковим полем"),
    surname: Yup.string()
        .max(30, 'Прізвище занадто довге')
        .required("Прізвище є обов'язковим полем"),
    phone: Yup.string()
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Недійсний номер телефону')
        .required('Телефон є обов\'язковим полем'),
    city: Yup.string()
        .required("Населений пункт є обов'язковим полем"),
    postNumber: Yup.string()
        .required("Вкажіть номер відділення Нової Пошти"),
    comment: Yup.string()
        .max(500, 'Коментар занадто довгий'),
});

export default function CreateOrder() {
    
   
    const handleSubmit = (
        values: OrderInput, 
        actions: FormikHelpers<OrderInput>) =>{
            console.log('Order Submitted!', values);
            actions.resetForm();
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

                    {/* RIGHT BLOCK:*/}
                    <li className={css.personalInfo}>
                        <h5 className={css.blockInfoTitle}>Особиста інформація</h5>
                        
                        
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit= {handleSubmit}
                        >
                           {({ isSubmitting }) => (
                                <Form className={css.form}>
                                    
                                    
                                    <div className={css.nameGroup}>
                                        <div className={css.inputWrapper}>
                                          
                                            <label htmlFor="name" className={css.inputLabel}>Ім`я*</label>
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
                                            <label htmlFor="surname" className={css.inputLabel}>Прізвище*</label>
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
                                        <label htmlFor="phone" className={css.inputLabel}>Номер телефону*</label>
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
                                            <label htmlFor="city" className={css.inputLabel}>Місто доставки*</label>
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
                                           <label htmlFor="postNumber" className={css.inputLabel}>Відділення Нової пошти*</label>
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
                                     <label htmlFor="comment" className={css.inputLabel}>Коментар</label>
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