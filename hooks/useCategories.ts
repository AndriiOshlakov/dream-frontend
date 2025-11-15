'use client';

import { useEffect, useState } from 'react';
import { fetchCategoriesClient } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { localCategories } from '@/constants/localCategories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchCategoriesClient(1, 7);
        const array = response.categories || [];

        const categoriesWithImages = array.map((category) => ({
          ...category,
          img: localCategories[category._id] || '/img/categories/others.jpg',
        }));

        console.log('categoriesWithImages', categoriesWithImages);
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
