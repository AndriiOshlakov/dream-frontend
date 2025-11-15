import { ClockLoader } from 'react-spinners';
import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.backdrop}>
      <ClockLoader color="#c5e1a5" />
    </div>
  );
}
