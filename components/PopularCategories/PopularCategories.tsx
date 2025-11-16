'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import css from './PopularCategories.module.css';
import Link from 'next/link';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { fetchCategoriesClient, getCategories } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { localCategories } from '@/constants/localCategories';

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // -------------------------------------------------------------
  // 1) Завантаження початкових категорій
  // -------------------------------------------------------------
  useEffect(() => {
    const loadInitialCategories = async () => {
      try {
        setLoading(true);

        const response = await fetchCategoriesClient(1, 3);

        const categoriesWithImages = (response.categories || []).map((category) => ({
          ...category,
          img: localCategories[category._id] || '/img/categories/others.jpg',
        }));

        setCategories(categoriesWithImages);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalItems);
        setCurrentPage(1);

        setIsPrevDisabled(true);
        setIsNextDisabled(
          response.page >= response.totalPages || categoriesWithImages.length >= response.totalItems
        );
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCategories();
  }, []);

  // -------------------------------------------------------------
  // 2) Завантаження додаткових категорій
  // -------------------------------------------------------------
  const loadMoreCategories = useCallback(
    async (direction: 'next' | 'prev') => {
      if (isLoadingMore) return;

      const nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1;

      if (nextPage < 1 || nextPage > totalPages) return;

      try {
        setIsLoadingMore(true);

        const response = await getCategories(nextPage);

        const newCategories = (response || []).map((category) => ({
          ...category,
          img: localCategories[category._id] || '/img/categories/others.jpg',
        }));

        // Унікальні категорії
        const existingIds = new Set(categories.map((cat) => cat._id));
        const uniqueNewCategories = newCategories.filter((cat) => !existingIds.has(cat._id));

        if (direction === 'next') {
          setCategories((prev) => [...prev, ...uniqueNewCategories]);
        } else {
          setCategories((prev) => [...uniqueNewCategories, ...prev]);
        }

        setCurrentPage(nextPage);
        setIsPrevDisabled(nextPage <= 1);

        const totalLoaded = categories.length + uniqueNewCategories.length;

        setIsNextDisabled(nextPage >= totalPages || totalLoaded >= totalItems);
      } catch (error) {
        console.error('❌ Error loading more categories:', error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [currentPage, totalPages, totalItems, categories, isLoadingMore]
  );

  // -------------------------------------------------------------
  // 3) Зміна слайду — оновлення стану кнопок
  // -------------------------------------------------------------
  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const slidesPerView = swiper.params.slidesPerView as number;
      const currentIndex = swiper.activeIndex;
      const totalSlides = swiper.slides.length;

      const isAtEnd = currentIndex + slidesPerView >= totalSlides;

      setIsPrevDisabled(!swiper.allowSlidePrev);
      setIsNextDisabled(isAtEnd && currentPage >= totalPages);
    },
    [currentPage, totalPages]
  );

  // -------------------------------------------------------------
  // 4) Клік по кнопці Next
  // -------------------------------------------------------------
  const handleNextClick = useCallback(async () => {
    if (isNextDisabled || isLoadingMore) return;

    const swiper = swiperRef.current;
    if (!swiper) return;

    const slidesPerView = swiper.params.slidesPerView as number;
    const currentIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    if (currentIndex + slidesPerView >= totalSlides - 1 && currentPage < totalPages) {
      await loadMoreCategories('next');
      setTimeout(() => swiper.slideNext(), 100);
    } else {
      swiper.slideNext();
    }
  }, [isNextDisabled, isLoadingMore, currentPage, totalPages, loadMoreCategories]);

  // -------------------------------------------------------------
  // 5) Клік по кнопці Prev
  // -------------------------------------------------------------
  const handlePrevClick = useCallback(() => {
    if (isPrevDisabled) return;

    const swiper = swiperRef.current;
    if (swiper) swiper.slidePrev();
  }, [isPrevDisabled]);

  // -------------------------------------------------------------
  // 6) Лоудінг та пустий стан
  // -------------------------------------------------------------
  if (loading) {
    return (
      <section className={css.section} id="PopularCategories">
        <div className={css.container}>
          <h2 className={css.title}>Популярні категорії</h2>
          <p>Завантаження категорій...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className={css.section} id="PopularCategories">
        <div className="container">
          <div className={css.title_button}>
            <h2 className={css.title}>Популярні категорії</h2>
            <Link href="/categories" className={css.button}>
              Всі категорії
            </Link>
          </div>
          <p>Не вдалося завантажити категорії або список порожній.</p>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 7) Рендер компоненту
  // -------------------------------------------------------------
  return (
    <section className={css.section} id="PopularCategories">
      <div className="container">
        <div className={css.title_button}>
          <h2 className={css.title}>Популярні категорії</h2>
          <Link href="/categories" className={css.button}>
            Всі категорії
          </Link>
        </div>

        <div className={css.sliderContainer}>
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            keyboard={{ enabled: true }}
            spaceBetween={34}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              0: { slidesPerView: 1, slidesPerGroup: 1 },
              768: { slidesPerView: 2, slidesPerGroup: 1 },
              1024: { slidesPerView: 2, slidesPerGroup: 2 },
              1440: { slidesPerView: 3, slidesPerGroup: 3 },
            }}
            className={css.swiper}
            a11y={{ enabled: true }}
          >
            {categories.map((item) => (
              <SwiperSlide key={item._id} className={css.item}>
                <Link href="/categories" className={css.card}>
                  <div className={css.imageWrapper}>
                    <Image
                      src={item.img ?? '/img/categories/others.jpg'}
                      alt={item.name}
                      className={css.image}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <p className={css.name}>{item.name}</p>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={css.controls}>
            <button
              type="button"
              className={`${css.btnPrev} ${isPrevDisabled ? css.disabled : ''}`}
              aria-label="Prev"
              onClick={handlePrevClick}
              disabled={isPrevDisabled}
            >
              ←
            </button>

            <button
              type="button"
              className={`${css.btnNext} ${isNextDisabled ? css.disabled : ''}`}
              aria-label="Next"
              onClick={handleNextClick}
              disabled={isNextDisabled || isLoadingMore}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
