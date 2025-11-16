'use client';
import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import MessageNoInfo from '../MessageNoInfo/MessageNoInfo';
import { useShopStore } from '@/lib/store/cartStore';
import css from './BasketModal.module.css';

export default function BasketModal() {
  const router = useRouter();
  const { cartItems } = useShopStore();
  const [closing, setClosing] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (!closing) return;

    if (nextRoute) {
      router.push(nextRoute);
    }
  }, [closing, nextRoute, router]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  useEffect(() => {
    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleGoToGoods = () => {
    setNextRoute('/goods');
    setClosing(true);
  };

  const handleGoToOrder = () => {
    setClosing(true);
    setNextRoute('/order');
  };

  return (
    <div
      className={`${css.basketModalBackdrop} ${closing ? css.fadeOut : css.fadeIn}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${css.basketModal} ${closing ? css.slideOut : css.slideIn}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={css.basketModalCloseBtnContainer}>
          <button className={css.basketModalCloseButton} onClick={handleClose}>
            <svg className={css.mbasketMenuCloseBtnIcon} width="24" height="24">
              <use href="/symbol-defs.svg#icon-close" />
            </svg>
          </button>
        </div>

        <h2 className={css.basketModalTitle}>Ваш кошик</h2>

        {cartItems.length > 0 ? (
          <>
            <GoodsOrderList />
            <div className={css.basketModalActions}>
              <button className={css.basketModalSecondaryButton} onClick={handleGoToGoods}>
                Продовжити покупки
              </button>
              <button className={css.basketModalPrimaryButton} onClick={handleGoToOrder}>
                Оформити замовлення
              </button>
            </div>
          </>
        ) : (
          <MessageNoInfo
            text="Ваш кошик порожній, мерщій до покупок!"
            buttonText="До покупок"
            onClick={handleGoToGoods}
          />
        )}
      </div>
    </div>
  );
}
