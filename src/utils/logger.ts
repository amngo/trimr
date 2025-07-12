type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
    message: string;
    data?: unknown;
    error?: Error;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    private log(level: LogLevel, { message, data, error }: LogData) {
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
                console.error(prefix, message, error || data ? { error: error || data } : '');
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
        this.log('error', { message, error: error instanceof Error ? error : new Error(String(error)) });
    }

    debug(message: string, data?: unknown) {
        this.log('debug', { message, data });
    }
}

export const logger = new Logger();