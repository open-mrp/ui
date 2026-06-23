#!/usr/bin/env bun
/**
 * Inlines a captured wave-shader still image into src/shaders/wave-shader/waveShaderStill.ts
 * as a base64 data URL, for the given variant.
 *
 * Usage:
 *   bun scripts/inline-still.mjs <path-to-image> <dark|light>
 *
 * Generate the image first via the "Shaders / WaveShader Capture Still" Storybook story.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const target = resolve(here, '../src/shaders/wave-shader/waveShaderStill.ts');

const input = process.argv[2];
const variant = process.argv[3];
if (!input || !variant) {
    console.error('Usage: bun scripts/inline-still.mjs <path-to-image> <dark|light>');
    process.exit(1);
}
if (variant !== 'dark' && variant !== 'light') {
    console.error(`Variant must be "dark" or "light", got "${variant}"`);
    process.exit(1);
}

const ext = extname(input).toLowerCase();
const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : null;
if (!mime) {
    console.error(`Unsupported extension "${ext}" — use .webp or .png`);
    process.exit(1);
}

const bytes = readFileSync(resolve(input));
const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`;

const constName = variant === 'dark' ? 'WAVE_SHADER_STILL_DARK' : 'WAVE_SHADER_STILL_LIGHT';
const source = readFileSync(target, 'utf8');
const pattern = new RegExp(`export const ${constName} = '[^']*';`);
if (!pattern.test(source)) {
    console.error(`Could not find "export const ${constName}" in waveShaderStill.ts`);
    process.exit(1);
}
const updated = source.replace(pattern, `export const ${constName} = '${dataUrl}';`);
writeFileSync(target, updated);

console.log(
    `Inlined ${variant} still — ${(bytes.length / 1024).toFixed(0)} KB (${(dataUrl.length / 1024).toFixed(0)} KB base64) into ${constName}`,
);
