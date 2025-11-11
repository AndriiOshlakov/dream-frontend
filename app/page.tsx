import css from '@/app/Home.module.css';
import ReviewsList from '@/components/ReviewsList/ReviewsList';

export default function HomePage() {
  return (
    <div>
      <h1>Main Page</h1>
      <ReviewsList />
    </div>
  );
}
