import '@testing-library/jest-dom';

// Mock clipboard API - only in jsdom environment
if (typeof navigator !== 'undefined') {
    Object.assign(navigator, {
        clipboard: {
            writeText: jest.fn(),
        },
    });
}

// Mock window.URL.createObjectURL while preserving the URL constructor - only in jsdom environment
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'URL', {
        value: Object.assign(URL, {
            createObjectURL: jest.fn(() => 'mock-url'),
            revokeObjectURL: jest.fn(),
        }),
    });
}

// Polyfill for Fetch API in Node.js - avoid conflicts with global types
const setupGlobals = () => {
    if (typeof global.Request === 'undefined') {
        (global as unknown as { Request?: unknown }).Request =
            class MockRequest {
                _url: string;
                method: string;
                headers: Map<string, string>;
                body: unknown;

                constructor(input: string, init: RequestInit = {}) {
                    this._url = input;
                    this.method = init?.method || 'GET';
                    this.headers = new Map(Object.entries(init?.headers || {}));
                    this.body = init?.body;
                }

                get url() {
                    return this._url;
                }

                async json() {
                    return JSON.parse(this.body as string);
                }

                async formData() {
                    return this.body;
                }
            };
    }

    if (typeof global.Response === 'undefined') {
        (global as Record<string, unknown>).Response = class MockResponse {
            body: unknown;
            status: number;
            statusText: string;
            headers: Map<string, string>;

            constructor(body: unknown, init: Record<string, unknown> = {}) {
                this.body = body;
                this.status = (init?.status as number) || 200;
                this.statusText = (init?.statusText as string) || 'OK';
                this.headers = new Map(
                    Object.entries(
                        (init?.headers as Record<string, string>) || {},
                    ),
                );
            }

            async json() {
                if (typeof this.body === 'string') {
                    return JSON.parse(this.body);
                }
                return this.body;
            }

            static json(data: unknown, init: Record<string, unknown> = {}) {
                return new MockResponse(JSON.stringify(data), {
                    ...init,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(init.headers as Record<string, string>),
                    },
                });
            }
        };
    }

    if (typeof global.Headers === 'undefined') {
        (global as Record<string, unknown>).Headers =
            class MockHeaders extends Map<string, string> {
                constructor(init: Record<string, string> = {}) {
                    super();
                    if (init) {
                        Object.entries(init).forEach(([key, value]) => {
                            this.set(key, value as string);
                        });
                    }
                }

                get(name: string) {
                    return super.get(name.toLowerCase());
                }

                set(name: string, value: string) {
                    return super.set(name.toLowerCase(), value);
                }

                has(name: string) {
                    return super.has(name.toLowerCase());
                }
            };
    }
};

setupGlobals();
