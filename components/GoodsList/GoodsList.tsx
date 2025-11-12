"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import css from "./GoodsList.module.css";

/* ---- типи ---- */
type RawGood = {
  _id: string | { $oid: string };
  name: string;
  image: string;
  price?: { value: number; currency: string };
  feedbacks?: unknown[];
  rating?: number;
  size?: string[];
};

type Good = {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  reviewsCount: number;
  rating: number;
  sizes: string[];
};

const API = process.env.NEXT_PUBLIC_API_URL;
const TOP_N = 12;

const USE_SWIPER = false;

/* Моки */
const MOCK: Good[] = [
  { id: "mock-1", title: "Світшот 'Minimal Black'", image: "https://ftp.goit.study/img/goods/6877b9f116ae59c7b60d0107.webp", price: 1299, currency: "грн", reviewsCount: 12, rating: 4.7, sizes: ["XS","S","M","L","XL"] },
  { id: "mock-2", title: "Худі 'Soft Line White'", image: "https://ftp.goit.study/img/goods/6877b9f116ae59c7b60d0112.webp", price: 1499, currency: "грн", reviewsCount: 8, rating: 4.5, sizes: ["S","M","L","XL"] },
  { id: "mock-3", title: "Футболка 'Urban Minimal Grey'", image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop", price: 899, currency: "грн", reviewsCount: 23, rating: 4.8, sizes: ["XS","S","M"] },
  { id: "mock-4", title: "Сукня 'Office Chic Navy'", image: "https://images.unsplash.com/photo-1542326237-94b1d4e2c4d4?q=80&w=1200&auto=format&fit=crop", price: 2599, currency: "грн", reviewsCount: 15, rating: 4.6, sizes: ["M","L","XL"] },
];

/* === Безпечний резолвер картинок === */
const PLACEHOLDER =
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

function resolveImage(src?: string): string {
  if (!src) return PLACEHOLDER;
  const isAbsolute = /^https?:\/\//i.test(src);
  if (isAbsolute) return src;
  if (API) return `${API}${src.startsWith("/") ? "" : "/"}${src}`;
  return PLACEHOLDER;
}

function normalize(g: RawGood): Good {
  const id = typeof g._id === "string" ? g._id : g._id?.$oid ?? crypto.randomUUID();
  return {
    id,
    title: g.name,
    image: g.image,
    price: g.price?.value ?? 0,
    currency: g.price?.currency ?? "грн",
    reviewsCount: Array.isArray(g.feedbacks) ? g.feedbacks.length : 0,
    rating: typeof g.rating === "number" ? g.rating : 0,
    sizes: g.size ?? [],
  };
}

export default function GoodsList() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* фетч із запасними url */
  useEffect(() => {
    const ctrl = new AbortController();

    async function run() {
      if (!API) {
        setError("NEXT_PUBLIC_API_URL не задано у .env");
        setGoods(MOCK);
        setLoading(false);
        return;
      }

      const urls = [
        `${API}/api/goods`,
        `${API}/api/goods?limit=${TOP_N}`,
        `${API}/api/goods?page=1&limit=${TOP_N}`,
        `${API}/api/goods?perPage=${TOP_N}`,
      ];
      let lastErr = null;

      for (const url of urls) {
        try {
          const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
          const data = await res.json();
          const list: RawGood[] = Array.isArray((data).goods)
            ? (data).goods
            : Array.isArray(data)
            ? data
            : [];
          if (!list.length) {
            lastErr = new Error(`Порожня відповідь @ ${url}`);
            continue;
          }
          const normalized = list.map(normalize);
          normalized.sort((a, b) => (b.reviewsCount - a.reviewsCount) || (b.rating - a.rating));
          setGoods(normalized.slice(0, TOP_N));
          setLoading(false);
          return;
        } catch (e) {
          lastErr = e;
        }
      }

      setError(`Не вдалось отримати товари. Показую мок-дані.`);
      setGoods(MOCK.slice(0, TOP_N));
      setLoading(false);
    }

    run();
    return () => ctrl.abort();
  }, []);

  if (loading) {
    return (
      <section className={css.section} aria-busy="true">
        <div className="container">
          <div className={css.header}>
            <h2 className={css.title}>Популярні товари</h2>
            <Link href="/goods" className={css.allBtn}>Всі товари</Link>
          </div>
          <ul className={css.list} aria-hidden>
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className={css.card}><div className={css.imgWrap} /></li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні товари</h2>
          <Link href="/goods" className={css.allBtn}>Всі товари</Link>
        </div>

        {error && <p role="alert" style={{ marginBottom: 12 }}>{error}</p>}

        {/* === Сітка без слайдера === */}
        <ul className={css.list}>
          {goods.slice(0, 4).map((g) => {
            const hasRating = g.rating > 0;
            const hasReviews = g.reviewsCount > 0;
            const isTight = g.title.length > 26;

            return (
              <li key={g.id} className={css.card}>
                <Link href={`/goods/${g.id}`} className={css.link} aria-label={`${g.title} — детальніше`}>
                  <div className={css.imgWrap}>
                    <img
                      src={resolveImage(g.image)}
                      alt={g.title}
                      className={css.img}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                      loading="lazy"
                      width={1200}
                      height={800}
                    />
                  </div>

                  <div className={css.info}>
                    <div className={css.headRow}>
                      <h3 className={`${css.goodTitle} ${isTight ? css.goodTitleTight : ""}`} title={g.title}>
                        {g.title}
                      </h3>
                      <span className={css.price}>
                        {g.price.toLocaleString("uk-UA")} {g.currency}
                      </span>
                    </div>

                    <p className={css.brand}>Clothica</p>

                    {(hasRating || hasReviews) && (
                      <div className={css.ratingRow}>
                        <svg className={css.star} aria-hidden="true">
                          <use href="/symbol-defs.svg#icon-star-filled" />
                        </svg>

                        {hasRating && (
                          <span className={css.ratingValue}>{g.rating.toFixed(1)}</span>
                        )}

                        {hasReviews && (
                          <>
                            <svg className={css.commentIcon} aria-hidden="true">
                              <use href="/symbol-defs.svg#icon-comment" />
                            </svg>
                            <span className={css.reviewsCount}>{g.reviewsCount}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Link>

                <Link href={`/goods/${g.id}`} className={css.detailsBtn}>Детальніше</Link>
              </li>
            );
          })}
        </ul>

        
        <div className={css.controls}>
          <div className={css.dots} aria-hidden>
            <span className={`${css.dot} ${css.dotActive}`} />
            <span className={css.dot} />
            <span className={css.dot} />
          </div>

          <div className={css.arrows}>
            <button type="button" className={css.arrowBtn} disabled>
              <svg className={css.icon}>
                <use href="/symbol-defs.svg#icon-arrow_back" />
              </svg>
            </button>
            <button type="button" className={css.arrowBtn} disabled>
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
