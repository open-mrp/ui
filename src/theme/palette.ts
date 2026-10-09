const paletteRoots = new Set([
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'text',
    'action',
    'background',
    'neutral',
    'divider',
    'attribute',
    'option',
]);

const segmentAliases: Record<string, string> = {
    background: 'bg',
    contrastText: 'contrast',
    contrastTextLight: 'contrast-light',
    disabledBackground: 'disabled-bg',
    primaryActive: 'primary-active',
    primaryHover: 'primary-hover',
};

const commonColors: Record<string, string> = {
    'common.white': '#fff',
    'common.black': '#000',
};

export function paletteColor(path: string): string;
export function paletteColor(path: string | undefined): string | undefined;
export function paletteColor(path: string | undefined): string | undefined {
    if (!path) return path;
    const common = commonColors[path];
    if (common) return common;
    const parts = path.split('.');
    const [root = ''] = parts;
    if (root === 'grey' && parts.length === 2) return `var(--color-grey-${parts[1]})`;
    if (!paletteRoots.has(root) || parts.length > 2) return path;
    if (parts.length === 1 && root !== 'divider') return path;
    return `var(--palette-${parts.map(part => segmentAliases[part] ?? part).join('-')})`;
}
