import {Stack} from './flex';
import * as styles from './card.css';

type CardProps = {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
};

const Card = ({title, right, children}: CardProps) => {
    return (
        <section className={styles.card}>
            <div className={styles.cardTitle}>
                <div className={styles.cardTitleContent}>
                    <h2>{title}</h2>
                    <div>{right}</div>
                </div>
            </div>
            {children}
        </section>
    );
};

export default Card;
