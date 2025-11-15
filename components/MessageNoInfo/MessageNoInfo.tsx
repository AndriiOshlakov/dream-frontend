import css from './MessageNoInfo.module.css';

type MessageNoInfoProps = {
  text: string;
  buttonText: string;
  onClick: () => void;
};

export default function MessageNoInfo({ text, buttonText, onClick }: MessageNoInfoProps) {
  return (
    <div className={css.box}>
      <p className={css.title}>{text}</p>
      <button type="button" className={css.btn} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}
