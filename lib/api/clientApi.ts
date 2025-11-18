import { nextServer } from './api';
import { EditCurrentUser, User } from '@/types/user';
import { RegisterRequest, LoginRequest } from '@/types/auth';
import { CategoriesResponse } from '@/types/category';
import { Order } from '@/types/order';
import { ApiFeedback, Review, Reviews } from '@/types/feedback';

//! ------
//! -AUTH-
//! ------

interface AuthResponse {
  message: string;
  user: User;
}

export async function register(data?: RegisterRequest): Promise<AuthResponse> {
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
  category?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  perPage?: number;
  gender?: 'man' | 'women' | 'unisex' | undefined;
  size?: string;
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

export async function getGoods({
  category,
  priceMin,
  priceMax,
  page,
  perPage,
  gender,
  size,
}: GoodsRequestParams) {
  const response = await nextServer.get<GoodsResponse>('/goods', {
    params: { ...(category ? { category } : {}), priceMin, priceMax, page, perPage, gender, size },
  });

  return response.data;
}
//! --------
//! -ORDERS-
//! --------

export const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await nextServer.get<Order[]>('/orders/my');
  return response.data;
};

//! -----------
//! -FEEDBACKS-
//! -----------

export async function fetchReviews(): Promise<Review[]> {
  const response = await nextServer.get<ApiFeedback[]>('/feedbacks');

  const feedbacks = response.data;

  return feedbacks.map((feedback) => ({
    name: feedback.author,
    rating: feedback.rate,
    comment: feedback.description,
    category: feedback.category,
  }));
}

export async function sendFeedback(data: {
  author: string;
  description: string;
  rate: number;
  category: string;
  productId: string;
}): Promise<Reviews> {
  const response = await nextServer.post<{ data: Reviews }>('/feedbacks', data);
  return response.data.data;
}

//! ---------------
//! -SUBSCRIPTIONS-
//! ---------------
export async function subscribeUser(email: string) {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || 'Помилка підписки');
  }

  return response.json();
}
