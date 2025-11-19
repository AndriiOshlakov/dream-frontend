'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './CategoriesList.module.css';
import { getCategories } from '@/lib/api/clientApi';
import { Category } from '@/types/category';
import { localCategories } from '@/constants/localCategories';
import Loader from '../Loader/Loader';

const INITIAL_PER_PAGE_DESKTOP = 6;
const INITIAL_PER_PAGE_TABLET = 4;
const INITIAL_PER_PAGE_MOBILE = 4;
const LOAD_MORE_COUNT = 3;
const LOAD_MORE_COUNT_TABLET = 2;
const LOAD_MORE_COUNT_MOBILE = 4;
const TOTAL_CATEGORIES_TABLET = 8;
const TOTAL_CATEGORIES_MOBILE = 8;

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allLoadedCategories, setAllLoadedCategories] = useState<Category[]>([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1440);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const loadInitialCategories = async () => {
      try {
        setLoading(true);
        let initialPerPage;
        if (isMobile) {
          initialPerPage = INITIAL_PER_PAGE_MOBILE;
        } else if (isTablet) {
          initialPerPage = INITIAL_PER_PAGE_TABLET;
        } else {
          initialPerPage = INITIAL_PER_PAGE_DESKTOP;
        }
        
        let response = await getCategories(1);
        
        if (response.length < initialPerPage) {
          const secondPage = await getCategories(2);
          const existingIds = new Set(response.map((cat) => cat._id));
          const uniqueFromSecondPage = secondPage.filter((cat) => !existingIds.has(cat._id));
          response = [...response, ...uniqueFromSecondPage];
        }

        const categoriesWithImages = response.map((category) => {
          const finalImageUrl = category.img && (category.img.startsWith('http://') || category.img.startsWith('https://'))
            ? category.img
            : localCategories[category._id] || '/img/categories/others.jpg';
          
          return {
            ...category,
            img: finalImageUrl,
          };
        });

        setAllLoadedCategories(categoriesWithImages);
        const limited = categoriesWithImages.slice(0, initialPerPage);
        setCategories(limited);
        setCurrentPage(1);
        setHasMore(response.length > initialPerPage || limited.length === initialPerPage);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setCategories([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCategories();
  }, [isMobile, isTablet]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      let loadMoreCount;
      if (isMobile) {
        loadMoreCount = LOAD_MORE_COUNT_MOBILE;
      } else if (isTablet) {
        loadMoreCount = LOAD_MORE_COUNT_TABLET;
      } else {
        loadMoreCount = LOAD_MORE_COUNT;
      }
      
      const existingIds = new Set(categories.map((cat) => cat._id));
      const remainingFromLoaded = allLoadedCategories.filter((cat) => !existingIds.has(cat._id));
      
      if (remainingFromLoaded.length > 0) {
        const limitedNew = remainingFromLoaded.slice(0, loadMoreCount);
        
        setCategories((prev) => {
          const updatedCategories = [...prev, ...limitedNew];
          
          if (isMobile) {
            const totalLoaded = updatedCategories.length;
            if (totalLoaded >= TOTAL_CATEGORIES_MOBILE) {
              setHasMore(false);
            } else {
              const hasMoreInLoaded = remainingFromLoaded.length > limitedNew.length;
              setHasMore(hasMoreInLoaded || totalLoaded < TOTAL_CATEGORIES_MOBILE);
            }
          } else if (isTablet) {
            const totalLoaded = updatedCategories.length;
            if (totalLoaded >= TOTAL_CATEGORIES_TABLET) {
              setHasMore(false);
            } else {
              const hasMoreInLoaded = remainingFromLoaded.length > limitedNew.length;
              setHasMore(hasMoreInLoaded || totalLoaded < TOTAL_CATEGORIES_TABLET);
            }
          } else {
            setHasMore(remainingFromLoaded.length > limitedNew.length);
          }
          
          return updatedCategories;
        });
        
        setIsLoadingMore(false);
        return;
      }
      
      const nextPage = currentPage + 1;
      const response = await getCategories(nextPage);

      if (response.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      const newCategories = response.map((category) => {
        const finalImageUrl = category.img && (category.img.startsWith('http://') || category.img.startsWith('https://'))
          ? category.img
          : localCategories[category._id] || '/img/categories/others.jpg';
        
        return {
          ...category,
          img: finalImageUrl,
        };
      });

      const updatedAllLoaded = [...allLoadedCategories, ...newCategories];
      setAllLoadedCategories(updatedAllLoaded);
      
      // Унікальні категорії
      const uniqueNewCategories = newCategories.filter((cat) => !existingIds.has(cat._id));

      if (uniqueNewCategories.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      const limitedNew = uniqueNewCategories.slice(0, loadMoreCount);
      
      setCategories((prev) => {
        const updatedCategories = [...prev, ...limitedNew];
        
        if (isMobile) {
          const totalLoaded = updatedCategories.length;
          if (totalLoaded >= TOTAL_CATEGORIES_MOBILE) {
            setHasMore(false);
          } else {
            setHasMore(response.length >= loadMoreCount || uniqueNewCategories.length > limitedNew.length);
          }
        } else if (isTablet) {
          const totalLoaded = updatedCategories.length;
          if (totalLoaded >= TOTAL_CATEGORIES_TABLET) {
            setHasMore(false);
          } else {
            setHasMore(response.length >= loadMoreCount || uniqueNewCategories.length > limitedNew.length);
          }
        } else {
          setHasMore(response.length >= LOAD_MORE_COUNT && uniqueNewCategories.length >= loadMoreCount);
        }
        
        return updatedCategories;
      });
      
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('❌ Error loading more categories:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <section className={css.categoriesSection}>
        <div className="container">
          <Loader />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className={css.categoriesSection}>
        <div className="container">
          <p>Категорій не знайдено.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.categoriesSection}>
      <div className="container">
        <ul className={css.list}>
          {categories.map((cat) => (
            <li key={cat._id} className={css.item}>
              <Link href={`/goods?category=${cat._id}`} className={css.card}>
                <div className={css.imageWrapper}>
                  <Image
                    src={cat.img ?? '/img/categories/others.jpg'}
                    alt={cat.name}
                    width={416}
                    height={277}
                    className={css.image}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/img/categories/others.jpg';
                    }}
                  />
                </div>
                <p className={css.name}>{cat.name}</p>
              </Link>
            </li>
          ))}
        </ul>
        {hasMore && (
          <div className={css.buttonWrapper}>
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={css.loadMoreButton}
            >
              {isLoadingMore ? 'Завантаження...' : 'Показати більше'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
