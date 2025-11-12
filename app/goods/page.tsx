import Filters from '@/components/Filters/Filters';
import css from './GoodsPage.module.css';
import { getCategories } from '@/lib/api/clientApi';

export default async function GoodsPage() {
  return <Filters />;
}
