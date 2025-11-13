'use client';

import Link from 'next/link';
import css from './Filters.module.css';
import { useEffect, useState } from 'react';
import { Category } from '@/types/category';
import { getCategories } from '@/lib/api/clientApi';

export default function Filters() {
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(3000);
  const [gender, setGender] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
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

  useEffect(() => {
    // функція перевірки розміру
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // перевіряємо при завантаженні
    window.addEventListener('resize', checkMobile); // слухаємо зміну розміру
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) {
      // додаємо розмір у масив
      setSelectedSizes((prev) => [...prev, name]);
    } else {
      // видаляємо розмір, якщо знято галочку
      setSelectedSizes((prev) => prev.filter((size) => size !== name));
    }
  };

  const genderOptions = [
    { value: 'all', label: 'Всі' },
    { value: 'female', label: 'Жіночий' },
    { value: 'male', label: 'Чоловічий' },
    { value: 'other', label: 'Унісекс' },
  ];

  const toggleDropdown = () => setOpen(!open);
  const min = 0;
  const max = 15000;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGender(value);
  };
  return (
    <div className={css.sideBar}>
      {isMobile ? (
        <div className={css.sideBarMobile}>
          <h1>Обрана категоря</h1>
          <div className={css.box}>
            <p>Фільтри</p>
            <button>Очистити всі</button>
          </div>
          <p className={css.numberOfGoods}>Показано 15 з 100</p>
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
                    <Link className={css.category} href={'/categories/allGoods'}>
                      Усі
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li className={css.categoryListItem} key={category._id}>
                      <Link className={css.category} href={`/categories/{category._id}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={css.sizesContainer}>
                <div className={css.box}>
                  <p className={css.containerTitle}>Розмір</p>
                  <button>Очистити</button>
                </div>
                <div className={css.sizesBox}>
                  {['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].map((size) => (
                    <label key={size}>
                      <input
                        type="checkbox"
                        name={size}
                        checked={selectedSizes.includes(size)}
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
                  <button>Очистити</button>
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
                  <button>Очистити</button>
                </div>

                <div className={css.radiosBox}>
                  {genderOptions.map((option) => (
                    <label key={option.value} className={css.radio}>
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={gender === option.value}
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
            <h2>Обрана категоря</h2>
            <div className={css.box}>
              <p>Фільтри</p>
              <button>Очистити всі</button>
            </div>
            <p className={css.numberOfGoods}>Показано 15 з 100</p>
            <ul>
              <li className={css.categoryListItem}>
                <Link className={css.category} href={'/categories/allGoods'}>
                  Усі
                </Link>
              </li>
              {categories.map((category) => (
                <li className={css.categoryListItem} key={category._id}>
                  <Link className={css.category} href={`/categories/{category._id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={css.sizesContainer}>
            <div className={css.box}>
              <p className={css.containerTitle}>Розмір</p>
              <button>Очистити</button>
            </div>
            <div className={css.sizesBox}>
              {['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    name={size}
                    checked={selectedSizes.includes(size)}
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
              <button>Очистити</button>
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
              <button>Очистити</button>
            </div>

            <div className={css.radiosBox}>
              {genderOptions.map((option) => (
                <label key={option.value} className={css.radio}>
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
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
