'use client';

import Container from '@/components/Container/Container';
import CategoriesList from '@/components/CategoriesList/CategoriesList';
import css from './CategoriesPage.module.css';

export default function CategoriesPage() {
  return (
    <div className={css.section}>
    <Container>
      <h1 className={css.title}>Категорії</h1>
      <CategoriesList />
    </Container>
    </div>
  );
}
