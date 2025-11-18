'use client';

import CategoriesList from '@/components/CategoriesList/CategoriesList';
import css from './CategoriesPage.module.css';

export default function CategoriesPage() {
  return (
    <div className={css.section}>
      <div className={css.containerWrapper}>
        <h1 className={css.title}>Категорії</h1>
        <CategoriesList />
      </div>
    </div>
  );
}
