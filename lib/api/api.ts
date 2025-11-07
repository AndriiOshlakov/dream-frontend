import axios from "axios";
import { Note, NoteTag } from "@/types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";
export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});

export interface PostsHttpResponse {
  notes: Note[];
  totalPages: number;
}

export type NoteCreateData = Pick<Note, "title" | "content" | "tag">;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}
