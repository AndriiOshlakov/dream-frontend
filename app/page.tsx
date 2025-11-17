import Hero from '@/components/Hero/Hero';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import Style from '@/components/Style/page';

import GoodsList from '@/components/GoodsList/GoodsList';
import CategoriesList from '@/components/CategoriesList/CategoriesList';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Style />
      <CategoriesList />
      <GoodsList />
      <ReviewsList />
    </>
  );
}
