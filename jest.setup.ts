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

// Polyfill for Fetch API in Node.js - avoid conflicts with global types
const setupGlobals = () => {
    if (typeof global.Request === 'undefined') {
        (global as any).Request = class MockRequest {
            _url: string;
            method: string;
            headers: any;
            body: any;

            constructor(input: string, init: any = {}) {
                this._url = input;
                this.method = init?.method || 'GET';
                this.headers = new Map(Object.entries(init?.headers || {}));
                this.body = init?.body;
            }
            
            get url() {
                return this._url;
            }
            
            async json() {
                return JSON.parse(this.body);
            }
            
            async formData() {
                return this.body;
            }
        };
    }

    if (typeof global.Response === 'undefined') {
        (global as any).Response = class MockResponse {
            body: any;
            status: number;
            statusText: string;
            headers: any;

            constructor(body: any, init: any = {}) {
                this.body = body;
                this.status = init?.status || 200;
                this.statusText = init?.statusText || 'OK';
                this.headers = new Map(Object.entries(init?.headers || {}));
            }
            
            async json() {
                if (typeof this.body === 'string') {
                    return JSON.parse(this.body);
                }
                return this.body;
            }
            
            static json(data: any, init: any = {}) {
                return new MockResponse(JSON.stringify(data), {
                    ...init,
                    headers: {
                        'Content-Type': 'application/json',
                        ...init.headers,
                    },
                });
            }
        };
    }

    if (typeof global.Headers === 'undefined') {
        (global as any).Headers = class MockHeaders extends Map {
            constructor(init: any = {}) {
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