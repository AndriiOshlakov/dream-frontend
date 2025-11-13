import Hero from '@/components/Hero/Hero';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import Style from '@/components/Style/page';

import GoodsList from '@/components/GoodsList/GoodsList';
import PopularCategories from '@/components/PopularCategories/PopularCategories';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Style />
      <PopularCategories />
      <GoodsList />
      <ReviewsList />
    </>
  );
}
