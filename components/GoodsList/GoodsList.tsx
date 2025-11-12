// "use client";

// import { useEffect, useState, type ReactElement } from "react";
// import Link from "next/link";
// import css from "./GoodsList.module.css";

// /* ================== Типи ================== */

// interface Feedback {
//   rating?: number;
//   text?: string;
// }

// interface RawGood {
//   _id: string | { $oid: string };
//   name: string;
//   image: string;
//   price?: { value: number; currency: string };
//   feedbacks?: Feedback[];
//   size?: string[];
// }

// export interface Good {
//   id: string;
//   title: string;
//   image: string;
//   price: number;
//   currency: string;
//   reviewsCount: number;
//   rating: number;
//   sizes: string[];
// }

// /* ================== Константи ================== */

// const API: string = process.env.NEXT_PUBLIC_API_URL ?? ""; // https://dream-backend-a69s.onrender.com

// /* ================== Хелпери ================== */

// const PLACEHOLDER =
//   "data:image/svg+xml;charset=utf-8," +
//   encodeURIComponent(
//     `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
//        <rect width='100%' height='100%' fill='#e6e6e6'/>
//        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
//              font-family='Inter, system-ui' font-size='24' fill='#888'>
//          image not available
//        </text>
//      </svg>`
//   );

// const apiJoin = (base: string, path: string) =>
//   `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

// function resolveImage(src?: string): string {
//   if (!src) return PLACEHOLDER;
//   const isAbsolute = /^https?:\/\//i.test(src);
//   if (isAbsolute) return src;
//   return API ? apiJoin(API, src) : PLACEHOLDER;
// }

// /* ================== Перевірки ================== */

// function isRawGood(x: unknown): x is RawGood {
//   if (typeof x !== "object" || x === null) return false;
//   const g = x as Record<string, unknown>;
//   return typeof g.name === "string" && typeof g.image === "string";
// }

// function isRawGoodArray(x: unknown): x is RawGood[] {
//   return Array.isArray(x) && x.every(isRawGood);
// }

// function pickList(data: unknown): RawGood[] {
//   if (isRawGoodArray(data)) return data;
//   if (typeof data === "object" && data) {
//     const possibleKeys = ["goods", "items", "data", "results", "docs", "list"] as const;
//     for (const key of possibleKeys) {
//       const v = (data as Record<string, unknown>)[key];
//       if (isRawGoodArray(v)) return v;
//       if (typeof v === "object" && v && isRawGoodArray((v as any).list)) return (v as any).list;
//     }
//   }
//   return [];
// }

// /* ================== Підрахунок рейтингу ================== */

// function calcRatingAndReviews(feedbacks?: Feedback[]): { rating: number; reviewsCount: number } {
//   if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
//     return { rating: 0, reviewsCount: 0 };
//   }

//   const ratings = feedbacks
//     .map((f) => (typeof f.rating === "number" ? f.rating : 0))
//     .filter((r) => r > 0);

//   if (ratings.length === 0) {
//     return { rating: 0, reviewsCount: feedbacks.length };
//   }

//   const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
//   return { rating: Number(average.toFixed(1)), reviewsCount: feedbacks.length };
// }

// /* ================== Нормалізація ================== */

// function normalize(g: RawGood): Good {
//   const id =
//     typeof g._id === "string"
//       ? g._id
//       : g._id?.$oid ??
//         (typeof crypto !== "undefined" && "randomUUID" in crypto
//           ? crypto.randomUUID()
//           : `tmp-${Math.random().toString(36).slice(2)}`);

//   const { rating, reviewsCount } = calcRatingAndReviews(g.feedbacks);

//   return {
//     id,
//     title: g.name,
//     image: g.image,
//     price: g.price?.value ?? 0,
//     currency: g.price?.currency ?? "грн",
//     reviewsCount,
//     rating,
//     sizes: Array.isArray(g.size) ? g.size : [],
//   };
// }

// /* ================== Фетч ================== */

// async function fetchGoods(apiBase: string, signal?: AbortSignal): Promise<Good[]> {
//   const candidates: readonly string[] = [
//     apiJoin(apiBase, "/"),
//     apiJoin(apiBase, "/goods"),
//     apiJoin(apiBase, "/api/goods"),
//   ];

//   for (const url of candidates) {
//     try {
//       const res = await fetch(url, { cache: "no-store", signal });
//       if (!res.ok) continue;
//       const raw: unknown = await res.json();
//       const list = pickList(raw);
//       if (!list.length) continue;
//       return list.map(normalize);
//     } catch {
//       continue;
//     }
//   }

//   return [];
// }

// /* ================== Компонент ================== */

// export default function GoodsList(): ReactElement {
//   const [goods, setGoods] = useState<Good[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [visibleCount, setVisibleCount] = useState<number>(4);

//   // визначення кількості для різних екранів
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const width = window.innerWidth;
//     if (width < 768) setVisibleCount(1);
//     else if (width < 1280) setVisibleCount(2);
//     else setVisibleCount(4);
//   }, []);

//   useEffect(() => {
//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         if (!API) {
//           setError("NEXT_PUBLIC_API_URL не задано у .env");
//           return;
//         }
//         const list = await fetchGoods(API, ctrl.signal);
//         setGoods(list);
//         if (list.length === 0) {
//           setError("Бекенд повернув порожній список або невірний формат.");
//         }
//       } catch (e) {
//         const msg = e instanceof Error ? e.message : "невідома помилка";
//         setError(`Не вдалось отримати товари (${msg}).`);
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ctrl.abort();
//   }, []);

//   if (loading) {
//     return (
//       <section className={css.section} aria-busy="true">
//         <div className="container">
//           <div className={css.header}>
//             <h2 className={css.title}>Популярні товари</h2>
//             <Link href="/goods" className={css.allBtn}>Всі товари</Link>
//           </div>
//           <ul className={css.list} aria-hidden>
//             {Array.from({ length: visibleCount }).map((_, i) => (
//               <li key={i} className={css.card}>
//                 <div className={css.imgWrap} />
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//     );
//   }

//   const show = goods.slice(0, visibleCount);

//   return (
//     <section className={css.section}>
//       <div className="container">
//         <div className={css.header}>
//           <h2 className={css.title}>Популярні товари</h2>
//           <Link href="/goods" className={css.allBtn}>Всі товари</Link>
//         </div>

//         {error && <p role="alert" style={{ marginBottom: 12 }}>{error}</p>}

//         {show.length > 0 ? (
//           <ul className={css.list}>
//             {show.map((g) => {
//               const tight = g.title.length > 26;

//               return (
//                 <li key={g.id} className={css.card}>
//                   <Link
//                     href={`/goods/${g.id}`}
//                     className={css.link}
//                     aria-label={`${g.title} — детальніше`}
//                   >
//                     <div className={css.imgWrap}>
//                       <img
//                         src={resolveImage(g.image)}
//                         alt={g.title}
//                         className={css.img}
//                         onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
//                         loading="lazy"
//                         width={1200}
//                         height={800}
//                       />
//                     </div>

//                     <div className={css.info}>
//                       <div className={css.headRow}>
//                         <h3
//                           className={`${css.goodTitle} ${tight ? css.goodTitleTight : ""}`}
//                           title={g.title}
//                         >
//                           {g.title}
//                         </h3>

//                         <span className={css.price}>
//                           {g.price.toLocaleString("uk-UA")} {g.currency}
//                         </span>
//                       </div>

//                       <p className={css.brand}>Clothica</p>

//                       {(g.rating > 0 || g.reviewsCount > 0) && (
//                         <div className={css.ratingRow}>
//                           <svg className={css.star} aria-hidden="true">
//                             <use href="/symbol-defs.svg#icon-star-filled" />
//                           </svg>

//                           {g.rating > 0 && (
//                             <span className={css.ratingValue}>{g.rating.toFixed(1)}</span>
//                           )}

//                           {g.reviewsCount > 0 && (
//                             <>
//                               <svg className={css.commentIcon} aria-hidden="true">
//                                 <use href="/symbol-defs.svg#icon-comment" />
//                               </svg>
//                               <span className={css.reviewsCount}>{g.reviewsCount}</span>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </Link>

//                   <Link href={`/goods/${g.id}`} className={css.detailsBtn}>
//                     Детальніше
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         ) : (
//           <p>Товари не знайдено.</p>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import css from "./GoodsList.module.css";

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
  rating: number; // середнє значення (0..5) з 1 знаком після коми
  sizes: string[];
}

type EnvelopeKeys = "goods" | "items" | "data" | "results" | "docs" | "list";

/* ===== Константи ===== */

const API: string = process.env.NEXT_PUBLIC_API_URL ?? ""; // https://dream-backend-a69s.onrender.com

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

/** Повертає масив товарів із різних можливих обгорток без `any` */
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

/* ===== Рейтинг і кількість з feedbacks (використовуємо Math, без “—”) ===== */

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
  const fixed1: number = Math.round(avg * 10) / 10; // 1 знак після коми

  // завжди повертаємо числа (навіть якщо 0 відгуків → 0.0 і 0)
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

/* ===== Фетч із явним Promise та без any ===== */
/** Повертає нормалізований масив товарів. Якщо жоден маршрут не підійшов — порожній масив. */
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

      const raw: unknown = await res.json(); // ← типізуємо як unknown, далі — type guards
      const list: RawGood[] = pickList(raw);
      if (!list.length) continue;

      return list.map(normalize);
    } catch {
      // пробуємо наступний маршрут
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
  const [visibleCount, setVisibleCount] = useState<number>(4); // desktop дефолт

  // ✅ Єдина зміна: точні брейкпойнти + оновлення на ресайз
  useEffect((): (() => void) | void => {
    if (typeof window === "undefined") return;

    const compute = (): void => {
      const w = window.innerWidth;
      if (w < 768) setVisibleCount(1);         // мобілка
      else if (w < 1440) setVisibleCount(2);   // планшет
      else setVisibleCount(4);                 // десктоп
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
        <li key={i} className={css.card}><div className={css.imgWrap} /></li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <section className={css.section} aria-busy="true">
        <div className="container">
          <div className={css.header}>
            <h2 className={css.title}>Популярні товари</h2>
            <Link href="/goods" className={css.allBtn}>Всі товари</Link>
          </div>
          {renderSkeletons(visibleCount)}
        </div>
      </section>
    );
  }

  const show: Good[] = goods.slice(0, visibleCount);

  return (
    <section className={css.section}>
      <div className="container">
        <div className={css.header}>
          <h2 className={css.title}>Популярні товари</h2>
          <Link href="/goods" className={css.allBtn}>Всі товари</Link>
        </div>

        {error && <p role="alert" style={{ marginBottom: 12 }}>{error}</p>}

        {show.length > 0 ? (
          <ul className={css.list}>
            {show.map((g) => {
              const tight: boolean = g.title.length > 26;

              return (
                <li key={g.id} className={css.card}>
                  <Link href={`/goods/${g.id}`} className={css.link} aria-label={`${g.title} — детальніше`}>
                    <div className={css.imgWrap}>
                      <img
                        src={resolveImage(g.image)}
                        alt={g.title}
                        className={css.img}
                        onError={(e): void => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                    </div>

                    <div className={css.info}>
                      <div className={css.headRow}>
                        <h3 className={`${css.goodTitle} ${tight ? css.goodTitleTight : ""}`} title={g.title}>
                          {g.title}
                        </h3>
                        <span className={css.price}>
                          {g.price.toLocaleString("uk-UA")} {g.currency}
                        </span>
                      </div>

                      <p className={css.brand}>Clothica</p>

                      {/* Завжди показуємо рейтинг і кількість */}
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
                </li>
              );
            })}
          </ul>
        ) : (
          renderSkeletons(visibleCount)
        )}

        {/* Контроли-заглушки — без змін */}
        <div className={css.controls}>
          <div className={css.dots} aria-hidden>
            <span className={`${css.dot} ${css.dotActive}`} />
            <span className={css.dot} />
            <span className={css.dot} />
          </div>
          <div className={css.arrows}>
            <button type="button" className={css.arrowBtn} disabled>
              <svg className={css.icon}><use href="/symbol-defs.svg#icon-arrow_back" /></svg>
            </button>
            <button type="button" className={css.arrowBtn} disabled>
              <svg className={css.icon}><use href="/symbol-defs.svg#icon-arrow_forward" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
