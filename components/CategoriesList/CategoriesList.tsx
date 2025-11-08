'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import type { Category } from '../../types/category';
import css from './CategoriesList.module.css';
import Image from 'next/image';

interface CategoriesListProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
}

export default function CategoriesList({ categories, onCategoryClick }: CategoriesListProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!categories.length) return null;

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div className={css.wrapper}>
      <button
        type="button"
        onClick={handlePrev}
        disabled={isBeginning}
        aria-label="Попередні категорії"
        className={`${css.navButton} ${css.prevButton}`}
      >
        ‹
      </button>

      <Swiper
        modules={[Keyboard]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        className={css.swiper}
        tag="ul"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} tag="li" className={css.slide}>
            <button type="button" className={css.card} onClick={() => onCategoryClick?.(category)}>
              <div className={css.imageWrapper}>
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  className={css.image}
                  loading="lazy"
                  width={416}
                  height={277}
                />
              </div>
              <p className={css.title}>{category.title}</p>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={handleNext}
        disabled={isEnd}
        aria-label="Наступні категорії"
        className={`${css.navButton} ${css.nextButton}`}
      >
        ›
      </button>
    </div>
  );
}
