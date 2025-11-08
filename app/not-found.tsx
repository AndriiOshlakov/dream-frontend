import css from '@/app/Home.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found',
    description: 'Sorry, the page you are looking for does not exist.',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Sorry, the page you are looking for does not exist.',
      },
    ],
    url: 'https://08-zustand.com/',
  },
};

const NotFound = () => {
  return (
    <div className={css.notFound}>
      <h2 className={css.title}>404 - Page not found</h2>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
