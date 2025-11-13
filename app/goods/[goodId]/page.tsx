/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import css from './GoodPage.module.css';

import ModalReview from '@/components/ModalReview/ModalReview';

interface Good {
  _id: string;
  name: string;
  price: { value: number; currency: string };
  category: { name: string };
  image: string;
  size: string[];
  characteristics?: string[];
  description: string;
  feedbacks?: string[];
}

interface Feedback {
  _id: string;
  rate: number;
  comment: string;
  productId: { $oid: string };
}

export default function GoodPage() {
  const params = useParams();
  const goodId = params.goodId as string;

  const [good, setGood] = useState<Good | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRate, setAverageRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsClient] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    async function fetchGood() {
      try {
        const res = await fetch('https://dream-backend-a69s.onrender.com/api/goods', {
          headers: { Accept: 'application/json' },
        });

        const data = await res.json();
        const found = data.goods?.find((item: Good) => item._id === goodId);

        if (found) setGood(found);
        else throw new Error('Товар не знайдено');
      } catch {
        console.warn('⚠️ Сервер недоступний — використано мокові дані.');

        const mock: Good = {
          _id: '6877b9f116ae59c7b60d0107',
          name: "Світшот 'Minimal Black'",
          price: { value: 1299, currency: 'грн' },
          category: { name: 'Худі та кофти' },
          image: 'https://ftp.goit.study/img/goods/6877b9f116ae59c7b60d0107.webp',
          size: ['XS', 'S', 'M', 'L', 'XL'],
          description:
            'Світшот Minimal Black — втілення стриманості та універсальності. Його дизайн побудований на простоті: глибокий чорний колір, акуратний круглий виріз і прямий крій.',
          // feedbacks: ['1', '2', '3', '4', '5'],
          characteristics: [
            'Матеріал: 80% бавовна, 20% поліестер',
            'Крій: прямий',
            'Горловина: круглий виріз',
            'Сезон: Осінь/Зима/Весна',
          ],
        };
        setGood(mock);
        setError('⚠️ Сервер недоступний, показано тестові дані.');
      } finally {
        setLoading(false);
      }
    }

    fetchGood();
  }, [goodId]);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!good) return;

      try {
        const res = await fetch('https://dream-backend-a69s.onrender.com/api/feedbacks');
        const data = await res.json();

        const related = data.feedbacks?.filter((f: Feedback) => f.productId?.$oid === good._id);

        setFeedbacks(related || []);

        if (related?.length) {
          const avg =
            related.reduce((sum: number, f: Feedback) => sum + f.rate, 0) / related.length;
          setAverageRate(Math.round(avg * 2) / 2);
        } else {
          setAverageRate(0);
        }
      } catch {
        console.warn('⚠️ Не вдалося отримати відгуки.');
      }
    }

    fetchFeedbacks();
  }, [good]);

  function handleAddToCart() {
    if (good) alert(`✅ ${good.name} додано в кошик!`);
  }

  if (loading) return <p className={css.loading}>Завантаження...</p>;
  if (!good) return <p className={css.error}>Товар не знайдено</p>;

  return (
    <main className={css.container}>
      <nav className={css.breadcrumbs}>
        <a href="/goods" className={css.breadcrumbLink}>
          Товари
        </a>
        <span className={css.breadcrumbSeparator}>›</span>
        <span className={css.breadcrumbCurrent}>{good.name}</span>
      </nav>

      <section className={css.good}>
        <div className={css.imageWrapper}>
          <img src={good.image} alt={good.name} className={css.image} loading="lazy" />
        </div>

        <div className={css.info}>
          <h1 className={css.title}>{good.name}</h1>

          <div className={css.priceBlock}>
            <span className={css.price}>
              {good.price.value} {good.price.currency}
            </span>
            <span className={css.divider}>|</span>
            <div className={css.ratingInline}>
              {Array.from({ length: 5 }).map((_, i) => {
                const diff = averageRate - i;
                let star = '☆';
                if (diff >= 1) star = '★';
                else if (diff === 0.5) star = '⯪';
                return (
                  <span key={i} className={css.star}>
                    {star}
                  </span>
                );
              })}
              <span className={css.ratingValue}>({averageRate.toFixed(1)})</span>
              <span className={css.reviewsCount}>• {feedbacks.length} відгуків</span>
            </div>
          </div>

          <p className={css.description}>{good.description}</p>

          <div className={css.sizeBlock}>
            <p>Розмір:</p>
            <select className={css.sizeSelect}>
              {good.size.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={css.cartRow}>
            <button className={css.buyButton} onClick={handleAddToCart}>
              Додати в кошик
            </button>
            <input type="number" min="1" defaultValue="1" className={css.quantityInput} />
          </div>

          <button className={css.buyNowButton}>Купити зараз</button>
          <p className={css.deliveryText}>Безкоштовна доставка для замовлень від 1000 грн</p>

          {error && <p className={css.error}>{error}</p>}
        </div>
      </section>
      {/* <div className={css.descriptionBlock}>
  <h3 className={css.descriptionTitle}>Опис</h3>
  <p className={css.descriptionText}>{good.description}</p>
  <ul className={css.characteristicsList}>
    {good.characteristics?.map((char, i) => (
      <li key={i}>{char}</li>
    ))}
  </ul>
</div> */}

      <section className={css.reviews}>
        <div className={css.reviewsHeader}>
          <h2>Відгуки клієнтів</h2>
        </div>
        <button className={css.reviewBtn} onClick={openModal}>
          Залишити відгук
        </button>
        {good.feedbacks && good.feedbacks.length > 0 ? (
          <ReviewsList />
        ) : (
          <div className={css.noReviews}>
            <p>У цього товару ще немає відгуків</p>
            <button className={css.leaveReviewBtn} onClick={openModal}>
              Залишити відгук
            </button>
          </div>
        )}
        {isModalOpen && <ModalReview key={goodId} onClose={closeModal} goodId={goodId} />}
      </section>
    </main>
  );
}
