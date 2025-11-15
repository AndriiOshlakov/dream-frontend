'use client';

import { useShopStore, CartItem } from '@/lib/store/cartStore';
import BasketModal from '@/components/BasketModal/BasketModal';

export default function TestPage() {
  const { addToCart } = useShopStore();

  const sampleItem: CartItem = {
    id: '1',
    name: 'Тестовий товар',
    image: '/sample-product.jpg', 
    price: 100,
    quantity: 1,
    rating: 4.5,
    reviewsCount: 10,
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => addToCart(sampleItem)}>Додати товар у кошик</button>
      <BasketModal />
    </div>
  );
}
