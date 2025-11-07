import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
import { fetchNotesServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "All" ? "All notes" : (slug[0] as NoteTag);
  return {
    title: `${tag}`,
    description: `My notes page with ${tag} filter`,
    openGraph: {
      title: `${tag}`,
      description: `My notes page with ${tag} filter`,
      url: `https://08-zustand-phi-bice.vercel.app/notes/filter/${slug[0]}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Filtered by ${tag}`,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotesServer({ page: 1, perPage: 10, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
