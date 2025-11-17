"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import css from "./CategoriesList.module.css";
import type { Category, CategoriesResponse } from "../../types/category";

import Img1 from "../../public/images/t_shirts.webp";
import Img2 from "../../public/images/jeans.webp";
import Img3 from "../../public/images/jackets.webp";
import Img4 from "../../public/images/tops.webp";
import Img5 from "../../public/images/dresses.webp";
import Img6 from "../../public/images/sportswear.webp";

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const list = await fetchCategories();
        if (!isCancelled) {
          setCategories(list);
        }
      } catch (e) {
        if (!isCancelled) {
          const message =
            e instanceof Error ? e.message : "Невідома помилка запиту";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  const canGoPrev = !isBeginning;
  const canGoNext = !isEnd;

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні категорії</h2>

          <Link href="/categories" className={css.allBtn}>
            Всі категорії
          </Link>
        </div>

        {loading && <p>Завантаження...</p>}
        {error && !loading && <p className={css.error}>{error}</p>}

        {!loading && !error && categories.length > 0 && (
          <div className={css.sliderWrapper}>
          
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={css.arrowBtn}
            >
              <svg className={css.icon}>
                <use href="/symbol-defs.svg#icon-arrow_back" />
              </svg>
            </button>

            <Swiper
              modules={[Keyboard]}
              keyboard={{ enabled: true, onlyInViewport: true }}
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1440: { slidesPerView: 3 },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              className={css.list}
              tag="ul"
            >
              {categories.map((category, index) => {
                const img = CATEGORY_IMAGES[index] ?? CATEGORY_IMAGES[0];

                return (
                  <SwiperSlide key={category._id} tag="li">
                    <Link
                      href={`/categories/${category._id}`}
                      className={css.card}
                    >
                      <div className={css.imgWrap}>
                        <Image
                          src={img}
                          alt={category.name}
                          width={416}
                          height={277}
                          className={css.img}
                        />
                      </div>

                      <p className={css.cardTitle}>{category.name}</p>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className={css.arrowBtn}
            >
              <svg className={css.icon}>
                <use href="/symbol-defs.svg#icon-arrow_forward" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const CATEGORY_IMAGES = [Img1, Img2, Img3, Img4, Img5, Img6];

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`/api/categories?page=1&perPage=6`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Помилка запиту: ${response.status}`);
  }

  const data = (await response.json()) as CategoriesResponse;
  return data.categories ?? [];
}
