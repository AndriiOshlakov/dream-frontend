'use client';
import Filters from '@/components/Filters/Filters';
import { getCategories, getGoods } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { useEffect, useState } from 'react';
import css from './GoodsPage.module.css';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '@/components/Loader/Loader';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';

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
    minVal: 100,
    maxVal: 1000,
    gender: '',
    sizes: [] as string[],
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
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

  const { data, isPending } = useQuery({
    queryKey: ['goods', selectedCategoryId, filters, currentPage],
    queryFn: () =>
      getGoods({
        // categoryId: selectedCategoryId,
        priceMin: filters.minVal,
        priceMax: filters.maxVal,
        page: currentPage,
      }),
  });
  const handleFiltersChange = (updatedFilters: typeof filters) => {
    setFilters(updatedFilters);
  };
  const handleCategorySelect = (name: string) => {
    setSelectedCategoryName(name);
    const category = categories.find((c) => c.name === name);
    setSelectedCategoryId(category?._id);
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
    setCurrentPage(1);
  };
  const clearAllFilters = () => {
    setFilters({
      minVal: 100,
      maxVal: 1000,
      gender: '',
      sizes: [],
    });
    setCurrentPage(1);
  };
  const showedItems =
    data !== undefined ? Math.min(currentPage * data.perPage, data.totalItems) : 0;

  return (
    <div className={css.pageContainer}>
      <h2 className={css.pageTitle}>{selectedCategoryName}</h2>
      <div className={css.goodsBox}>
        <Filters
          onChange={handleFiltersChange}
          categories={categories}
          onCategorySelect={handleCategorySelect}
          onClearOne={clearOneFilter}
          onClearAll={clearAllFilters}
          filters={filters}
          totalItems={data?.totalItems as number}
          showedItems={Math.ceil(showedItems)}
        />
        {isPending && <Loader />}
        {!data && !isPending && (
          <MessageNoInfo
            text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
            buttonText="Скинути фільтри"
            onClick={clearAllFilters}
          />
        )}
        {data && (
          <div>
            <ul className={css.goodsList}>
              {data?.goods.map((good) => (
                <li key={good._id}>
                  <Image
                    className={css.goodImg}
                    alt={good.name}
                    width={304}
                    height={375}
                    src={good.image}
                  />
                  <div className={css.goodPriceBox}>
                    <div>
                      <p>{good.name} Clothica</p>

                      <div className={css.goodRate}>
                        <div>
                          <svg width={16} height={16}>
                            <use href="/symbol-defs.svg#icon-star-filled"></use>
                          </svg>
                          <p>{good.feedbacks.length}</p>
                        </div>
                        <div>
                          <svg width={16} height={16}>
                            <use href="/symbol-defs.svg#icon-comment"></use>
                          </svg>
                          <p>{good.feedbacks.length}</p>
                        </div>
                      </div>
                    </div>
                    <p className={css.goodPrice}>
                      {good.price.value}
                      {good.price.currency}
                    </p>
                  </div>

                  <button>
                    <Link href={`../goods/${good._id}`}>Детальніше</Link>
                  </button>
                </li>
              ))}
            </ul>
            {showedItems < data.totalItems && (
              <button className={css.showMoreBtn} onClick={() => setCurrentPage(currentPage + 1)}>
                Показати більше
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
