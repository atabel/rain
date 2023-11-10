import {createGlobalTheme, createTheme, globalStyle} from '@vanilla-extract/css';

const colors = {
    text: 'black',
    textSecondary: '#888',
    background: 'white',
    backgroundContainer: 'white',
    backgroundContainerHover: '#eee',
    bar: 'skyblue',
    barBackground: '#eee',
    border: '#ccc',
    divider: '#eee',
} as const;

const darkModeColors = {
    text: 'white',
    textSecondary: '#888',
    background: '#080808',
    backgroundContainer: '#191919',
    backgroundContainerHover: '#222',
    bar: 'skyblue',
    barBackground: '#222',
    border: 'transparent',
    divider: '#333',
} as const;

const fontSizes = {
    normal: '1rem',
    pageTitle: '1.75rem',
    title: '1.125rem',
    extraLarge: '4rem',
};

export const [lightModeClass, vars] = createTheme({
    colors,
    fontSizes,
});

export const darkModeClass = createTheme(vars, {
    colors: darkModeColors,
    fontSizes,
});

createGlobalTheme(':root', vars, {colors, fontSizes});

type ColorVarName = (typeof vars.colors)[keyof typeof vars.colors];

const darkModeVarsDeclaration: Record<ColorVarName, string> = Object.fromEntries(
    Object.entries(vars.colors).map(([color, cssVar]) => [cssVar, (darkModeColors as any)[color]])
);

globalStyle(':root', {
    '@media': {
        '(prefers-color-scheme: dark)': {
            vars: darkModeVarsDeclaration,
        },
    },

    background: vars.colors.background,
    color: vars.colors.text,
});
