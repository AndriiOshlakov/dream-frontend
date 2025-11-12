import css from '@/app/Home.module.css';

import Hero from '@/components/Hero/page';
import Style from '@/components/Style/page';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
        
export default function HomePage() {
  return (
    <>
     <Hero/>
     <Style/>
            <ReviewsList />
    </>
  );
}
