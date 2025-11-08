'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { fetchFakeReviews, type Review } from './FakeReviews';
import css from './ReviewsList.module.css';

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchFakeReviews(10).then(setReviews);
  }, []);

  return (
    <div>
      <p>Останні відгуки</p>
      <Swiper slidesPerView={3} spaceBetween={20}>
        {reviews.map((review, i) => (
          <SwiperSlide key={i}>
            <div className={css.card}>
              <p>{review.name}</p>
              <p>{'⭐'.repeat(review.rating)}</p>
              <p>{review.comment}</p>
              <p>{review.category}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
