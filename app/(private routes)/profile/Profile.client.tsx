'use client';

import { useQuery } from '@tanstack/react-query';
import css from './Profile.module.css';
import OrderItem from '@/components/OrderItem/OrderItem';
import UserInfoForm from '@/components/UserInfoForm/UserInfoForm';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import Loader from '@/components/Loader/Loader';
import { logout, fetchMyOrders, editMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useShopStore } from '@/lib/store/cartStore';
import { EditCurrentUser } from '@/types/user';

export default function ProfileClient() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const clearCart = useShopStore((state) => state.clearCart);

  const router = useRouter();
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const handleUserUpdate = async (userUpdate: EditCurrentUser) => {
    const updatedUser = await editMe(userUpdate);
    setUser(updatedUser);
    return updatedUser;
  };

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    clearCart();
    router.push('/auth/login');
  };

  const handleGoToGoods = () => router.push('/goods');

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    refetchOnMount: false,
  });

  if (isLoading) return <Loader />;

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
            <MessageNoInfo
              text="У вас ще не було жодних замовлень! Мершій до покупок!"
              buttonText="До покупок"
              onClick={handleGoToGoods}
            />
          )}
        </section>

        <section className={css.infoSection}>
          <h2 className={css.subheading}>Особиста інформація</h2>
          <UserInfoForm user={user} updateUser={handleUserUpdate} />
        </section>
      </div>

      <button onClick={handleLogout} className={css.logoutButton}>
        Вийти з кабінету
      </button>
    </div>
  );
}
