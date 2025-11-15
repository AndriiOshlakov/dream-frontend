import css from './BasketMessageNoInfo.module.css';

interface BasketMessageNoInfoProps {
  text: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function BasketMessageNoInfo({
  text,
  buttonText,
  onClick,
}: BasketMessageNoInfoProps) {
  return (
    <div className={css.noOrdersWrapper}>
      <p className={css.messageText}>{text}</p>
      {buttonText && (
        <button className={css.shopButton} onClick={onClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}
