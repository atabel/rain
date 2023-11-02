import {vars} from '@/app/global.css';
import {globalStyle, keyframes, style} from '@vanilla-extract/css';

export const horizontalList = style({
    overflowX: 'auto',
    display: 'flex',
    overflowY: 'hidden',
    margin: '0 -16px',
    padding: '0 16px',
    width: 'calc(100% + 32px)',
});

globalStyle(`${horizontalList}::-webkit-scrollbar`, {
    display: 'none',
});

export const hour = style({});
export const amount = style({});

export const tableRow = style({});
export const tableCell = style({
    textTransform: 'capitalize',
    paddingRight: 16,
    paddingBottom: 16,
    whiteSpace: 'nowrap',
    ':last-child': {
        paddingRight: 0,
    },
    selectors: {
        [`${tableRow}:last-child &`]: {
            paddingBottom: 0,
        },
    },
});

export const progressBar = style({
    width: '100%',
    background: vars.colors.barBackground,
    height: 8,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
});

const progressAnimation = keyframes({
    from: {
        transform: 'scaleX(0)',
    },
    to: {
        transform: 'scaleX(1)',
    },
});

export const progressBarInner = style({
    background: vars.colors.bar,
    height: '100%',
    width: '100%',
    borderRadius: 4,
    transformOrigin: 'left center',
    animation: `${progressAnimation} 1s ease-in-out`,
});
