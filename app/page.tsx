import Hero from '@/components/Hero/Hero';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import Style from '@/components/Style/page';

import GoodsList from "@/components/GoodsList/GoodsList";


export default function HomePage() {
  return ( <>
      <Hero />
      <Style />
       <GoodsList />
      <ReviewsList />
    </>
  );
}
