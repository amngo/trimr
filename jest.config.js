/* eslint-disable */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transformIgnorePatterns: [
        'node_modules/(?!(nanostores|better-auth|jose)/)',
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/test-utils/**',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/lib/auth-client$': '<rootDir>/src/__mocks__/auth-client.ts',
        '^better-auth/client/react$': '<rootDir>/src/__mocks__/better-auth.ts',
        '^better-auth$': '<rootDir>/src/__mocks__/better-auth.ts',
        '^nanostores$': '<rootDir>/src/__mocks__/nanostores.ts',
    },
};

module.exports = createJestConfig(customJestConfig);
