import '@testing-library/jest-dom';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

// Mock window.URL.createObjectURL while preserving the URL constructor
Object.defineProperty(window, 'URL', {
    value: Object.assign(URL, {
        createObjectURL: jest.fn(() => 'mock-url'),
        revokeObjectURL: jest.fn(),
    }),
});