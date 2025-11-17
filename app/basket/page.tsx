'use client';

import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import { useRouter } from 'next/navigation';
import { useShopStore } from '@/lib/store/cartStore';
import css from './basket.module.css';

export default function BasketPage() {
  const router = useRouter();
  const { cartItems } = useShopStore();

  return (
    <div className={css.basketContainer}>
      <h2 className={css.basketTitle}>Кошик</h2>

      <GoodsOrderList />

      {cartItems.length > 0 && (
        <button className={css.basketOrderBtn} onClick={() => router.push('/order')}>
          Оформити замовлення
        </button>
      )}
    </div>
  );
}
