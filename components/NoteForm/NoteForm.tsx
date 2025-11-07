"use client";

import css from "./NoteForm.module.css";
import { NoteCreatePayload, NoteTag } from "@/types/note";
import { createNote } from "@/lib/api/clientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const createMutation = useMutation({
    mutationFn: (data: NoteCreatePayload) => createNote(data),
    onSuccess: () => {
      alert("Note created succesfuly!!!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  async function handleSubmit(formData: FormData) {
    const values: NoteFormValues = {
      title: formData.get("title") as string,
      content: (formData.get("content") as string) || "",
      tag: formData.get("tag") as NoteTag,
    };
    createMutation.mutate(values);
  }
  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          minLength={3}
          maxLength={50}
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          required
          className={css.textarea}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
          <option value="Ideas">Ideas</option>
          <option value="Travel">Travel</option>
          <option value="Finance">Finance</option>
          <option value="Health">Health</option>
          <option value="Important">Important</option>
        </select>
      </div>

      {createMutation.isError && (
        <div className={css.error}>
          {(createMutation.error as Error).message}
        </div>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
