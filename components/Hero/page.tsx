import css from './HeroPage.module.css';
import Image from 'next/image';
import MobileImg from '../images/Hero_Img_mob.png';
import TabletImg from '../images/Hero_Img_tablet.png';
import DeskTopImg from '../images/Hero_image_dst.png';
 

export default function Hero() {

    return(
        <section className={css.heroSection}>
            <div className={css.container}>
                <div className={css.contentGroup}>
               
                <div className={css.content}>
                   <h1 className={css.title}>
                    Знайди свій стиль з Clothica вже сьогодні!
                </h1>
                   <p className={css.description}>
                    Clothica — це місце, де комфорт поєднується зі стилем. Ми створюємо базовий одяг, який легко комбінується та підходить для будь-якої нагоди. Обирай речі, що підкреслять твою індивідуальність і завжди будуть актуальними.
                </p>
                </div>
                <div className={css.actions}>
                    <a href="#" className={css.links}>До товарів</a>
                  <a href="#" className={css.links}>Дослідити категорії</a>
    </div>
    </div>
     <picture>
            <source 
                media="(max-width: 767px)" 
                srcSet={MobileImg.src} 
            />
             
            <source 
                media="(min-width: 768px) and (max-width: 1439px)" 
                srcSet={TabletImg.src} 
            />
                         
            <Image
                src={DeskTopImg} // Fallback src, but Next.js will use it for all viewports if <source> is not matched.
                alt="Clothica"
                width={640} 
                height={394} 
                className={css.heroImage}
            />
        </picture>
   
             </div>

        </section>
    )
}
