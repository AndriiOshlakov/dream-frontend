'use client';

import { toast } from 'react-toastify';
import css from './ModalReview.module.css';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFeedback } from '@/lib/api/clientApi';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface ModalReviewProps {
  onClose: () => void;
  productId: string;
  category: string;
}

const validationSchema = Yup.object({
  name: Yup.string().max(20, "Ім'я занадто довге").required("Ім'я є обов'язковим полем"),
  text: Yup.string().max(500, 'Коментар занадто довгий'),
});

export default function ModalReview({ onClose, productId, category }: ModalReviewProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      author: string;
      description: string;
      rate: number;
      category: string;
      productId: string;
    }) => {
      return sendFeedback(data);
    },
    onSuccess: () => {
      toast.success('Ваш відгук успішно надіслано!');
      queryClient.invalidateQueries({ queryKey: ['feedbacks', productId] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  const StarIcon = ({
    filled,
    onClick,
    onMouseEnter,
    onMouseLeave,
  }: {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => (
    <svg
      role="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={filled ? css.starActive : css.starInactive}
      width="24"
      height="24"
    >
      <use href="/symbol-defs.svg#icon-star" />
    </svg>
  );

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modalReviewContainer} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={css.reviewCloseBtn} onClick={onClose}>
          <svg className={css.reviewClose} width="24" height="24">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>
        <Formik
          initialValues={{ name: '', text: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (!rating) {
              toast.error('Оберіть рейтинг ★');
              return;
            }

            mutation.mutate({
              author: values.name.trim(),
              description: values.text.trim(),
              rate: rating,
              category,
              productId,
            });
          }}
        >
          {() => (
            <Form className={css.formReview}>
              <h2 className={css.titleReview}>Залишити відгук</h2>

              <div className={css.contForm}>
                <label className={css.labelReview}>Ваше імʼя</label>
                <Field
                  name="name"
                  type="text"
                  className={css.inputReview}
                  placeholder="Ваше ім'я"
                />
                <ErrorMessage name="name" component="div" className={css.errorText} />
              </div>

              <div className={css.contReview}>
                <label className={css.labelReview}>Відгук</label>
                <Field
                  as="textarea"
                  name="text"
                  placeholder="Ваш відгук"
                  className={css.reviewText}
                />
                <ErrorMessage name="text" component="div" className={css.errorText} />
              </div>

              <div className={css.rating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={star <= (hovered || rating)}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                  />
                ))}
              </div>

              <button type="submit" className={css.reviewBtn} disabled={mutation.isPending}>
                {mutation.isPending ? 'Надсилаємо...' : 'Надіслати'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
