"use client";
import css from "@/app/(private routes)/notes/filter/[...slug]/NotesPage.module.css";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { fetchNotes } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import { NoteTag } from "@/types/note";
import Link from "next/link";

interface NotesClientProps {
  tag?: NoteTag;
}

function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const perPage = 12;

  const { data } = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });
  console.log(data?.notes);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={(selected) => setPage(selected + 1)}
            forcePage={page - 1}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {data && data.notes?.length > 0 && <NoteList items={data.notes} />}
    </div>
  );
}

export default NotesClient;
