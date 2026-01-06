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
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': resolve(__dirname, '../src'),
            };
        }
        return config;
    },
};

export default config;
