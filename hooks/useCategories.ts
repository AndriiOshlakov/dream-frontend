'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { localCategories } from '@/constants/localCategories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getCategories(1);
        const array = response || [];

        const categoriesWithImages = array.map((category) => ({
          ...category,
          img: localCategories[category._id] || '/img/categories/others.jpg',
        }));

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { categories, loading };
}
