'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import { fetchReviews, type Review } from './CustomersReviews';
import css from './ReviewsList.module.css';

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    fetchReviews().then((data) => {
      setReviews(data);
      setIsLoading(false);
    });
  }, []);

  const updateSwiperEdgeState = () => {
    const swiperInstance = swiperRef.current;
    if (!swiperInstance) return;

    setIsAtStart(swiperInstance.isBeginning);
    setIsAtEnd(swiperInstance.isEnd);
  };

  const handlePrevSlideClick = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.slidePrev();
  };

  const handleNextSlideClick = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    swiper.slideNext();
  };

  useEffect(() => {
    if (!isLoading && reviews.length > 0) {
      setTimeout(updateSwiperEdgeState, 100);
    }
  }, [isLoading, reviews.length]);

  if (isLoading) {
    return <div className={css.container}>Завантаження відгуків...</div>;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <p className={css.title}>Останні відгуки</p>
        <div className={css.navigation}>
          <button
            type="button"
            className={`${css.navButton} ${isAtStart ? css.navButtonDisabled : ''}`}
            onClick={handlePrevSlideClick}
            disabled={isAtStart}
            aria-label="Попередні відгуки"
          >
            <svg className={css.icon}>
              <use href="/symbol-defs.svg#icon-arrow_back" />
            </svg>
          </button>
          <button
            type="button"
            className={`${css.navButton} ${isAtEnd ? css.navButtonDisabled : ''}`}
            onClick={handleNextSlideClick}
            disabled={isAtEnd}
            aria-label="Наступні відгуки"
          >
            <svg className={css.icon}>
              <use href="/symbol-defs.svg#icon-arrow_forward" />
            </svg>
          </button>
        </div>
      </div>

      <Swiper
        modules={[Keyboard, A11y]}
        keyboard={{ enabled: true }}
        slidesPerView={1}
        spaceBetween={20}
        slidesPerGroup={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        }}
        onSwiper={(instance) => {
          swiperRef.current = instance;

          setTimeout(updateSwiperEdgeState, 50);
        }}
        onSlideChange={updateSwiperEdgeState}
        onInit={updateSwiperEdgeState}
        className={css.swiperContainer}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className={css.card}>
              <div className={css.cardHeader}>
                <p className={css.name}>{review.name}</p>
                <p className={css.rating}>{'⭐'.repeat(review.rating)}</p>
              </div>
              <p className={css.comment}>{review.comment}</p>
              <p className={css.category}>{review.category}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
