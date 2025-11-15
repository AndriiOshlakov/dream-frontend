'use client';

import Link from 'next/link';
import Image from 'next/image';
import css from './CategoriesList.module.css';
import { useCategories } from '@/hooks/useCategories';

export default function CategoriesList() {
  const { categories, loading } = useCategories();

  if (loading) {
    return <p>Завантаження категорій...</p>;
  }

  if (categories.length === 0) {
    return <p>Категорій не знайдено.</p>;
  }

  return (
    <section className={css.categoriesSection}>
      <div className="container">
        <h2 className={css.title}>Категорії</h2>
        <ul className={css.list}>
          {categories.map((cat) => (
            <li key={cat._id} className={css.item}>
              <Link href={`/categories/${cat._id}`} className={css.card}>
                <Image
                  src={cat.img ?? '/img/categories/default.png'}
                  alt={cat.name}
                  width={336}
                  height={223}
                  className={css.image}
                />
                <p className={css.name}>{cat.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
