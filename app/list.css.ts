import {style} from '@vanilla-extract/css';
import {vars} from './global.css';

export const list = style({display: 'flex', flexDirection: 'column', marginBottom: -16});

export const row = style({borderTop: `1px solid ${vars.colors.divider}`});

export const rowLink = style({
    width: 'calc(100% + 32px)',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
    marginLeft: -16,
    marginRight: -16,
    color: 'inherit',
    textDecoration: 'none',
});

export const rowText = style({display: 'flex', alignItems: 'center'});
