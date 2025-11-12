import css from '@/app/Home.module.css';
import Hero from '@/components/Hero/page';
import Style from '@/components/Style/page';
import CreateOrder from './order/page';

export default function HomePage() {
  return (
    <>
     <Hero/>
     <Style/>
     <CreateOrder/>
    </>
  );
}
