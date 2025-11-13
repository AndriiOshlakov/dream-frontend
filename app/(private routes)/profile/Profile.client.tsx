'use client';

import { useQuery } from '@tanstack/react-query';
import css from './Profile.module.css';
// import OrderItem from '@/components/OrderItem/OrderItem';
import ProfileForm from '@/components/ProfileForm/ProfileForm';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout, fetchMyOrders } from '@/lib/api/api';

export default function ProfileClient() {
  const router = useRouter();
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push('/auth/login');
  };

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
        <section>
          <h2 className={css.subheading}>Мої замовлення</h2>
          <ul>
            {orders.map((order) => {
              return (
                <li key={order._id}>
                  {/* <OrderItem order={order} /> */}
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className={css.subheading}>Особиста інформація</h2>
          <ProfileForm />
        </section>
      </div>

      <button onClick={handleLogout} className={css.logoutButton}>
        Вийти з кабінету
      </button>
    </div>
  );
}
