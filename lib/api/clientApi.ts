import { LoginRequest, RegisterRequest } from "@/types/auth";
import { FetchNotesParams, nextServer, PostsHttpResponse } from "./api";
import { User } from "@/types/user";
import { Note, NoteCreatePayload } from "@/types/note";

export async function register(data: RegisterRequest) {
  const response = await nextServer.post<User>("/auth/register", data);
  return response.data;
}
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export type EditProfileRequest = {
  username?: string;
};

export const editMe = async (data: EditProfileRequest) => {
  const response = await nextServer.patch<User>("/users/me", data);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<PostsHttpResponse> => {
  const response = await nextServer.get<PostsHttpResponse>("/notes", {
    params: { page, perPage, search, tag },
  });
  return response.data;
};

export const createNote = async (note: NoteCreatePayload): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
};
