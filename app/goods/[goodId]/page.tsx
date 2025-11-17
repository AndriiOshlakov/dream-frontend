'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GoodForPurchase from '@/components/GoodForPurchase/GoodForPurchase';
import { Good } from '@/types/goods';
import { fetchGoodById } from '@/lib/api/clientApi';

interface GoodPageParams {
  goodId: string;
}

const GoodPage: React.FC = () => {
  const params = useParams();
  const { goodId } = params as unknown as GoodPageParams;

  const [good, setGood] = useState<Good | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!goodId) return;

    fetchGoodById(goodId)
      .then((res) => {
        if (res.success) setGood(res.good);
      })
      .finally(() => setLoading(false));
  }, [goodId]);

  if (loading) return <p>Завантаження...</p>;
  if (!good) return <p>Товар не знайдено</p>;

  return (
    <div>
      <GoodForPurchase good={good} categoriesPath={['Всі товари', 'Категорія', good.title]} />
    </div>
  );
};

export default GoodPage;
