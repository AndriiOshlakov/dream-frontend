// import { FetchNotesParams, PostsHttpResponse } from "./api";
// import { Note, NoteCreatePayload } from "@/types/note";

import { RegisterRequest, LoginRequest } from '@/types/auth';
import { nextServer } from './api';
import { User } from '@/types/user';

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

interface RefreshSessionRequest {
  success: boolean;
}

export async function refreshSession() {
  const response = await nextServer.post<RefreshSessionRequest>('/auth/refresh');
  return response.data.success;
}

export async function getMe(): Promise<User> {
  const response = await nextServer.get<User>('/users/current');
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
