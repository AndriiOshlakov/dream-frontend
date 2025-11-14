'use client';

import { useQuery } from '@tanstack/react-query';
import css from './Profile.module.css';
import OrderItem from '@/components/OrderItem/OrderItem';
import ProfileForm from '@/components/ProfileForm/ProfileForm';
import { fetchMyOrders } from '@/lib/api/clientApi';

export default function ProfileClient() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !orders) return <p>Something went wrong.</p>;

  return (
    <div className={css.profile}>
      <h1 className={css.heading}>Кабінет</h1>

      <div className={css.dashboard}>
        <section className={css.ordersSection}>
          <h2 className={css.subheading}>Мої замовлення</h2>
          {orders.length > 0 ? (
            <ul className={css.ordersList}>
              {orders.map((order) => {
                return (
                  <li key={order._id}>
                    <OrderItem order={order} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={css.noOrdersPlaceholder}>
              <p className={css.noOrdersInfo}>
                У вас ще не було жодних замовлень! Мершій до покупок!
              </p>
              <button className={css.orderButton}>До покупок</button>
            </div>
          )}
        </section>

        <section className={css.infoSection}>
          <h2 className={css.subheading}>Особиста інформація</h2>
          <ProfileForm />
        </section>
      </div>

      <button className={css.logoutButton}>Вийти з кабінету</button>
    </div>
  );
}
