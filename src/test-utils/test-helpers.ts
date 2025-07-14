import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';

// Common test helpers and utilities

export const createUser = () => userEvent.setup();

export const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: Infinity,
            },
            mutations: {
                retry: false,
            },
        },
    });

export const waitForLoadingToFinish = async () => {
    await waitFor(() => {
        expect(document.querySelector('.loading')).not.toBeInTheDocument();
    });
};

export const waitForToast = async (message: string) => {
    await waitFor(() => {
        expect(document.querySelector('[role="alert"]')).toHaveTextContent(
            message,
        );
    });
};

export const mockFetch = (response: unknown, status: number = 200) => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response)),
            headers: new Headers(),
        } as Response),
    );
};

export const mockFetchError = (error: string = 'Network error') => {
    global.fetch = jest.fn(() => Promise.reject(new Error(error)));
};

export const mockFetchOnce = (response: unknown, status: number = 200) => {
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
        headers: new Headers(),
    } as Response);
};

export const mockConsoleError = () => {
    const originalError = console.error;
    const mockError = jest.fn();
    console.error = mockError;

    return {
        mockError,
        restore: () => {
            console.error = originalError;
        },
    };
};

export const mockLocalStorage = () => {
    const store: Record<string, string> = {};

    const mockLocalStorage = {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            Object.keys(store).forEach((key) => delete store[key]);
        }),
    };

    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
    });

    return mockLocalStorage;
};

export const mockClipboard = () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    const mockReadText = jest.fn();

    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: mockWriteText,
            readText: mockReadText,
        },
        writable: true,
    });

    return { mockWriteText, mockReadText };
};

export const mockIntersectionObserver = () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    });

    window.IntersectionObserver = mockIntersectionObserver;
    return mockIntersectionObserver;
};

export const mockResizeObserver = () => {
    const mockResizeObserver = jest.fn();
    mockResizeObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    });

    window.ResizeObserver = mockResizeObserver;
    return mockResizeObserver;
};

export const flushPromises = () =>
    new Promise((resolve) => setTimeout(resolve, 0));

export const advanceTimers = (ms: number) => {
    jest.advanceTimersByTime(ms);
    return flushPromises();
};

export const expectElementToHaveClass = (
    element: Element,
    className: string,
) => {
    expect(element).toHaveClass(className);
};

export const expectElementNotToHaveClass = (
    element: Element,
    className: string,
) => {
    expect(element).not.toHaveClass(className);
};
