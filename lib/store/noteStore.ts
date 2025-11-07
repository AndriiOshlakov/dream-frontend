import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteCreateData } from "../api/api";

type NoteDraftStore = {
  draft: NoteCreateData;
  setDraft: (note: Partial<NoteCreateData>) => void;
  clearDraft: () => void;
};

const initialDraft: NoteCreateData = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: "note-draft" }
  )
);
