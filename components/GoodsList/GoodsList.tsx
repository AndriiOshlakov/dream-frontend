"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";

import css from "./GoodsList.module.css";
import type { RawGood, Good } from "../../types/goods";
import Loader from "../Loader/Loader";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const DOTS_COUNT = 5;

// Будуємо коректний src для картинки
const buildImageSrc = (image: string): string => {
  if (!image) return "";

  const trimmed = image.trim();

  // Якщо бекенд повернув повний URL — не чіпаємо
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Якщо "/img/goods/xxx.webp" або "img/goods/xxx.webp" — чіпляємо твій бекенд
  return `${API_BASE}/${trimmed.replace(/^\/+/, "")}`;
};

const mapRawGoodToGood = (raw: RawGood): Good => {
  // _id може бути string або { $oid: string }
  const rawId = (raw as unknown as { _id?: string | { $oid: string } })._id;
  let id = "";

  if (typeof rawId === "string") {
    id = rawId;
  } else if (
    rawId &&
    typeof (rawId as { $oid?: string }).$oid === "string"
  ) {
    id = (rawId as { $oid: string }).$oid;
  } else {
    id = `tmp-${Math.random().toString(36).slice(2)}`;
  }

  // категорій у бекенді немає → просто undefined
  const categoryId = undefined;

  // feedbacks — масив обʼєктів з рейтингом
  const feedbacks = (raw as unknown as { feedbacks?: unknown }).feedbacks;
  let reviewsCount = 0;
  let rating = 0;

  if (Array.isArray(feedbacks) && feedbacks.length > 0) {
    reviewsCount = feedbacks.length;

    const numericRatings = feedbacks
      .map(
        (f: any) =>
          f.rating ?? f.rate ?? f.score ?? f.value ?? f.stars ?? null
      )
      .filter(
        (val: unknown): val is number =>
          typeof val === "number" && Number.isFinite(val)
      );

    if (numericRatings.length > 0) {
      const sum = numericRatings.reduce((acc, n) => acc + n, 0);
      rating = Math.round((sum / numericRatings.length) * 10) / 10;
    }
  }

  return {
    id,
    title: raw.name,
    image: raw.image, // сирий шлях, нормальний src зробимо в JSX через buildImageSrc
    price: raw.price?.value ?? 0,
    currency: raw.price?.currency ?? "грн",
    categoryId,
    sizes: Array.isArray(raw.size) ? raw.size : [],
    reviewsCount,
    rating,
  };
};

const fetchGoods = async (): Promise<Good[]> => {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_URL не задано у .env");
  }

  const url = `${API_BASE}/api/goods`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Помилка запиту: ${res.status}`);
  }

  const data = (await res.json()) as { goods?: RawGood[] };

  if (!Array.isArray(data.goods)) {
    return [];
  }

  return data.goods.map(mapRawGoodToGood);
};

export default function GoodsList() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  // фетч товарів
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchGoods()
      .then((list) => {
        setGoods(list);
        if (list.length === 0) {
          setError("Популярні товари тимчасово недоступні.");
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Невідома помилка");
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const canGoPrev = !isBeginning;
  const canGoNext = !isEnd;

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні товари</h2>
          <Link href="/goods" className={css.allBtn}>
            Всі товари
          </Link>
        </div>

        {loading && <Loader />}

        {error && !loading && (
          <p role="alert" style={{ marginBottom: 12 }}>
            {error}
          </p>
        )}

        {!loading && !error && goods.length > 0 && (
          <>
            <Swiper
              modules={[Keyboard, A11y, Mousewheel]}
              keyboard={{ enabled: true, onlyInViewport: true }}
              mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1440: { slidesPerView: 4 },
              }}
              tag="ul"
              className={css.list}
              onSwiper={(instance) => {
                swiperRef.current = instance;
                setIsBeginning(instance.isBeginning);
                setIsEnd(instance.isEnd);
              }}
              onSlideChange={(s) => {
                setIsBeginning(s.isBeginning);
                setIsEnd(s.isEnd);
                const realIndex =
                  typeof s.realIndex === "number"
                    ? s.realIndex
                    : s.activeIndex;
                setActiveDot(realIndex % DOTS_COUNT);
              }}
              aria-label="Популярні товари — слайдер товарів"
            >
              {goods.map((good) => {
                const imgSrc = buildImageSrc(good.image);

                return (
                  <SwiperSlide key={good.id} tag="li" className={css.card}>
                    <Link
                      href={`/goods/${good.id}`}
                      className={css.link}
                      aria-label={`${good.title} — детальніше`}
                    >
                      <div className={css.imgWrap}>
                        <img
                          src={imgSrc}
                          alt={good.title}
                          className={css.img}
                          width={304}
                          height={375}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className={css.info}>
                        <div className={css.headRow}>
                          <h3 className={css.goodTitle} title={good.title}>
                            {good.title}
                          </h3>
                          <span className={css.price}>
                            {good.price.toLocaleString("uk-UA")}{" "}
                            {good.currency}
                          </span>
                        </div>

                        <p className={css.brand}>Clothica</p>

                        <div className={css.ratingRow}>
                          <svg className={css.star} aria-hidden="true">
                            <use href="/symbol-defs.svg#icon-star-filled" />
                          </svg>
                          <span className={css.ratingValue}>
                            {(good.rating ?? 0).toFixed(1)}
                          </span>

                          <svg className={css.commentIcon} aria-hidden="true">
                            <use href="/symbol-defs.svg#icon-comment" />
                          </svg>
                          <span className={css.reviewsCount}>
                            {good.reviewsCount}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <Link href={`/goods/${good.id}`} className={css.detailsBtn}>
                      Детальніше
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className={css.controls}>
              <div className={css.dots} aria-hidden>
                {Array.from({ length: DOTS_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className={`${css.dot} ${
                      i === activeDot ? css.dotActive : ""
                    }`}
                  />
                ))}
              </div>

              <div className={css.arrows}>
                <button
                  type="button"
                  className={css.arrowBtn}
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  aria-label="Попередні товари"
                >
                  <svg className={css.icon}>
                    <use href="/symbol-defs.svg#icon-arrow_back" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={css.arrowBtn}
                  onClick={handleNext}
                  disabled={!canGoNext}
                  aria-label="Наступні товари"
                >
                  <svg className={css.icon}>
                    <use href="/symbol-defs.svg#icon-arrow_forward" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
