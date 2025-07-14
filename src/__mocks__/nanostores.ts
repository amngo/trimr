// Mock nanostores
export const atom = jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    subscribe: jest.fn(),
}));

export const map = jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    subscribe: jest.fn(),
}));
