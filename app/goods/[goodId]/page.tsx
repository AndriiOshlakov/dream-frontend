/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import ModalReview from '@/components/ModalReview/ModalReview';
import css from './GoodPage.module.css';

interface Good {
  _id: string;
  name: string;
  price: { value: number; currency: string };
  image: string;
  size: string[];
  description: string;
  fullDescription?: string;
  prevDescription?: string;
  characteristics?: string[];
}

interface Feedback {
  _id: string;
  rate: number;
  comment: string;
  productId: string;
}

export default function GoodPage() {
  const { goodId } = useParams() as { goodId: string };

  const [good, setGood] = useState<Good | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRate, setAverageRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  useEffect(() => {
    async function fetchGood() {
      try {
        const res = await fetch(`/api/goods/${goodId}`, { cache: 'no-store' });

        if (!res.ok) throw new Error('Помилка завантаження товару');

        const data = await res.json();
        setGood(data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити товар');
      } finally {
        setLoading(false);
      }
    }

    fetchGood();
  }, [goodId]);


  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch(`/api/feedbacks?productId=${goodId}`);

        if (!res.ok) return;

        const data = await res.json();
        const list: Feedback[] = data.feedbacks || [];

        setFeedbacks(list);

        if (list.length > 0) {
          const avg = list.reduce((s, f) => s + f.rate, 0) / list.length;
          setAverageRate(Math.round(avg * 2) / 2);
        } else {
          setAverageRate(0);
        }
      } catch {
        console.warn('Не вдалося отримати відгуки');
      }
    }

    fetchFeedbacks();
  }, [goodId]);

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

      {/* продукт  */}
      <section className={css.good}>
        <div className={css.imageWrapper}>
          <img src={good.image} alt={good.name} className={css.image} loading="lazy" />
        </div>

        <div className={css.info}>
          <h1 className={css.title}>{good.name}</h1>

          {/* ціна рейтинг  */}
          <div className={css.priceBlock}>
            <span className={css.price}>
              {good.price.value} {good.price.currency}
            </span>

            <span className={css.divider}>|</span>

            <div className={css.ratingInline}>
              {Array.from({ length: 5 }).map((_, i) => {
                const diff = averageRate - i;

                return (
                  <span key={i} className={css.star}>
                    {diff >= 1 ? '★' : diff === 0.5 ? '⯪' : '☆'}
                  </span>
                );
              })}

              <span className={css.ratingValue}>({averageRate.toFixed(1)})</span>
              <span className={css.reviewsCount}>• {feedbacks.length} відгуків</span>
            </div>
          </div>


          <section className={css.descriptionSection}>
            {good.prevDescription && <p className={css.prevDescription}>{good.prevDescription}</p>}
          </section>

          {/* розмір */}
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
          {/* додати до карти */}
          <div className={css.cartRow}>
            <button className={css.buyButton}>Додати в кошик</button>
            <input type="number" min="1" defaultValue="1" className={css.quantityInput} />
          </div>

          <button className={css.buyNowButton}>Купити зараз</button>
          <p className={css.deliveryText}>Безкоштовна доставка для замовлень від 1000 грн</p>

          {error && <p className={css.error}>{error}</p>}
      {/* повний опис */}
      <section className={css.longDescriptionSection}>
        <h3 className={css.charTitleDes}>Опис</h3>
        {good.description && <p className={css.description}>{good.description}</p>}

        {good.characteristics && good.characteristics.length > 0 && (
          <div className={css.characteristics}>
            <h3 className={css.charTitle}>Основні характеристики</h3>
            <ul className={css.charList}>
              {good.characteristics.map((item, idx) => (
                <li key={idx} className={css.charItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
        </div>
      </section>



      {/* відгуки */}
      <section className={css.reviews}>
        <div className={css.reviewsHeader}>
          <h2>Відгуки клієнтів</h2>
        </div>
        <button className={css.reviewBtn} onClick={openModal}>
          Залишити відгук
        </button>


        {feedbacks.length > 0 ? (
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
