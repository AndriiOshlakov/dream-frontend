import css from '@/app/Home.module.css';

// export default function HomePage() {
//   return (
//     <div>
//       <h1>Main Page</h1>
//     </div>
//   );
// }

import GoodsList from "@/components/GoodsList/GoodsList";


export default function HomePage() {
  return (
    <main className={`${css.container}`}>
      <h1 className={css.hidden}>Main Page</h1>

      <GoodsList />
    </main>
  );
}
