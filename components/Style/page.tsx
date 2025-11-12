import css from './StylePage.module.css';
import iconQuality from '../../public/images/Quality.svg';
import iconUnivers from '../../public/images/Universal.svg';
import iconComfort from '../../public/images/Comfort.svg';
import Image from 'next/image';
const advantages = [
  {
    icon: iconQuality,
    title: 'Якість та натуральність',
    description: 'тільки приємні до тіла тканини, які зберігають форму навіть після десятків прань.',
  },
  {
    icon: iconUnivers,
    title: 'Універсальний дизайн',
    description: 'базові кольори та лаконічний стиль, що легко комбінуються між собою.',
  },
  {
    icon: iconComfort,
    title: 'Комфорт на кожен день',
    description: 'одяг, який не обмежує рухів і підходить для будь-якої ситуації.',
  },
];
export default function Style() {
    return(
        <section className={css.styleSection}>
            <div className={css.content}>
          <h2 className={css.title}>
        Обери свій унікальний стиль сьогодні
      </h2>
          <ul className={css.advantagesList}>
        {advantages.map((advantage) => (
          <li key={advantage.title} className={css.advantageCard}>
        
            <Image
 src={advantage.icon}  
 alt={advantage.title}
className={css.cardIcon}
 width={56}  
 height={56}  
 />
          <h3 className={css.cardTitle}>
              {advantage.title}
            </h3>
           
            <p className={css.cardDesc}>
              {advantage.description}
            </p>
          </li>
        ))}
      </ul>
            </div>
        </section>
    )
}
