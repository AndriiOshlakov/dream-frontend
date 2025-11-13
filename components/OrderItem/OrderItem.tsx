import css from './OrderItem.module.css';
import type { Order, OrderGoodsItem } from '@/types/order';

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('uk-UA');
  } catch {
    return iso;
  }
}

type OrderItemProps = {
  order: Order;
};

export default function OrderItem({ order }: OrderItemProps) {
  const total = order.goods.reduce((sum: number, good: OrderGoodsItem) => sum + good.total, 0);

  return (
    <div className={css.itemContainer}>
      <div>
        <time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
        <div className={css.label}>#{order._id.slice(0, 8)}</div>
      </div>

      <div>
        <div className={css.label}>Сума:</div>
        <div className={css.value}>{total} грн</div>
      </div>

      <div>
        <div className={css.label}>Статус:</div>
        <div className={css.value}>В обробці</div>
      </div>
    </div>
  );
}
