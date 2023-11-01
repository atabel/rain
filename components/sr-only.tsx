import * as styles from './sr-only.css';

type Props = {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
};

const SROnly = ({children, as: Component = 'span'}: Props) => {
    return <Component className={styles.srOnly}>{children}</Component>;
};

export default SROnly;
