import axios from 'axios';

import { RegisterRequest, LoginRequest } from '@/types/auth';
import { User } from '@/types/user';
import { CategoriesResponse } from '@/types/category';

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});

export async function register(data: RegisterRequest) {
  const response = await nextServer.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await nextServer.post<User>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

interface CheckSessionRequest {
  success: boolean;
}

export async function checkSession() {
  const response = await nextServer.get<CheckSessionRequest>('/auth/refresh');
  return response.data.success;
}

export async function getMe() {
  const response = await nextServer.get<User>('/users/me');
  return response;
}
export async function getCategories(page: CategoriesResponse['page']) {
  const response = await nextServer.get<CategoriesResponse>('/categories', { params: { page } });
  console.log(response.data.categories);

  return response.data.categories;
}

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
