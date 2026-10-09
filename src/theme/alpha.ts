function clamp(value: number, min = 0, max = 1): number {
    return Math.min(Math.max(min, value), max);
}

function hexToRgb(hex: string): string {
    const body = hex.slice(1);
    const size = body.length >= 6 ? 2 : 1;
    const parts = body.match(new RegExp(`.{${size}}`, 'g')) ?? [];
    const values = parts.map(part => parseInt(size === 1 ? part + part : part, 16));
    if (values.length === 4) {
        const [r, g, b, a] = values as [number, number, number, number];
        return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`;
    }
    return `rgb(${values.join(', ')})`;
}

export function alpha(color: string, value: number): string {
    const opacity = clamp(value);
    if (color.startsWith('var(') || color.startsWith('color-mix(')) {
        return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;
    }
    const normalized = color.startsWith('#') ? hexToRgb(color) : color;
    const match = normalized.match(/^(rgba?|hsla?)\((.*)\)$/);
    if (!match) return color;
    const [, type = 'rgb', body = ''] = match;
    const values = body
        .split(/[\s,/]+/)
        .filter(Boolean)
        .slice(0, 3);
    const base = type.startsWith('hsl') ? 'hsla' : 'rgba';
    return `${base}(${values.join(', ')}, ${opacity})`;
}
