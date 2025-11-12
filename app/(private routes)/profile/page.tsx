import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchMyOrders } from '@/lib/api/serverApi';
import ProfileClient from './Profile.client';

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
