"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";

import css from "./GoodsList.module.css";
import type { RawGood, Good } from "../../types/goods";
import Loader from "../Loader/Loader";
import { api } from "@/app/api/api";

type GoodsFeedback = {
  _id: string;
  rate: number;
  productId: string;
};

export default function GoodsList() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadGoods = async () => {
      setLoading(true);
      setError(null);

      try {
        const list = await fetchGoods();
        if (!isCancelled) {
          setGoods(list);
          if (list.length === 0) {
            setError("Популярні товари тимчасово недоступні.");
          }
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

    void loadGoods();

    return () => {
      isCancelled = true;
    };
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
    <section id="popular_goods" className={css.section}>
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
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
                const realIndex =
                  typeof swiper.realIndex === "number"
                    ? swiper.realIndex
                    : swiper.activeIndex;
                setActiveDot(realIndex % DOTS_COUNT);
              }}
              aria-label="Популярні товари — слайдер товарів"
            >
              {goods.map((good, index) => {
                const imgSrc = buildImageSrc(good.image);
                const ratingValue = (good.rating ?? 0).toFixed(1);

                return (
                  <SwiperSlide key={good.id} tag="li" className={css.card}>
                    <Link
                      href={`/goods/${good.id}`}
                      className={css.link}
                      aria-label={`${good.title} — детальніше`}
                    >
                      <div className={css.imgWrap}>
                        {imgSrc && (
                          <Image
                            src={imgSrc}
                            alt={good.title}
                            className={css.img}
                            width={304}
                            height={375}
                            priority={index === 0}
                          />
                        )}
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
                          <span className={css.ratingValue}>{ratingValue}</span>

                          <svg
                            className={css.commentIcon}
                            aria-hidden="true"
                          >
                            <use href="/symbol-defs.svg#icon-comment" />
                          </svg>
                          <span className={css.reviewsCount}>
                            {good.reviewsCount}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/goods/${good.id}`}
                      className={css.detailsBtn}
                    >
                      Детальніше
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className={css.controls}>
              <div className={css.dots} aria-hidden>
                {Array.from({ length: DOTS_COUNT }).map((_, index) => (
                  <span
                    key={index}
                    className={`${css.dot} ${
                      index === activeDot ? css.dotActive : ""
                    }`}
                  />
                ))}
              </div>

              <div className={css.arrows}>
                <button
                  type="button"
                  className={`${css.arrowBtn} ${
                    !canGoPrev ? css.arrowBtnDisabled : ""
                  }`}
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
                  className={`${css.arrowBtn} ${
                    !canGoNext ? css.arrowBtnDisabled : ""
                  }`}
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

const RAW_BASE_URL: string = api.defaults.baseURL ?? "";
const API_BASE: string = RAW_BASE_URL.replace(/\/+$/, "");
const API_ROOT: string = API_BASE.replace(/\/api$/, "");
const DOTS_COUNT = 5;

const buildImageSrc = (image: string): string => {
  if (!image) return "";

  const trimmed = image.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const normalizedPath = trimmed.replace(/^\/+/, "");
  return `${API_ROOT}/${normalizedPath}`;
};

const getIdFromRaw = (raw: RawGood): string => {
  const rawId = (raw as { _id?: string | { $oid: string } })._id;

  if (typeof rawId === "string") {
    return rawId;
  }

  if (
    typeof rawId === "object" &&
    rawId !== null &&
    "$oid" in rawId &&
    typeof (rawId as { $oid: string }).$oid === "string"
  ) {
    return (rawId as { $oid: string }).$oid;
  }

  return `tmp-${Math.random().toString(36).slice(2)}`;
};

const mapRawGoodToGood = (raw: RawGood): Good => {
  const id = getIdFromRaw(raw);
  const sizes = Array.isArray(raw.size) ? raw.size : [];

  return {
    id,
    title: raw.name,
    image: raw.image,
    price: raw.price?.value ?? 0,
    currency: raw.price?.currency ?? "грн",
    categoryId: undefined,
    sizes,
    reviewsCount: 0,
    rating: 0,
  };
};

/* підрахунок відгуків і рейтинга */
const fetchFeedbackStatsForGood = async (
  goodId: string
): Promise<{ rating: number; reviewsCount: number }> => {
  try {
    const res = await fetch(`/api/feedbacks?productId=${goodId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { rating: 0, reviewsCount: 0 };
    }

    const data: unknown = await res.json();
    let allFeedbacks: GoodsFeedback[] = [];

    if (Array.isArray(data)) {
      allFeedbacks = data as GoodsFeedback[];
    } else {
      const obj = data as { feedbacks?: GoodsFeedback[] };
      allFeedbacks = obj.feedbacks ?? [];
    }

    const filteredFeedbacks = allFeedbacks.filter(
      (feedback) => feedback.productId === goodId
    );

    if (filteredFeedbacks.length === 0) {
      return { rating: 0, reviewsCount: 0 };
    }

    const avg =
      filteredFeedbacks.reduce((sum, f) => sum + f.rate, 0) /
      filteredFeedbacks.length;

    const rounded = Math.round(avg * 2) / 2; // крок 0.5

    return {
      rating: rounded,
      reviewsCount: filteredFeedbacks.length,
    };
  } catch {
    return { rating: 0, reviewsCount: 0 };
  }
};

/** спочатку товар а потім за id відгук */
const fetchGoods = async (): Promise<Good[]> => {
  if (!API_BASE) {
    throw new Error("baseURL не налаштований у api.defaults.baseURL");
  }

  const url = `${API_BASE}/goods`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Помилка запиту: ${response.status}`);
  }

  const data: unknown = await response.json();
  const typed = data as { goods?: RawGood[] };

  if (!Array.isArray(typed.goods)) {
    return [];
  }

  const baseGoods = typed.goods.map(mapRawGoodToGood);
  const goodsWithStats = await Promise.all(
    baseGoods.map(async (good) => {
      const { rating, reviewsCount } = await fetchFeedbackStatsForGood(good.id);
      return {
        ...good,
        rating,
        reviewsCount,
      };
    })
  );

  return goodsWithStats;
};
