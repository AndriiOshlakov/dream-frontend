import css from './MessageNoInfo.module.css';

type MessageNoInfoProps = {
  text: string;
  buttonText: string;
};

export default function MessageNoInfo({ text, buttonText }: MessageNoInfoProps) {
  return (
    <div className={css.box}>
      <p className={css.title}>{text}</p>
      <button type="button" className={css.btn}>
        {buttonText}
      </button>
    </div>
  );
}
