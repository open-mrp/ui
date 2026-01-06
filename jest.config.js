export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    moduleNameMapper: {
        '.(css|less|scss)$': 'identity-obj-proxy',
        '\\.glsl$': 'jest-transform-stub',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
