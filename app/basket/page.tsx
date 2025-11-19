// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function BasketPage() {
//   const router = useRouter();

//   useEffect(() => {
//     router.replace('/order');
//   }, [router]);

//   return null;
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShopStore } from '@/lib/store/cartStore';
import BasketModal from '@/components/BasketModal/BasketModal';

export default function BasketPage() {
  const router = useRouter();
  const { cartItems } = useShopStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // чекати, поки Zustand завантажить стан
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && cartItems.length === 0) {
      router.replace('/order');
    }
  }, [isHydrated, cartItems, router]);

  if (!isHydrated) return null; // не рендерити нічого поки стан не завантажено

  return <BasketModal />;
}
