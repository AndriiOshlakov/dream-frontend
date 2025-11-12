import { cookies } from 'next/headers';
import { nextServer } from './api';

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get('/auth/refresh', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};

export const fetchMyOrders = async () => {
  return [
    {
      _id: '69135246d77bd9a8f9389459',
      userId: '64f5b1c8b6e1f9a123456789',
      goods: [
        {
          productId: '671fbb85ec7f5f1d6b65f2a9',
          title: 'Сорочка чоловіча',
          quantity: 2,
          price: 850,
          total: 1700,
        },
      ],
      status: 'pending',
      createdAt: '2025-11-11T21:32:57.327Z',
      updatedAt: '2025-11-11T21:32:57.327Z',
    },
  ];
};
