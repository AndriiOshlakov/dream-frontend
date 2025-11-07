"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "@/lib/api/clientApi";
import Link from "next/link";

interface NoteListProps {
  items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      alert("Note deleted succesfuly!!!");
      // Перевантажуємо список нотаток після видалення
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Delete note error:", error);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {items.map((item) => (
        <li className={css.listItem} key={item.id}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <Link href={`/notes/${item.id}`}>View Details</Link>
            <button
              className={css.button}
              onClick={() => handleDelete(item.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
