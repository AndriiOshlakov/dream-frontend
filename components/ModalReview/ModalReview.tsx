'use client';

import { toast } from 'react-toastify';
import css from './ModalReview.module.css';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFeedback } from '@/lib/api/clientApi';

interface ModalReviewProps {
  onClose: () => void;
  productId: string;
  category: string;
}

export default function ModalReview({ onClose, productId, category }: ModalReviewProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Оберіть рейтинг ★');
      return;
    }
    await mutation.mutateAsync({
      author: name.trim(),
      description: text.trim(),
      rate: rating,
      category,
      productId,
    });
  };

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
    <div className={css.backdrop}>
      <div className={css.modalReviewContainer}>
        <button type="button" className={css.reviewCloseBtn} onClick={onClose}>
          <svg className={css.reviewClose} width="24" height="24">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className={css.formReview}>
          <h2 className={css.titleReview}>Залишити відгук</h2>
          <div className={css.contForm}>
            <label className={css.labelReview}>Ваше імʼя</label>
            <input
              type="text"
              className={css.inputReview}
              placeholder="Ваше ім'я"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={css.contReview}>
            <label className={css.labelReview}>Відгук</label>
            <textarea
              placeholder="Ваш відгук"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={css.reviewText}
              required
            />
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
        </form>
      </div>
    </div>
  );
}
