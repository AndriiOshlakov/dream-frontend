"use client";

import { useParams, useRouter } from "next/navigation";
import css from "@/app/@modal/(.)notes/[id]/PreviewModal.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";

export default function PreviewModal() {
  const router = useRouter();
  const close = () => router.back();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (!note || error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <Modal onClose={close}>
      <button onClick={close} className={css.backBtn}>
        Close
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {note?.createdAt
              ? `Created at: ${note.createdAt} `
              : `Updated at: ${note.updatedAt}`}
          </p>
        </div>
      </div>
    </Modal>
  );
}
