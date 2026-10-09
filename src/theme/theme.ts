import { useSyncExternalStore } from 'react';
import { alpha } from './alpha';

export type PaletteMode = 'light' | 'dark';

export interface PaletteColor {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
}

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpointValues: Record<BreakpointKey, number> = {
    xs: 0,
    sm: 768,
    md: 1024,
    lg: 1440,
    xl: 1720,
};

const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl'];

function nextBreakpointValue(key: BreakpointKey): number | null {
    const index = breakpointOrder.indexOf(key);
    const next = breakpointOrder[index + 1];
    return next ? breakpointValues[next] : null;
}

export const breakpoints = {
    values: breakpointValues,
    keys: breakpointOrder,
    up(key: BreakpointKey | number): string {
        const value = typeof key === 'number' ? key : breakpointValues[key];
        return `@media (min-width:${value}px)`;
    },
    down(key: BreakpointKey | number): string {
        const value = typeof key === 'number' ? key : breakpointValues[key];
        return `@media (max-width:${value - 0.05}px)`;
    },
    between(start: BreakpointKey | number, end: BreakpointKey | number): string {
        const min = typeof start === 'number' ? start : breakpointValues[start];
        const max = typeof end === 'number' ? end : breakpointValues[end];
        return `@media (min-width:${min}px) and (max-width:${max - 0.05}px)`;
    },
    only(key: BreakpointKey): string {
        const next = nextBreakpointValue(key);
        if (next === null) return breakpoints.up(key);
        return breakpoints.between(key, next);
    },
    not(key: BreakpointKey): string {
        const next = nextBreakpointValue(key);
        if (next === null) return breakpoints.down(key);
        if (key === 'xs') return breakpoints.up(next);
        return `@media (max-width:${breakpointValues[key] - 0.05}px), (min-width:${next}px)`;
    },
};

export function spacing(...values: Array<number | string>): string {
    return values.map(value => (typeof value === 'number' ? `${value * 8}px` : value)).join(' ');
}

export const shape = { borderRadius: 8 };

export const zIndex = {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    drawer: 1100,
    appBar: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
};

export const transitions = {
    duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
    },
    easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    create(
        props: string | string[] = ['all'],
        options: { duration?: number | string; easing?: string; delay?: number | string } = {}
    ): string {
        const duration = options.duration ?? transitions.duration.standard;
        const easing = options.easing ?? transitions.easing.easeInOut;
        const delay = options.delay ?? 0;
        const format = (value: number | string) =>
            typeof value === 'number' ? `${Math.round(value)}ms` : value;
        return (Array.isArray(props) ? props : [props])
            .map(prop => `${prop} ${format(duration)} ${easing} ${format(delay)}`)
            .join(',');
    },
};

export const sansFontFamily = "'IBM Plex Sans', sans-serif";
export const monoFontFamily = "'IBM Plex Mono', monospace";

export const typography = {
    fontFamily: sansFontFamily,
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    pxToRem(px: number): string {
        return `${px / 16}rem`;
    },
    h1: { fontFamily: sansFontFamily, fontWeight: 700, fontSize: '3.5rem', lineHeight: 1.375 },
    h2: { fontFamily: sansFontFamily, fontWeight: 700, fontSize: '3rem', lineHeight: 1.375 },
    h3: { fontFamily: sansFontFamily, fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.375 },
    h4: { fontFamily: sansFontFamily, fontWeight: 700, fontSize: '2rem', lineHeight: 1.375 },
    h5: { fontFamily: sansFontFamily, fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.375 },
    h6: { fontFamily: sansFontFamily, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.375 },
    subtitle1: { fontFamily: sansFontFamily, fontWeight: 500, fontSize: '1rem', lineHeight: 1.75 },
    subtitle2: {
        fontFamily: sansFontFamily,
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
    },
    body1: { fontFamily: sansFontFamily, fontWeight: 400, fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontFamily: sansFontFamily, fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.57 },
    button: { fontFamily: sansFontFamily, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.75 },
    caption: { fontFamily: monoFontFamily, fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.66 },
    overline: {
        fontFamily: monoFontFamily,
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: 2.5,
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
    },
};

const grey = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#f5f5f5',
    A200: '#eeeeee',
    A400: '#bdbdbd',
    A700: '#616161',
};

const common = { black: '#000', white: '#fff' };

const status = {
    error: { main: '#D14343', light: '#DA6868', dark: '#922E2E' },
    warning: { main: '#FFB020', light: '#FFBF4C', dark: '#B27B16' },
    info: { main: '#2196F3', light: '#64B6F7', dark: '#0B79D0' },
    success: { main: '#14B8A6', light: '#43C6B7', dark: '#0E8074' },
};

const lightNeutral = {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
};

const darkNeutral = {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9da4ae',
    500: '#6A6B7A',
    600: '#313241',
    700: '#1C1D2E',
    800: '#171928',
    900: '#121522',
};

export const lightBlurColor = 'rgba(210, 210, 210, 0.5)';
export const darkBlurColor = 'rgba(28, 31, 44, 0.5)';
export const blurFilter = 'blur(24px)';

const lightPalette = {
    mode: 'light' as PaletteMode,
    common,
    grey,
    primary: {
        main: '#10B981',
        light: '#3FC79A',
        dark: '#0B815A',
        contrastText: '#F9FAFC',
        paper: '#e6f7f1',
        contrastTextLight: '#f2f3f6',
    },
    secondary: { main: '#10B981', light: '#3FC79A', dark: '#0B815A', contrastText: '#FFFFFF' },
    error: { ...status.error, contrastText: '#FFFFFF' },
    warning: { ...status.warning, contrastText: '#FFFFFF' },
    info: { ...status.info, contrastText: '#FFFFFF' },
    success: { ...status.success, contrastText: '#FFFFFF' },
    text: {
        primary: '#121828',
        secondary: '#65748B',
        disabled: 'rgba(55, 65, 81, 0.48)',
        tertiary: '#d0d0d6',
    },
    divider: '#C6C8D0',
    background: {
        default: '#F9FAFC',
        paper: '#FFFFFF',
        hover: '#f2f3f6',
        active: '#e8e9ec',
        sidebar: '#FFFFFF',
        input: '#f8f8fa',
    },
    action: {
        active: '#6B7280',
        hover: 'rgba(55, 65, 81, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(55, 65, 81, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(55, 65, 81, 0.26)',
        disabledBackground: 'rgba(55, 65, 81, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(55, 65, 81, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },
    neutral: lightNeutral,
    attribute: {
        default: '#f1f0f0',
        gray: '#e3e2e0',
        brown: '#eedfda',
        orange: '#f9dec9',
        yellow: '#fdecc8',
        green: '#dbecdb',
        blue: '#d3e4ef',
        purple: '#e7deee',
        pink: '#f4e0e9',
        red: '#ffe2dd',
    },
    attributeText: {
        default: '#37352f',
        gray: '#37352f',
        brown: '#37352f',
        orange: '#37352f',
        yellow: '#37352f',
        green: '#37352f',
        blue: '#37352f',
        purple: '#37352f',
        pink: '#37352f',
        red: '#37352f',
    },
    option: { primaryActive: '#e6f7f1', primaryHover: '#d1f0e5', hover: '#f7f8f8' },
    blur: lightBlurColor,
};

export type AppPalette = typeof lightPalette;

const darkPalette: AppPalette = {
    mode: 'dark',
    common,
    grey,
    primary: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrastText: '#0D101C',
        paper: '#e6f7f1',
        contrastTextLight: '#1E253B',
    },
    secondary: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#0D101C' },
    error: { ...status.error, contrastText: '#121522' },
    warning: { ...status.warning, contrastText: '#121522' },
    info: { ...status.info, contrastText: '#121522' },
    success: { ...status.success, contrastText: '#121522' },
    text: {
        primary: '#EDF2F7',
        secondary: '#A0AEC0',
        disabled: 'rgba(255, 255, 255, 0.48)',
        tertiary: '#A0AEC0',
    },
    divider: '#2D3748',
    background: {
        default: '#0D101C',
        paper: '#101826',
        hover: '#1E253B',
        active: '#070c15',
        sidebar: '#1a2436',
        input: '#232b42',
    },
    action: {
        active: '#9da4ae',
        hover: 'rgba(255, 255, 255, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(255, 255, 255, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
    },
    neutral: darkNeutral,
    attribute: {
        default: '#E6E5E5',
        gray: '#BEBEBE',
        brown: '#B26045',
        orange: '#F6832B',
        yellow: '#FAB92F',
        green: '#6AE66A',
        blue: '#2CA2EE',
        purple: '#942CE4',
        pink: '#F41B7D',
        red: '#E7391B',
    },
    attributeText: {
        default: '#0B0F19',
        gray: '#0B0F19',
        brown: '#0B0F19',
        orange: '#0B0F19',
        yellow: '#0B0F19',
        green: '#0B0F19',
        blue: '#0B0F19',
        purple: '#0B0F19',
        pink: '#0B0F19',
        red: '#0B0F19',
    },
    option: { primaryActive: '#6EE7B7', primaryHover: '#4ADE80', hover: '#0B2E1F' },
    blur: darkBlurColor,
};

const lightShadows = [
    'none',
    '0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)',
    '0px 1px 2px rgba(100, 116, 139, 0.12)',
    '0px 1px 4px rgba(100, 116, 139, 0.12)',
    '0px 1px 5px rgba(100, 116, 139, 0.12)',
    '0px 1px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 6px rgba(100, 116, 139, 0.12)',
    '0px 3px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)',
    '0px 5px 12px rgba(100, 116, 139, 0.12)',
    '0px 5px 14px rgba(100, 116, 139, 0.12)',
    '0px 5px 15px rgba(100, 116, 139, 0.12)',
    '0px 6px 15px rgba(100, 116, 139, 0.12)',
    '0px 7px 15px rgba(100, 116, 139, 0.12)',
    '0px 8px 15px rgba(100, 116, 139, 0.12)',
    '0px 9px 15px rgba(100, 116, 139, 0.12)',
    '0px 10px 15px rgba(100, 116, 139, 0.12)',
    '0px 12px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 13px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 14px 24px -8px rgba(100, 116, 139, 0.25)',
    '0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
];

const darkShadows = [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 1px 4px rgba(0, 0, 0, 0.24)',
    '0px 1px 5px rgba(0, 0, 0, 0.24)',
    '0px 1px 6px rgba(0, 0, 0, 0.24)',
    '0px 2px 6px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.24)',
    '0px 4px 6px rgba(0, 0, 0, 0.24)',
    '0px 5px 12px rgba(0, 0, 0, 0.24)',
    '0px 5px 14px rgba(0, 0, 0, 0.24)',
    '0px 5px 15px rgba(0, 0, 0, 0.24)',
    '0px 6px 15px rgba(0, 0, 0, 0.24)',
    '0px 7px 15px rgba(0, 0, 0, 0.24)',
    '0px 8px 15px rgba(0, 0, 0, 0.24)',
    '0px 9px 15px rgba(0, 0, 0, 0.24)',
    '0px 10px 15px rgba(0, 0, 0, 0.24)',
    '0px 12px 22px -8px rgba(0, 0, 0, 0.24)',
    '0px 13px 22px -8px rgba(0, 0, 0, 0.24)',
    '0px 14px 24px -8px rgba(0, 0, 0, 0.24)',
    '0px 20px 25px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
    '0px 25px 50px rgba(0, 0, 0, 0.24)',
];

function buildTheme(mode: PaletteMode) {
    return {
        palette: mode === 'dark' ? darkPalette : lightPalette,
        shadows: mode === 'dark' ? darkShadows : lightShadows,
        breakpoints,
        spacing,
        shape,
        zIndex,
        transitions,
        typography,
        alpha,
    };
}

export type AppTheme = ReturnType<typeof buildTheme>;

export const lightTheme: AppTheme = buildTheme('light');
export const darkTheme: AppTheme = buildTheme('dark');

export function getAppTheme(mode: string | null | undefined): AppTheme {
    return String(mode) === 'dark' ? darkTheme : lightTheme;
}

function subscribeToColorScheme(onChange: () => void): () => void {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
}

function readColorScheme(): PaletteMode {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useColorScheme(): PaletteMode {
    return useSyncExternalStore(subscribeToColorScheme, readColorScheme, () => 'light');
}

export function useAppTheme(): AppTheme {
    return getAppTheme(useColorScheme());
}
