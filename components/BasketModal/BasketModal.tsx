'use client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import MessageNoInfo from '../MessageNoInfo/MessageNoInfo';
import { useShopStore } from '@/lib/store/cartStore';
import css from './BasketModal.module.css';
import Container from '../Container/Container';

export default function BasketModal() {
  const router = useRouter();
  const { cartItems } = useShopStore();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleGoToGoods = () => {
    handleClose();
    setTimeout(() => {
      router.push('/goods');
    }, 200);
  };

  const handleGoToOrder = () => {
    handleClose();
    setTimeout(() => {
      router.push('/order');
    }, 200);
  };

  return (
    <Container>
      <div className={css.basketModalBackdrop} onClick={handleBackdropClick}>
        <div className={css.basketModal}>
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
    </Container>
  );
}
