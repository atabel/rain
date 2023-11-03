import {vars} from '@/app/global.css';

type Props = {
    children: React.ReactNode;
};

const Title = ({children}: Props) => {
    return (
        <h1
            style={{
                fontSize: vars.fontSizes.pageTitle,
                fontWeight: 500,
                position: 'sticky',
                top: 0,
                background: vars.colors.background,
                paddingBottom: '16px',
                paddingTop: '16px',
                zIndex: 1,
                minHeight: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </h1>
    );
};

export default Title;
