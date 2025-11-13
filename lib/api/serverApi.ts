// import { FetchNotesParams } from "./api";
// import { Note } from "@/types/note";
// import { User } from "@/types/user";

import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';

export async function refreshServerSession() {
  const cookieStore = await cookies();
  const response = await nextServer.post('/auth/refresh', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
}

export async function getServerMe(): Promise<User> {
  const cookieStore = await cookies();
  const response = await nextServer.get('/users/current', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

// interface PostsHttpResponse {
//   notes: Note[];
//   totalPages: number;
// }

// export const fetchNotesServer = async ({
//   page,
//   perPage,
//   search,
//   tag,
// }: FetchNotesParams): Promise<PostsHttpResponse> => {
//   const cookieStore = await cookies();
//   const response = await nextServer.get<PostsHttpResponse>("/notes", {
//     params: { page, perPage, search, tag },
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return response.data;
// };

// export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
//   const cookieStore = await cookies();
//   const res = await nextServer.get<Note>(`/notes/${id}`, {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return res.data;
// };
