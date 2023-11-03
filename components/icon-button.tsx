import * as styles from './icon-button.css';

type Props = {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
};

const IconButton = ({children, label, onClick}: Props) => {
    return (
        <button
            aria-label={label}
            className={styles.iconButton}
            onClick={() => {
                onClick();
            }}
        >
            {children}
        </button>
    );
};

export default IconButton;
