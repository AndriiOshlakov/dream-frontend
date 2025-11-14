"use client";

import { useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import css from "./GoodsList.module.css";

/* === Swiper === */
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, A11y, Mousewheel } from "swiper/modules";
import "swiper/css";

/* ===== Типи ===== */

interface Feedback {
  rating?: number;
  rate?: number;
  score?: number;
  value?: number;
  stars?: number;
  text?: string;
}

interface RawIdObj {
  $oid: string;
}

interface RawGood {
  _id?: string | RawIdObj;
  name: string;
  image: string;
  price?: { value: number; currency: string };
  feedbacks?: Feedback[];
  size?: string[];
}

export interface Good {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  reviewsCount: number;
  rating: number;
  sizes: string[];
}

type EnvelopeKeys = "goods" | "items" | "data" | "results" | "docs" | "list";

/* ===== Константи ===== */

const API: string = process.env.NEXT_PUBLIC_API_URL ?? ""; // https://dream-backend-a69s.onrender.com

const DOTS_COUNT = 5;
const ACTIVE_DOT = 0;

/* ===== Хелпери ===== */

const PLACEHOLDER: string =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
       <rect width='100%' height='100%' fill='#e6e6e6'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-family='Inter, system-ui' font-size='24' fill='#888'>
         image not available
       </text>
     </svg>`
  );

const apiJoin: (base: string, path: string) => string = (base, path) =>
  `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

function resolveImage(src?: string): string {
  if (!src) return PLACEHOLDER;
  const isAbsolute: boolean = /^https?:\/\//i.test(src);
  if (isAbsolute) return src;
  return API ? apiJoin(API, src) : PLACEHOLDER;
}

/* ===== Type guards ===== */

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isRawGood(x: unknown): x is RawGood {
  if (!isRecord(x)) return false;
  return typeof x.name === "string" && typeof x.image === "string";
}

function isRawGoodArray(x: unknown): x is RawGood[] {
  return Array.isArray(x) && x.every(isRawGood);
}

function hasListOfRawGood(x: unknown): x is { list: RawGood[] } {
  return isRecord(x) && isRawGoodArray((x as { list?: unknown }).list);
}

function pickList(data: unknown): RawGood[] {
  if (isRawGoodArray(data)) return data;

  if (isRecord(data)) {
    const env = data as Record<EnvelopeKeys, unknown>;
    const keys: EnvelopeKeys[] = ["goods", "items", "data", "results", "docs", "list"];

    for (const k of keys) {
      const v = env[k];
      if (isRawGoodArray(v)) return v;
      if (hasListOfRawGood(v)) return v.list;
    }
  }
  return [];
}

/* ===== Рейтинг і кількість ===== */

function takeRatingValue(f?: Feedback): number | null {
  if (!f) return null;
  const candidates: (number | undefined)[] = [f.rating, f.rate, f.score, f.value, f.stars];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return c;
  }
  return null;
}

function calcRatingAndReviews(feedbacks?: Feedback[]): { rating: number; reviewsCount: number } {
  const reviewsCount: number = Array.isArray(feedbacks) ? feedbacks.length : 0;

  const ratings: number[] = [];
  if (reviewsCount > 0) {
    for (const f of feedbacks as Feedback[]) {
      const val = takeRatingValue(f);
      if (typeof val === "number") ratings.push(val);
    }
  }

  const sum: number = ratings.reduce((s, n) => s + n, 0);
  const avg: number = ratings.length > 0 ? sum / ratings.length : 0;
  const fixed1: number = Math.round(avg * 10) / 10;

  return { rating: fixed1, reviewsCount };
}

/* ===== Нормалізація ===== */

function normalize(g: RawGood): Good {
  let id: string;
  if (typeof g._id === "string") id = g._id;
  else if (isRecord(g._id) && typeof (g._id as RawIdObj).$oid === "string") id = (g._id as RawIdObj).$oid;
  else id = `tmp-${Math.random().toString(36).slice(2)}`;

  const { rating, reviewsCount } = calcRatingAndReviews(g.feedbacks);

  return {
    id,
    title: g.name,
    image: g.image,
    price: g.price?.value ?? 0,
    currency: g.price?.currency ?? "грн",
    reviewsCount,
    rating,
    sizes: Array.isArray(g.size) ? g.size : [],
  };
}

/* ===== Фетч ===== */

async function fetchGoods(apiBase: string, signal?: AbortSignal): Promise<Good[]> {
  const candidates: readonly string[] = [
    apiJoin(apiBase, "/"),
    apiJoin(apiBase, "/goods"),
    apiJoin(apiBase, "/api/goods"),
  ];

  for (const url of candidates) {
    try {
      const res: Response = await fetch(url, { cache: "no-store", signal });
      if (!res.ok) continue;

      const raw: unknown = await res.json();
      const list: RawGood[] = pickList(raw);
      if (!list.length) continue;

      return list.map(normalize);
    } catch {
      continue;
    }
  }
  return [];
}

/* ===== Компонент ===== */

export default function GoodsList(): ReactElement {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1 / 2 / 4 картки на екрані (моб/планш/десктоп)
  const [slidesPerView, setSlidesPerView] = useState<number>(4);

  // скільки карток ВЗАГАЛІ підвантажено (кожен клік по стрілці +3, поки не закінчаться)
  const [loadedCount, setLoadedCount] = useState<number>(4);

  // Swiper інстанс і активна крапка
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeDot, setActiveDot] = useState<number>(ACTIVE_DOT);

  useEffect((): (() => void) | void => {
    if (typeof window === "undefined") return;

    const compute = (): void => {
      const w = window.innerWidth;
      let spv: number;

      if (w < 768) spv = 1;
      else if (w < 1440) spv = 2;
      else spv = 4;

      setSlidesPerView(spv);
      setLoadedCount(spv);
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  useEffect((): (() => void) => {
    const ctrl = new AbortController();

    (async (): Promise<void> => {
      try {
        if (!API) {
          setError("NEXT_PUBLIC_API_URL не задано у .env");
          return;
        }
        const list: Good[] = await fetchGoods(API, ctrl.signal);
        setGoods(list);
        if (list.length === 0) setError("Бекенд повернув порожній список або інший формат.");
      } catch (e) {
        const msg: string = e instanceof Error ? e.message : "невідома помилка";
        setError(`Не вдалось отримати товари (${msg}).`);
      } finally {
        setLoading(false);
      }
    })();

    return (): void => ctrl.abort();
  }, []);

  const renderSkeletons = (n: number): ReactElement => (
    <ul className={css.list} aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className={css.card}>
          <div className={css.imgWrap} />
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <section className={css.section} aria-busy="true">
        <div className="container">
          <div className={css.header}>
            <h2 className={css.title}>Популярні товари</h2>
            <Link href="/goods" className={css.allBtn}>
              Всі товари
            </Link>
          </div>
          {renderSkeletons(slidesPerView)}
        </div>
      </section>
    );
  }

  const displayGoods: Good[] = goods.slice(0, loadedCount);

  const handlePrev = (): void => {
    if (!swiper) return;
    swiper.slidePrev();
  };

  const handleNext = (): void => {
    // спочатку підвантажуємо ще 3 картки, якщо є
    if (goods.length > 0) {
      setLoadedCount((prev) => {
        if (prev < goods.length) {
          const next = Math.min(prev + 3, goods.length);
          return next;
        }
        return prev;
      });
    }

    if (swiper) {
      swiper.slideNext();
    }
  };

  const canGoPrev: boolean = !!swiper && !swiper.isBeginning;
  const hasMoreToLoad: boolean = loadedCount < goods.length;
  const canSlideNext: boolean = !!swiper && !swiper.isEnd;
  const canGoNext: boolean = hasMoreToLoad || canSlideNext;

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні товари</h2>
          <Link href="/goods" className={css.allBtn}>
            Всі товари
          </Link>
        </div>

        {error && (
          <p role="alert" style={{ marginBottom: 12 }}>
            {error}
          </p>
        )}

        {displayGoods.length > 0 ? (
          <Swiper
            tag="ul"
            wrapperTag="ul"
            className={css.list}
            modules={[Keyboard, A11y, Mousewheel]}
            keyboard={{ enabled: true, onlyInViewport: true }}
            mousewheel={{
              forceToAxis: true,
              releaseOnEdges: true,
            }}
            slidesPerView={slidesPerView}
            spaceBetween={24}
            onSwiper={setSwiper}
            onSlideChange={(s): void => {
              const realIndex = typeof s.realIndex === "number" ? s.realIndex : s.activeIndex;
              setActiveDot(realIndex % DOTS_COUNT);
            }}
            aria-label="Популярні товари — слайдер категорій"
          >
            {displayGoods.map((g) => {
              const tight: boolean = g.title.length > 26;

              return (
                <SwiperSlide key={g.id} tag="li" className={css.card}>
                  <Link
                    href={`/goods/${g.id}`}
                    className={css.link}
                    aria-label={`${g.title} — детальніше`}
                  >
                    <div className={css.imgWrap}>
                      <img
                        src={resolveImage(g.image)}
                        alt={g.title}
                        className={css.img}
                        onError={(e): void => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                        }}
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                    </div>

                    <div className={css.info}>
                      <div className={css.headRow}>
                        <h3
                          className={`${css.goodTitle} ${tight ? css.goodTitleTight : ""}`}
                          title={g.title}
                        >
                          {g.title}
                        </h3>
                        <span className={css.price}>
                          {g.price.toLocaleString("uk-UA")} {g.currency}
                        </span>
                      </div>

                      <p className={css.brand}>Clothica</p>

                      {/* Рейтинг і кількість */}
                      <div className={css.ratingRow}>
                        <svg className={css.star} aria-hidden="true">
                          <use href="/symbol-defs.svg#icon-star-filled" />
                        </svg>
                        <span className={css.ratingValue}>{g.rating.toFixed(1)}</span>

                        <svg className={css.commentIcon} aria-hidden="true">
                          <use href="/symbol-defs.svg#icon-comment" />
                        </svg>
                        <span className={css.reviewsCount}>{g.reviewsCount}</span>
                      </div>
                    </div>
                  </Link>

                  <Link href={`/goods/${g.id}`} className={css.detailsBtn}>
                    Детальніше
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          renderSkeletons(slidesPerView)
        )}

        <div className={css.controls}>
          <div className={css.dots} aria-hidden>
            {Array.from({ length: DOTS_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`${css.dot} ${i === activeDot ? css.dotActive : ""}`}
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
      </div>
    </section>
  );
}
