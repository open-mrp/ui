import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { ColorConfiguration, colorConfigurations } from '../colorConfigurations';
import { captureWaveShaderStill } from './captureWaveShaderStill';

const colorSchemeOptions = Object.keys(colorConfigurations) as ColorConfiguration[];

// Must match public-docs HomePageContent.tsx so the captured stills blend with the page.
const VARIANT_BACKGROUNDS = {
    dark: [15, 14, 24] as [number, number, number],
    light: [255, 255, 255] as [number, number, number],
};

type Variant = keyof typeof VARIANT_BACKGROUNDS;

/**
 * Tool for generating the bundled fallback stills. Open this on a browser where WebGL
 * works, use the in-page Dark/Light toggle, Capture, then Download each — and inline
 * them via `scripts/inline-still.mjs`.
 */
function CaptureStill({
    width,
    height,
    colorConfiguration,
    seed,
    numWaves,
}: {
    width: number;
    height: number;
    colorConfiguration: ColorConfiguration;
    seed: number;
    numWaves: number;
}) {
    const [variant, setVariant] = useState<Variant>('dark');
    const [dataUrl, setDataUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const backgroundColor = VARIANT_BACKGROUNDS[variant];

    // Switching variant invalidates a previous capture so you can't download a
    // dark image under the "light" filename by accident.
    const selectVariant = (next: Variant) => {
        setVariant(next);
        setDataUrl('');
        setError('');
    };

    const capture = () => {
        setError('');
        try {
            const url = captureWaveShaderStill({
                width,
                height,
                colorConfiguration,
                seed,
                numWaves,
                backgroundColor,
            });
            if (!url) {
                setError('Capture returned empty — is WebGL available in this browser?');
                return;
            }
            setDataUrl(url);
        } catch (e) {
            setError(String(e));
        }
    };

    const download = () => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `wave-shader-still-${variant}.webp`;
        a.click();
    };

    const toggleBtn = (value: Variant, label: string) => (
        <button
            onClick={() => selectVariant(value)}
            style={{
                padding: '6px 16px',
                border: '1px solid #888',
                background: variant === value ? '#2563eb' : 'transparent',
                color: variant === value ? '#fff' : 'inherit',
                cursor: 'pointer',
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col gap-3 p-4">
            {/* Big, obvious Dark/Light toggle — no Storybook Controls panel needed. */}
            <div
                className="flex"
                style={{ borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}
            >
                {toggleBtn('dark', '🌙 Dark')}
                {toggleBtn('light', '☀️ Light')}
            </div>
            <div className="text-xs text-gray-500 font-mono">
                capturing {variant} — background rgb({backgroundColor.join(', ')})
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded bg-blue-600 text-white" onClick={capture}>
                    Capture {variant}
                </button>
                <button
                    className="px-3 py-1.5 rounded bg-green-600 text-white disabled:opacity-40"
                    onClick={download}
                    disabled={!dataUrl}
                >
                    Download wave-shader-still-{variant}.webp
                </button>
            </div>
            {error && <div className="text-red-600 text-sm font-mono">{error}</div>}
            {dataUrl && (
                <>
                    <div className="text-xs text-gray-500 font-mono">
                        {Math.round(dataUrl.length / 1024)} KB (base64)
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={dataUrl}
                        alt={`Captured ${variant} wave shader still`}
                        style={{
                            maxWidth: '100%',
                            border: '1px solid #ccc',
                            background: `rgb(${backgroundColor.join(',')})`,
                        }}
                    />
                </>
            )}
        </div>
    );
}

const meta = {
    component: CaptureStill,
    title: 'Shaders/WaveShader Capture Still',
    argTypes: {
        colorConfiguration: { control: 'select', options: colorSchemeOptions },
        width: { control: { type: 'number' } },
        height: { control: { type: 'number' } },
        seed: { control: { type: 'number' } },
        numWaves: { control: { type: 'range', min: 1, max: 16, step: 1 } },
    },
    args: {
        // 16:9 hi-res so object-fit: cover crops minimally across screen sizes.
        width: 2560,
        height: 1440,
        colorConfiguration: 'default',
        seed: 16192,
        numWaves: 8,
    },
} satisfies Meta<typeof CaptureStill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
