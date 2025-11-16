'use client';

import css from './Filters.module.css';
import { useEffect, useState } from 'react';
import { Category } from '@/types/category';
import { useDebouncedCallback } from 'use-debounce';
import { FiltersType } from '@/app/goods/page';

type FiltersProps = {
  categories: Category[];
  onChange: (updatedFilters: {
    minVal: number;
    maxVal: number;
    gender: 'man' | 'women' | 'unisex' | undefined;
    size: string | undefined;
  }) => void;
  onCategorySelect: (name: string) => void;
  onClearOne: (filterName: keyof FiltersType) => void;
  onClearAll: () => void;
  filters: FiltersType;
  totalItems: number;
  showedItems: number;
  selectedCategoryName: string;
};

export default function Filters({
  categories,
  onChange,
  onCategorySelect,
  onClearOne,
  onClearAll,
  filters,
  totalItems,
  showedItems,
  selectedCategoryName,
}: FiltersProps) {
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(10000);
  const [gender, setGender] = useState<'unisex' | 'man' | 'women' | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    // функція перевірки розміру
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // перевіряємо при завантаженні
    window.addEventListener('resize', checkMobile); // слухаємо зміну розміру
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMinVal(filters.minVal);
    setMaxVal(filters.maxVal);
    setGender(filters.gender);
    setSelectedSize(filters.size);
  }, [filters]);

  const genderOptions = [
    { value: 'all', label: 'Всі', id: 'all' },
    { value: 'women', label: 'Жіночий', id: 'women' },
    { value: 'man', label: 'Чоловічий', id: 'man' },
    { value: 'unisex', label: 'Унісекс', id: 'unisex' },
  ];

  const toggleDropdown = () => setOpen(!open);
  const min = 0;
  const max = 10000;

  const debouncedOnChange = useDebouncedCallback(() => {
    onChange({
      minVal,
      maxVal,
      gender: gender as 'unisex' | 'man' | 'women' | undefined,
      size: selectedSize,
    });
  }, 500);

  useEffect(() => {
    debouncedOnChange();
  }, [minVal, maxVal, gender, selectedSize, debouncedOnChange]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setSelectedSize(name); // записуємо лише одне значення
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === 'all') {
      setGender(undefined);
    } else {
      setGender(val as 'unisex' | 'man' | 'women');
    }
  };
  return (
    <div className={css.sideBar}>
      {isMobile ? (
        <div className={css.sideBarMobile}>
          <div className={css.box}>
            <p>Фільтри</p>
            <button onClick={onClearAll}>Очистити всі</button>
          </div>
          <p className={css.numberOfGoods}>
            Показано {showedItems} з {totalItems}
          </p>
          <button className={css.dropdownButton} onClick={toggleDropdown}>
            Фільтри
            <svg className={open ? css.arrowUp : css.arrowDown} width={24} height={24}>
              <use href="/symbol-defs.svg#icon-keyboard_arrow_down"></use>
            </svg>
          </button>
          {open && (
            <div className={css.dropdownContent}>
              <div>
                <ul>
                  <li className={css.categoryListItem}>
                    <p
                      className={`${css.category} ${selectedCategoryName === 'Усі товари' ? css.categoryActive : ''}`}
                      onClick={() => onCategorySelect('Усі товари')}
                    >
                      Усі
                    </p>
                  </li>
                  {categories.map((category) => (
                    <li className={css.categoryListItem} key={category._id}>
                      <p
                        className={`${css.category} ${selectedCategoryName === category.name ? css.categoryActive : ''}`}
                        onClick={() => onCategorySelect(category.name)}
                      >
                        {category.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={css.sizesContainer}>
                <div className={css.box}>
                  <p className={css.containerTitle}>Розмір</p>
                  <button onClick={() => onClearOne('size')}>Очистити</button>
                </div>
                <div className={css.sizesBox}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <label key={size}>
                      <input
                        type="checkbox"
                        name={size}
                        checked={selectedSize === size}
                        onChange={handleSizeChange}
                      />
                      {size.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
              <div className={css.sliderContainer}>
                <div className={css.box}>
                  <p className={css.containerTitle}>Ціна</p>
                  <button
                    onClick={() => {
                      onClearOne('minVal');
                      onClearOne('maxVal');
                    }}
                  >
                    Очистити
                  </button>
                </div>
                <div className={css.priceWrapper}>
                  <div className={css.slider}>
                    <div
                      className={css.sliderTrack}
                      style={{
                        background: `linear-gradient(to right, 
              #ddd ${((minVal - min) / (max - min)) * 100}%, 
              #000 ${((minVal - min) / (max - min)) * 100}%, 
              #000 ${((maxVal - min) / (max - min)) * 100}%, 
              #ddd ${((maxVal - min) / (max - min)) * 100}%)`,
                      }}
                    />

                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={minVal}
                      onChange={handleMinChange}
                      className={`${css.thumb} ${css.thumbLeft}`}
                    />
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={maxVal}
                      onChange={handleMaxChange}
                      className={`${css.thumb} ${css.thumbRight}`}
                    />
                  </div>
                  <div className={css.sliderValues}>
                    <span>{minVal}</span>
                    <span>{maxVal}</span>
                  </div>
                </div>
              </div>
              <div className={css.genderContainer}>
                <div className={css.box}>
                  <p className={css.containerTitle}>Стать</p>
                  <button onClick={() => onClearOne('gender')}>Очистити</button>
                </div>

                <div className={css.radiosBox}>
                  {genderOptions.map((option) => (
                    <label key={option.id} className={css.radio}>
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={
                          option.value === 'all' ? gender === undefined : gender === option.value
                        }
                        onChange={handleGenderChange}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={css.sideBarDescktop}>
          <div>
            <div className={css.box}>
              <p>Фільтри</p>
              <button onClick={onClearAll}>Очистити всі</button>
            </div>
            <p className={css.numberOfGoods}>
              Показано {showedItems} з {totalItems}
            </p>
            <ul>
              <li className={css.categoryListItem}>
                <p
                  className={`${css.category} ${selectedCategoryName === 'Усі товари' ? css.categoryActive : ''}`}
                  onClick={() => onCategorySelect('Усі товари')}
                >
                  Усі
                </p>
              </li>
              {categories.map((category) => (
                <li className={css.categoryListItem} key={category._id}>
                  <p
                    className={`${css.category} ${selectedCategoryName === category.name ? css.categoryActive : ''}`}
                    onClick={() => onCategorySelect(category.name)}
                  >
                    {category.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className={css.sizesContainer}>
            <div className={css.box}>
              <p className={css.containerTitle}>Розмір</p>
              <button onClick={() => onClearOne('size')}>Очистити</button>
            </div>
            <div className={css.sizesBox}>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    name={size}
                    checked={selectedSize === size}
                    onChange={handleSizeChange}
                  />
                  {size.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className={css.sliderContainer}>
            <div className={css.box}>
              <p className={css.containerTitle}>Ціна</p>
              <button
                onClick={() => {
                  onClearOne('minVal');
                  onClearOne('maxVal');
                }}
              >
                Очистити
              </button>
            </div>
            <div className={css.priceWrapper}>
              <div className={css.slider}>
                <div
                  className={css.sliderTrack}
                  style={{
                    background: `linear-gradient(to right, 
              #ddd ${((minVal - min) / (max - min)) * 100}%, 
              #000 ${((minVal - min) / (max - min)) * 100}%, 
              #000 ${((maxVal - min) / (max - min)) * 100}%, 
              #ddd ${((maxVal - min) / (max - min)) * 100}%)`,
                  }}
                />

                <input
                  type="range"
                  min={min}
                  max={max}
                  value={minVal}
                  onChange={handleMinChange}
                  className={`${css.thumb} ${css.thumbLeft}`}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={maxVal}
                  onChange={handleMaxChange}
                  className={`${css.thumb} ${css.thumbRight}`}
                />
              </div>
              <div className={css.sliderValues}>
                <span>{minVal}</span>
                <span>{maxVal}</span>
              </div>
            </div>
          </div>
          <div className={css.genderContainer}>
            <div className={css.box}>
              <p className={css.containerTitle}>Стать</p>
              <button onClick={() => onClearOne('gender')}>Очистити</button>
            </div>

            <div className={css.radiosBox}>
              {genderOptions.map((option) => (
                <label key={option.id} className={css.radio}>
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={
                      option.value === 'all' ? gender === undefined : gender === option.value
                    }
                    onChange={handleGenderChange}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
