'use client';
import Filters from '@/components/Filters/Filters';
import { getCategories } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { useEffect, useState } from 'react';
import css from './GoodsPage.module.css';

export type FiltersType = {
  minVal: number;
  maxVal: number;
  gender: string;
  sizes: string[];
};

export default function GoodsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Усі товари');
  const [filters, setFilters] = useState({
    minVal: 0,
    maxVal: 1000,
    gender: '',
    sizes: [] as string[],
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);
  const handleFiltersChange = (updatedFilters: typeof filters) => {
    setFilters(updatedFilters);
  };
  const handleCategorySelect = (name: string) => {
    setSelectedCategoryName(name);
  };
  const clearOneFilter = (filterName: keyof typeof filters) => {
    const defaultValues: FiltersType = {
      minVal: 0,
      maxVal: 1000,
      gender: '',
      sizes: [],
    };

    setFilters((prev) => ({
      ...prev,
      [filterName]: defaultValues[filterName],
    }));
  };
  const clearAllFilters = () => {
    setFilters({
      minVal: 0,
      maxVal: 1000,
      gender: '',
      sizes: [],
    });
  };

  return (
    <div className={css.pageContainer}>
      <h2 className={css.pageTitle}>{selectedCategoryName}</h2>
      <div>
        <Filters
          onChange={handleFiltersChange}
          categories={categories}
          onCategorySelect={handleCategorySelect}
          onClearOne={clearOneFilter}
          onClearAll={clearAllFilters}
          filters={filters}
        />
      </div>
    </div>
  );
}
