import css from "@/app/(private routes)/notes/filter/@sidebar/SidebarNotes.module.css";
import { NoteTag } from "@/types/note";
import Link from "next/link";

const tags: NoteTag[] = [
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Todo",
  "Important",
  "Ideas",
  "Health",
  "Travel",
  "Finance",
];

const Sidebar = () => {
  return (
    <div className="menuContainer">
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link href={`/notes/filter/All`} className={css.menuLink}>
            All Notes
          </Link>
        </li>
        {/* список тегів */}
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
