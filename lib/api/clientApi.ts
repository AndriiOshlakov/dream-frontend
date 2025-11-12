import { RegisterRequest, LoginRequest } from '@/types/auth';
import { nextServer } from './api';
import { User } from '@/types/user';
import { CategoriesResponse } from '@/types/category';

export async function register(data: RegisterRequest) {
  const response = await nextServer.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await nextServer.post<User>('/auth/login', data);
  return response.data;
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
