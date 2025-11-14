import { nextServer } from './api';
import { EditCurrentUser, User } from '@/types/user';
import { RegisterRequest, LoginRequest } from '@/types/auth';
import { CategoriesResponse } from '@/types/category';
import { Order } from '@/types/order';

//! ------
//! -AUTH-
//! ------

interface AuthResponse {
  message: string;
  user: User;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await nextServer.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await nextServer.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function logout() {
  await nextServer.post('/auth/logout');
}

interface RefreshSessionRequest {
  success: boolean;
}

export async function refreshSession() {
  const response = await nextServer.post<RefreshSessionRequest>('/auth/refresh');
  return response.data.success;
}

//! --------------
//! -EDIT-PROFILE-
//! --------------

export async function getMe(): Promise<User> {
  const response = await nextServer.get<User>('/users/current');
  return response.data;
}

export async function editMe(data: EditCurrentUser): Promise<User> {
  const response = await nextServer.patch<User>('/users/current', data);
  return response.data;
}

//! ------------
//! -CATEGORIES-
//! ------------

export async function getCategories(page?: number) {
  const response = await nextServer.get<CategoriesResponse>('/categories', {
    params: { page },
  });
  return response.data.categories;
}

//! -------
//! -GOODS-
//! -------
export interface GoodsRequestParams {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
}

interface GoodRessponse {
  _id: string;
  name: string;
  image: string;
  price: {
    value: number;
    currency: string;
  };
  category: string;
  size: string[];
  description: string;
  prevDescription: string;
  feedbacks: string[];
  gender: string;
  characteristics: string[];
}

interface GoodsResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  goods: GoodRessponse[];
}

export async function getGoods({ categoryId, priceMin, priceMax, page }: GoodsRequestParams) {
  const response = await nextServer.get<GoodsResponse>('/goods', {
    params: { categoryId, priceMin, priceMax, page },
  });
  return response.data;
}
//! --------
//! -ORDERS-
//! --------

export const fetchMyOrders = (): Order[] => {
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

//! -----------
//! -FEEDBACKS-
//! -----------

//! ---------------
//! -SUBSCRIPTIONS-
//! ---------------
