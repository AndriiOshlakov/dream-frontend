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

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BasketPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const isModal = params.get('modal') === '1';

    // Якщо НЕ модалка → редіректимо на order
    if (!isModal) {
      router.replace('/order');
    }
  }, [params, router]);

  return null;
}
