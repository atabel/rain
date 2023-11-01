import {style} from '@vanilla-extract/css';

export const flex = style({
    display: 'flex',
});

export const stack = style([
    flex,
    {
        flexDirection: 'column',
    },
]);

export const inline = style([
    flex,
    {
        flexDirection: 'row',
    },
]);
