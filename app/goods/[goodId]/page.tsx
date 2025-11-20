'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ModalReview from '@/components/ModalReview/ModalReview';
import css from './GoodPage.module.css';
import { useShopStore } from '@/lib/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import { toast } from 'react-toastify';

interface Good {
  _id: string;
  name: string;
  price: { value: number; currency: string };
  image: string;
  size: string[];
  description: string;
  prevDescription?: string;
  fullDescription?: string;
  characteristics?: string[];
  category?: {
    _id: string;
    name: string;
  };
}

interface Feedback {
  _id: string;
  rate: number;
  description: string;
  productId: string;
  author?: string;
}

export default function GoodPage() {
  const { goodId } = useParams() as { goodId: string };

  const [good, setGood] = useState<Good | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRate, setAverageRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useShopStore();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 1500);
  };
  const router = useRouter();
  const nextSlide = () => {
    if (feedbacks.length <= getVisibleCount()) return;
    setCurrentSlide((prev) => Math.min(prev + 1, feedbacks.length - getVisibleCount()));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 1;

    if (window.innerWidth >= 1440) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const getVisibleFeedbacks = () => {
    return feedbacks.slice(currentSlide, currentSlide + getVisibleCount());
  };

  const canGoNext = feedbacks.length > 0 && currentSlide < feedbacks.length - getVisibleCount();
  const canGoPrev = feedbacks.length > 0 && currentSlide > 0;

  useEffect(() => {
    async function fetchGood() {
      try {
        const res = await fetch(`/api/goods/${goodId}`, { cache: 'no-store' });

        if (!res.ok) throw new Error('Помилка завантаження товару');

        const data = await res.json();
        setGood(data);

        if (data && data.size && data.size.length > 0) {
          setSelectedSize(data.size[0]);
        }
      } catch {
        console.log('Не вдалося завантажити товар');
      } finally {
        setLoading(false);
      }
    }

    fetchGood();
  }, [goodId]);

  // ⬅️ NEW HANDLER: Add item to cart ⬅️
  const handleAddToCart = () => {
    if (!good || !selectedSize || quantity < 1) {
      alert('Будь ласка, оберіть розмір та вкажіть дійсну кількість.');
      return;
    }

    const itemToAdd = {
      id: good._id,
      name: good.name,
      price: good.price.value,
      quantity: quantity,
      image: good.image,
      rating: averageRate,
      reviewsCount: feedbacks.length,
      size: selectedSize, // ⬅️ Pass the selected size
    };

    addToCart(itemToAdd);
    toast(`"${good.name}" (${selectedSize}, x${quantity}) додано до кошика!`);
  };

  const handleBuyNow = () => {
    if (!good || !selectedSize || quantity < 1) {
      alert('Будь ласка, оберіть розмір та вкажіть дійсну кількість.');
      return;
    }

    const itemToAdd = {
      id: good._id,
      name: good.name,
      price: good.price.value,
      quantity: quantity,
      image: good.image,
      rating: averageRate,
      reviewsCount: feedbacks.length,
      size: selectedSize,
    };

    addToCart(itemToAdd);
    router.push('/order');
  };

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedbacks?productId=${goodId}`);

        if (res.ok) {
          const data = await res.json();
          const allFeedbacks: Feedback[] = data.feedbacks || data || [];

          const filteredFeedbacks = allFeedbacks.filter(
            (feedback) => feedback.productId === goodId
          );

          setFeedbacks(filteredFeedbacks);

          if (filteredFeedbacks.length > 0) {
            const avg =
              filteredFeedbacks.reduce((sum, f) => sum + f.rate, 0) / filteredFeedbacks.length;
            setAverageRate(Math.round(avg * 2) / 2);
          } else {
            setAverageRate(0);
          }
        } else {
          setFeedbacks([]);
          setAverageRate(0);
        }
      } catch (error) {
        console.error('💥 Помилка завантаження відгуків:', error);
        setFeedbacks([]);
        setAverageRate(0);
      }
    };

    loadFeedbacks();
  }, [goodId, refreshTrigger]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [feedbacks.length]);

  if (loading) return <Loader />;
  if (!good) return <p className={css.error}>Товар не знайдено</p>;

  const visibleFeedbacks = getVisibleFeedbacks();
  const authorNames = [
    'Олена Коваль',
    'Ігор Петров',
    'Ігор Шевченко',
    'Марія Іваненко',
    'Андрій Сидоренко',
  ];

  return (
    <main className={css.container}>
      <nav className={css.breadcrumbs}>
        <Link href="/goods" className={css.breadcrumbLink}>
          Товари
        </Link>
        <span className={css.breadcrumbSeparator}>›</span>
        <span className={css.breadcrumbCurrent}>{good.name}</span>
      </nav>

      {/* продукт  */}
      <section className={css.good}>
        <div className={css.imageWrapper}>
          <Image src={good.image} alt={good.name} width={640} height={683} className={css.image} />
        </div>

        <div className={css.info}>
          <h1 className={css.title}>{good.name}</h1>

          {/* ціна + рейтинг */}
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

          {/* короткий опис */}
          <section className={css.descriptionSection}>
            {good.prevDescription && <p className={css.prevDescription}>{good.prevDescription}</p>}
          </section>

          {/* Розмір */}
          <div className={css.sizeBlock}>
            <p>Розмір:</p>
            <select
              className={css.sizeSelect}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)} // ⬅️ Update selectedSize
            >
              {good.size.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* кошик */}
          <div className={css.cartRow}>
            <button
              className={css.buyButton}
              onClick={handleAddToCart} // ⬅️ Call the handler
            >
              Додати в кошик
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))} // ⬅️ Update quantity
              className={css.quantityInput}
            />
          </div>

          <button className={css.buyNowButton} onClick={handleBuyNow}>
            Купити зараз
          </button>
          <p className={css.deliveryText}>Безкоштовна доставка від 1000 грн</p>

          {/* ПОВНИЙ ОПИС */}
          <section className={css.longDescriptionSection}>
            <h3 className={css.charTitleDes}>Опис</h3>

            {good.description && <p className={css.description}>{good.description}</p>}

            {good.characteristics?.length ? (
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
            ) : null}
          </section>
        </div>
      </section>

      {/* відгуки */}
      <section className={css.reviews}>
        <div className={css.reviewsTop}>
          <h2>Відгуки клієнтів</h2>

          <button className={css.reviewBtn} onClick={openModal}>
            Залишити відгук
          </button>
        </div>

        {feedbacks.length > 0 ? (
          <div className={css.reviewsList}>
            {visibleFeedbacks.map((feedback) => (
              <div key={feedback._id} className={css.reviewItem}>
                <div className={css.rating}>
                  {'★'.repeat(feedback.rate)}
                  {'☆'.repeat(5 - feedback.rate)}
                </div>
                <div style={{ height: '200px' }}>
                  <p className={css.reviewText}>{feedback.description}</p>
                </div>

                <div className={css.reviewAuthor}>
                  <strong>
                    {feedback.author || authorNames[Math.floor(Math.random() * authorNames.length)]}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={css.noReviews}>
            <p>У цього товару ще немає відгуків</p>
            <button className={css.leaveReviewBtn} onClick={openModal}>
              Залишити відгук
            </button>
          </div>
        )}

        <div className={css.arrows}>
          <button
            className={`${css.arrowBtn} ${!canGoPrev ? css.arrowBtnDisabled : ''}`}
            onClick={prevSlide}
            disabled={!canGoPrev}
          >
            <svg width="24" height="24">
              <use href="/symbol-defs.svg#icon-arrow_back" />
            </svg>
          </button>

          <button
            className={`${css.arrowBtn} ${!canGoNext ? css.arrowBtnDisabled : ''}`}
            onClick={nextSlide}
            disabled={!canGoNext}
          >
            <svg width="24" height="24">
              <use href="/symbol-defs.svg#icon-arrow_forward" />
            </svg>
          </button>
        </div>

        {isModalOpen && (
          <ModalReview
            key={Date.now()}
            onClose={closeModal}
            productId={goodId}
            category={good.name || 'general'}
          />
        )}
      </section>
    </main>
  );
}
