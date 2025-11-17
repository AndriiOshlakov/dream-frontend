'use client';

import React, { useState } from 'react';
import { Good } from '@/types/goods';
import Image from 'next/image';

interface GoodForPurchaseProps {
  good: Good;
  categoriesPath?: string[];
  colors?: string[];
}

export default function GoodForPurchase({
  good,
  categoriesPath = [],
  colors = ['Чорний', 'Білий', 'Синій'],
}: GoodForPurchaseProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(good.sizes[0] || null);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  return (
    <div>
      {/* Фото товару */}
      <div>
        <Image src={good.image} alt={good.title} width={400} height={500} />
      </div>

      {/* Інформація про товар */}
      <div>
        {categoriesPath.length > 0 && <p>{categoriesPath.join(' - ')}</p>}
        <h1>{good.title}</h1>

        <div>
          <span>
            {good.price} {good.currency}
          </span>
          <span>
            ⭐ {good.rating ? good.rating.toFixed(1) : '–'} ({good.reviewsCount})
          </span>
        </div>

        {good.prevDescription && <p>{good.prevDescription}</p>}

        {/* Вибір розміру */}
        <div>
          <h3>Розмір:</h3>
          {good.sizes.map((size) => (
            <button key={size} onClick={() => setSelectedSize(size)}>
              {size}
            </button>
          ))}
        </div>

        {/* Вибір кольору */}
        <div>
          <h3>Колір:</h3>
          {colors.map((color) => (
            <button key={color} onClick={() => setSelectedColor(color)}>
              {color}
            </button>
          ))}
        </div>

        {/* Деталі товару */}
        <div>
          <h3>Деталі товару</h3>
          <ul>
            {good.characteristics?.map((char: string, idx: number) => (
              <li key={idx}>{char}</li>
            ))}
          </ul>
          <p>
            <strong>Доставка:</strong> 1–3 робочі дні
          </p>
          <p>
            <strong>Повернення:</strong> Протягом 14 днів
          </p>
        </div>
      </div>
    </div>
  );
}
