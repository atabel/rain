import {vars} from '@/app/global.css';
import {style} from '@vanilla-extract/css';

const border = `1px solid ${vars.colors.border}`;
const borderRadius = 16;

export const card = style({
    position: 'relative',
    isolation: 'isolate',
    borderRadius,
    border,
    padding: '0 16px 16px',
    background: vars.colors.backgroundContainer,
});

export const cardTitle = style({
    fontSize: vars.fontSizes.title,
    fontWeight: 500,
    position: 'sticky',
    top: 60,
    zIndex: 1,
    background: vars.colors.background,
    margin: '-1px -17px 16px',
    padding: '16px 16px 0',
    ':before': {
        background: vars.colors.backgroundContainer,
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: borderRadius,
        borderTop: border,
        borderLeft: border,
        borderRight: border,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
    },
    ':after': {
        background: vars.colors.backgroundContainer,
        content: '""',
        display: 'block',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: `calc(100% - ${borderRadius}px)`,
        borderLeft: border,
        borderRight: border,
    },
});

export const cardTitleContent = style({
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
});
