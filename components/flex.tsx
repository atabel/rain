import * as styles from './flex.css';

type Props = {
    gap: 0 | 4 | 8 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64;
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    as?: React.ComponentType<any> | keyof JSX.IntrinsicElements;
    children: React.ReactNode;
};

export const Stack = ({gap, children, as: Component = 'div', alignItems}: Props) => {
    return (
        <Component className={styles.stack} style={{gap, alignItems}}>
            {children}
        </Component>
    );
};

export const Inline = ({gap, children, as: Component = 'div', alignItems}: Props) => {
    return (
        <Component className={styles.inline} style={{gap, alignItems}}>
            {children}
        </Component>
    );
};
