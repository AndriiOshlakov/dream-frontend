import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import ProfileClient from './Profile.client';
import { fetchMyOrders } from '@/lib/api/clientApi';

export default async function Profile() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient />
    </HydrationBoundary>
  );
}
