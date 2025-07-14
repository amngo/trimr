import { renderHook, act } from '@testing-library/react';
import { useToastStore, toast } from '../useToastStore';

// Mock timers for testing auto-removal
jest.useFakeTimers();

describe('useToastStore', () => {
    beforeEach(() => {
        // Clear store before each test
        act(() => {
            useToastStore.getState().clearAllToasts();
        });
        jest.clearAllTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('initial state', () => {
        it('should have empty toasts array initially', () => {
            const { result } = renderHook(() => useToastStore());
            expect(result.current.toasts).toEqual([]);
        });
    });

    describe('addToast', () => {
        it('should add a toast with info type', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('Test message', 'info');
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0]).toMatchObject({
                message: 'Test message',
                type: 'info',
            });
            expect(result.current.toasts[0].id).toBeDefined();
        });

        it('should add a toast with specified type', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('Error message', 'error');
            });

            expect(result.current.toasts[0]).toMatchObject({
                message: 'Error message',
                type: 'error',
            });
        });

        it('should add multiple toasts', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('First message', 'info');
                result.current.addToast('Second message', 'success');
                result.current.addToast('Third message', 'warning');
            });

            expect(result.current.toasts).toHaveLength(3);
            expect(result.current.toasts[0].message).toBe('First message');
            expect(result.current.toasts[1].message).toBe('Second message');
            expect(result.current.toasts[2].message).toBe('Third message');
        });

        it('should generate unique IDs for each toast', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('First', 'info');
                result.current.addToast('Second', 'info');
            });

            const ids = result.current.toasts.map((toast) => toast.id);
            expect(new Set(ids).size).toBe(2); // All IDs should be unique
        });
    });

    describe('removeToast', () => {
        it('should remove toast by ID', () => {
            const { result } = renderHook(() => useToastStore());

            let toastId: string;
            act(() => {
                toastId = result.current.addToast('Test message', 'info');
            });

            act(() => {
                result.current.removeToast(toastId);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should only remove the specified toast', () => {
            const { result } = renderHook(() => useToastStore());

            let firstId: string, secondId: string;
            act(() => {
                firstId = result.current.addToast('First message', 'info');
                secondId = result.current.addToast('Second message', 'info');
            });

            act(() => {
                result.current.removeToast(firstId);
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0].id).toBe(secondId!);
        });

        it('should handle removing non-existent toast gracefully', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('Test message', 'info');
            });

            const initialLength = result.current.toasts.length;

            act(() => {
                result.current.removeToast('non-existent-id');
            });

            expect(result.current.toasts).toHaveLength(initialLength);
        });
    });

    describe('clearAll', () => {
        it('should remove all toasts', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('First', 'info');
                result.current.addToast('Second', 'info');
                result.current.addToast('Third', 'info');
            });

            expect(result.current.toasts).toHaveLength(3);

            act(() => {
                result.current.clearAllToasts();
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should work when there are no toasts', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.clearAllToasts();
            });

            expect(result.current.toasts).toHaveLength(0);
        });
    });

    describe('auto-removal', () => {
        it('should auto-remove toast after 4 seconds by default', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('Auto-remove test', 'info');
            });

            expect(result.current.toasts).toHaveLength(1);

            // Fast-forward time by 4 seconds
            act(() => {
                jest.advanceTimersByTime(4000);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should auto-remove multiple toasts independently', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('First', 'info');
            });

            // Add second toast 1 second later
            act(() => {
                jest.advanceTimersByTime(1000);
                result.current.addToast('Second', 'info');
            });

            expect(result.current.toasts).toHaveLength(2);

            // After 4 seconds total, first should be removed
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            expect(result.current.toasts).toHaveLength(1);
            expect(result.current.toasts[0].message).toBe('Second');

            // After 1 more second, second should be removed
            act(() => {
                jest.advanceTimersByTime(1000);
            });

            expect(result.current.toasts).toHaveLength(0);
        });

        it('should not auto-remove manually removed toasts', () => {
            const { result } = renderHook(() => useToastStore());

            let toastId: string;
            act(() => {
                toastId = result.current.addToast('Manual remove test', 'info');
            });

            // Manually remove before auto-removal
            act(() => {
                jest.advanceTimersByTime(2000);
                result.current.removeToast(toastId);
            });

            expect(result.current.toasts).toHaveLength(0);

            // Auto-removal timer should not affect anything
            act(() => {
                jest.advanceTimersByTime(4000);
            });

            expect(result.current.toasts).toHaveLength(0);
        });
    });

    describe('toast helper function', () => {
        it('should create info toast', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                toast.info('Info message');
            });

            expect(result.current.toasts[0]).toMatchObject({
                message: 'Info message',
                type: 'info',
            });
        });

        it('should create success toast', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                toast.success('Success message');
            });

            expect(result.current.toasts[0]).toMatchObject({
                message: 'Success message',
                type: 'success',
            });
        });

        it('should create error toast', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                toast.error('Error message');
            });

            expect(result.current.toasts[0]).toMatchObject({
                message: 'Error message',
                type: 'error',
            });
        });

        it('should create warning toast', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                toast.warning('Warning message');
            });

            expect(result.current.toasts[0]).toMatchObject({
                message: 'Warning message',
                type: 'warning',
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty message', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                result.current.addToast('', 'info');
            });

            expect(result.current.toasts[0].message).toBe('');
        });

        it('should handle very long messages', () => {
            const { result } = renderHook(() => useToastStore());
            const longMessage = 'a'.repeat(1000);

            act(() => {
                result.current.addToast(longMessage, 'info');
            });

            expect(result.current.toasts[0].message).toBe(longMessage);
        });

        it('should handle rapid additions', () => {
            const { result } = renderHook(() => useToastStore());

            act(() => {
                for (let i = 0; i < 100; i++) {
                    result.current.addToast(`Message ${i}`, 'info');
                }
            });

            expect(result.current.toasts).toHaveLength(100);
        });
    });
});
