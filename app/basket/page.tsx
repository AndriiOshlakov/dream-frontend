'use client';

import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import { useRouter } from 'next/navigation';
import { useShopStore } from '@/lib/store/cartStore';
import css from './basket.module.css';
import Container from '@/components/Container/Container';

export default function BasketPage() {
  const router = useRouter();
  const { cartItems } = useShopStore();

  return (
    <Container>
      <div className={css.basketPageContainer}>
        <h2 className={css.basketPageTitle}>Кошик</h2>

        <GoodsOrderList />

        {cartItems.length > 0 && (
          <div className={css.basketPageBtnWrapper}>
            <button className={css.basketPageShoppingBtn} onClick={() => router.push('/goods')}>
              Продовжити покупку
            </button>
            <button className={css.basketPageOrderBtn} onClick={() => router.push('/order')}>
              Оформити замовлення
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}
