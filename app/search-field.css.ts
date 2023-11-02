import {style} from '@vanilla-extract/css';
import {vars} from './global.css';

export const field = style({
    position: 'relative',
    width: '100%',
});

export const fieldWithValue = style({});

export const label = style({
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 48,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease-in-out',
    color: vars.colors.textSecondary,

    selectors: {
        [`${field}:focus-within &`]: {
            transform: 'translate(-6px, -12px) scale(0.75)',
        },
        [`${fieldWithValue} &`]: {
            transform: 'translate(-6px, -12px) scale(0.75)',
        },
    },
});

export const searchIcon = style({
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    height: '100%',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

export const input = style({
    fontFamily: 'inherit',
    appearance: 'none',
    outline: 0,
    lineHeight: '24px',
    boxShadow: 'none',
    textOverflow: 'ellipsis',
    background: vars.colors.backgroundContainer,
    border: `1px solid ${vars.colors.border}`,
    height: 56,
    borderRadius: 16,
    padding: '24px 48px 8px 48px',
    width: '100%',
    boxSizing: 'border-box',
    color: vars.colors.text,
    fontSize: vars.fontSizes.normal,
});

export const loadingIndicator = style({
    position: 'absolute',
    right: 12,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
});

export const clearButton = style({
    position: 'absolute',
    right: 12,
    top: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',

    // reset button styles
    border: 'none',
    margin: 0,
    padding: 0,
    width: 'auto',
    overflow: 'visible',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    WebkitFontSmoothing: 'inherit',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
});
