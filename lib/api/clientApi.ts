// import { FetchNotesParams, PostsHttpResponse } from "./api";
// import { Note, NoteCreatePayload } from "@/types/note";

import { RegisterRequest, LoginRequest } from '@/types/auth';
import { nextServer } from './api';
import { User } from '@/types/user';
import { Category } from '@/types/category';
import { isAxiosError } from 'axios';

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
  return response.data;
}

// export const logout = async (): Promise<void> => {
//   await nextServer.post("/auth/logout");
// };

// export type EditProfileRequest = {
//   username?: string;
// };

// export const editMe = async (data: EditProfileRequest) => {
//   const response = await nextServer.patch<User>("/users/me", data);
//   return response.data;
// };

// export const fetchNoteById = async (id: string): Promise<Note> => {
//   const res = await nextServer.get<Note>(`/notes/${id}`);
//   return res.data;
// };

// export const fetchNotes = async ({
//   page,
//   perPage,
//   search,
//   tag,
// }: FetchNotesParams): Promise<PostsHttpResponse> => {
//   const response = await nextServer.get<PostsHttpResponse>("/notes", {
//     params: { page, perPage, search, tag },
//   });
//   return response.data;
// };

// export const createNote = async (note: NoteCreatePayload): Promise<Note> => {
//   const res = await nextServer.post<Note>("/notes", note);
//   return res.data;
// };

// export const deleteNote = async (id: string): Promise<Note> => {
//   const res = await nextServer.delete<Note>(`/notes/${id}`);
//   return res.data;
// };

export interface FetchCategoriesResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  categories: Category[];
}

export interface FetchCategoriesParam {
  page: string;
  perPage: string;
}
if (!nextServer.defaults.baseURL) {
  nextServer.defaults.baseURL =
    (process.env.NEXT_PUBLIC_API_URL || 'https://dream-backend-a69s.onrender.com') + '/api';
}

export async function fetchCategoriesClient(
  page = 1,
  perPage = 6
): Promise<FetchCategoriesResponse> {
  try {
    const params: FetchCategoriesParam = {
      page: String(page),
      perPage: String(perPage),
    };

    const { data } = await nextServer.get<FetchCategoriesResponse>('/categories/', { params });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Fetching categories failed');
    }
    throw new Error('Fetching categories failed');
  }
}
