'use client';

import { getCategories } from '@/lib/api/clientApi';
import css from './CategoriesPage.module.css';
import { useEffect, useState } from 'react';
import { Category } from '@/types/category';
import Image from 'next/image';
import Container from '@/components/Container/Container';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(1);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);
  console.log(categories);

  return (
    <Container>
      <h2>Категорії</h2>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {categories.map((category) => (
          <li key={category._id}>
            <Image src={'/images/Hero_Img_mob.png'} alt={category.name} width={416} height={277} />
            <h3>{category.name}</h3>
          </li>
        ))}
      </ul>
    </Container>
  );
}
