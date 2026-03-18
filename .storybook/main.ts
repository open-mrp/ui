// This file has been automatically migrated to valid ESM format by Storybook.
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-onboarding', '@storybook/addon-themes', '@storybook/addon-docs'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    typescript: {
        check: false,
        reactDocgen: false,
    },
    viteFinal: async (config) => {
        config.resolve = config.resolve ?? {};
        const existingAlias = config.resolve.alias ?? [];
        const aliasArray = Array.isArray(existingAlias)
            ? existingAlias
            : Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }));

        // Put @ alias first so it wins over any existing alias rules.
        aliasArray.unshift(
            {
                find: /^@\//,
                replacement: `${resolve(__dirname, '../src')}/`,
            },
            {
                find: '@',
                replacement: resolve(__dirname, '../src'),
            },
        );

        config.resolve.alias = aliasArray;
        return config;
    },
};

export default config;
