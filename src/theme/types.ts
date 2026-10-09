export type PaletteColorName = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export type Size = 'small' | 'medium' | 'large';

export const paletteColorNames: PaletteColorName[] = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
];

export type BivariantCallback<Args extends unknown[]> = {
    bivarianceHack(...args: Args): void;
}['bivarianceHack'];
