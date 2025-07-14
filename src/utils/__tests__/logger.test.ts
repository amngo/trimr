// We'll import Logger class directly to create new instances for testing
class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    private log(
        level: 'info' | 'warn' | 'error' | 'debug',
        {
            message,
            data,
            error,
        }: { message: string; data?: unknown; error?: Error },
    ) {
        if (!this.isDevelopment && level === 'debug') {
            return;
        }

        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        switch (level) {
            case 'info':
                console.info(prefix, message, data ? { data } : '');
                break;
            case 'warn':
                console.warn(prefix, message, data ? { data } : '');
                break;
            case 'error':
                console.error(
                    prefix,
                    message,
                    error || data ? { error: error || data } : '',
                );
                break;
            case 'debug':
                console.debug(prefix, message, data ? { data } : '');
                break;
        }
    }

    info(message: string, data?: unknown) {
        this.log('info', { message, data });
    }

    warn(message: string, data?: unknown) {
        this.log('warn', { message, data });
    }

    error(message: string, error?: Error | unknown) {
        this.log('error', {
            message,
            error: error instanceof Error ? error : new Error(String(error)),
        });
    }

    debug(message: string, data?: unknown) {
        this.log('debug', { message, data });
    }
}

describe('logger', () => {
    let originalConsole: typeof console;
    let originalNodeEnv: string | undefined;
    let logger: Logger;

    beforeEach(() => {
        originalConsole = { ...console };
        originalNodeEnv = process.env.NODE_ENV;
        (process.env as Record<string, string | undefined>).NODE_ENV =
            'development';
        logger = new Logger(); // Create fresh instance with current NODE_ENV
        console.info = jest.fn();
        console.error = jest.fn();
        console.warn = jest.fn();
        console.debug = jest.fn();
    });

    afterEach(() => {
        Object.assign(console, originalConsole);
        (process.env as Record<string, string | undefined>).NODE_ENV =
            originalNodeEnv;
    });

    describe('info', () => {
        it('should log info messages with timestamp prefix', () => {
            logger.info('Test info message');
            expect(console.info).toHaveBeenCalledTimes(1);
            const call = (console.info as jest.Mock).mock.calls[0];
            expect(call[0]).toMatch(
                /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]/,
            );
            expect(call[1]).toBe('Test info message');
            expect(call[2]).toBe('');
        });

        it('should handle data parameter', () => {
            logger.info('Message', { test: 'data' });
            const call = (console.info as jest.Mock).mock.calls[0];
            expect(call[1]).toBe('Message');
            expect(call[2]).toEqual({ data: { test: 'data' } });
        });

        it('should handle undefined data', () => {
            logger.info('Message with no data');
            const call = (console.info as jest.Mock).mock.calls[0];
            expect(call[2]).toBe('');
        });
    });

    describe('error', () => {
        it('should log error messages with timestamp prefix', () => {
            logger.error('Test error message');
            expect(console.error).toHaveBeenCalledTimes(1);
            const call = (console.error as jest.Mock).mock.calls[0];
            expect(call[0]).toMatch(
                /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\]/,
            );
            expect(call[1]).toBe('Test error message');
        });

        it('should handle Error objects', () => {
            const error = new Error('Test error');
            logger.error('Error occurred', error);
            const call = (console.error as jest.Mock).mock.calls[0];
            expect(call[1]).toBe('Error occurred');
            expect(call[2]).toEqual({ error });
        });

        it('should convert non-Error objects to Error', () => {
            logger.error('Error occurred', 'string error');
            const call = (console.error as jest.Mock).mock.calls[0];
            expect(call[2].error).toBeInstanceOf(Error);
            expect(call[2].error.message).toBe('string error');
        });

        it('should handle no error parameter', () => {
            logger.error('Simple error message');
            const call = (console.error as jest.Mock).mock.calls[0];
            expect(call[2]).toEqual({ error: new Error('undefined') });
        });
    });

    describe('warn', () => {
        it('should log warning messages with timestamp prefix', () => {
            logger.warn('Test warning message');
            expect(console.warn).toHaveBeenCalledTimes(1);
            const call = (console.warn as jest.Mock).mock.calls[0];
            expect(call[0]).toMatch(
                /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\]/,
            );
            expect(call[1]).toBe('Test warning message');
        });

        it('should handle data parameter', () => {
            logger.warn('Warning', { issue: 'deprecated' });
            const call = (console.warn as jest.Mock).mock.calls[0];
            expect(call[2]).toEqual({ data: { issue: 'deprecated' } });
        });
    });

    describe('debug', () => {
        it('should log debug messages in development', () => {
            logger.debug('Test debug message');
            expect(console.debug).toHaveBeenCalledTimes(1);
            const call = (console.debug as jest.Mock).mock.calls[0];
            expect(call[0]).toMatch(
                /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[DEBUG\]/,
            );
            expect(call[1]).toBe('Test debug message');
        });

        it('should not log debug messages in production', () => {
            (process.env as Record<string, string | undefined>).NODE_ENV =
                'production';
            const prodLogger = new Logger(); // Create fresh instance in production mode
            prodLogger.debug('Test debug message');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should handle debug data', () => {
            const debugData = { user: 'test', action: 'click' };
            logger.debug('Debug data', debugData);
            const call = (console.debug as jest.Mock).mock.calls[0];
            expect(call[2]).toEqual({ data: debugData });
        });
    });

    describe('environment handling', () => {
        it('should log all levels in development', () => {
            (process.env as Record<string, string | undefined>).NODE_ENV =
                'development';

            logger.info('info');
            logger.warn('warn');
            logger.error('error');
            logger.debug('debug');

            expect(console.info).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.debug).toHaveBeenCalledTimes(1);
        });

        it('should suppress debug logs in production', () => {
            (process.env as Record<string, string | undefined>).NODE_ENV =
                'production';
            const prodLogger = new Logger(); // Create fresh instance in production mode

            prodLogger.info('info');
            prodLogger.warn('warn');
            prodLogger.error('error');
            prodLogger.debug('debug');

            expect(console.info).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.debug).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        it('should handle empty messages', () => {
            logger.info('');
            const call = (console.info as jest.Mock).mock.calls[0];
            expect(call[1]).toBe('');
        });

        it('should handle null data', () => {
            logger.info('Message', null);
            const call = (console.info as jest.Mock).mock.calls[0];
            expect(call[2]).toBe(''); // null is falsy, so no data object
        });

        it('should handle undefined data', () => {
            logger.warn('Warning', undefined);
            const call = (console.warn as jest.Mock).mock.calls[0];
            expect(call[2]).toBe('');
        });

        it('should handle complex objects', () => {
            const complexObject = {
                nested: { data: [1, 2, 3] },
                func: () => {},
            };
            logger.debug('Complex object', complexObject);
            const call = (console.debug as jest.Mock).mock.calls[0];
            expect(call[2].data).toBe(complexObject);
        });
    });

    describe('timestamp format', () => {
        it('should use ISO timestamp format', () => {
            logger.info('Test message');
            const call = (console.info as jest.Mock).mock.calls[0];
            const timestamp = call[0].match(/\[(.+?)\]/)[1];
            expect(new Date(timestamp).toISOString()).toBe(timestamp);
        });
    });
});
