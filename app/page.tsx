import css from '@/app/Home.module.css';
import Hero from '@/components/Hero/Hero';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import Style from '@/components/Style/page';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Style />
      <ReviewsList />
    </>
  );
}
