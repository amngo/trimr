import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    
    addToast: (message: string, type: ToastType, duration = 4000) => {
        const id = Math.random().toString(36).substring(2);
        const toast: Toast = { id, message, type, duration };
        
        set((state) => ({
            toasts: [...state.toasts, toast]
        }));
        
        // Auto remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, duration);
        }
        
        return id;
    },
    
    removeToast: (id: string) => {
        set((state) => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }));
    },
    
    clearAllToasts: () => {
        set({ toasts: [] });
    },
}));

// Helper functions for different toast types
export const toast = {
    success: (message: string, duration?: number) => 
        useToastStore.getState().addToast(message, 'success', duration),
    error: (message: string, duration?: number) => 
        useToastStore.getState().addToast(message, 'error', duration),
    warning: (message: string, duration?: number) => 
        useToastStore.getState().addToast(message, 'warning', duration),
    info: (message: string, duration?: number) => 
        useToastStore.getState().addToast(message, 'info', duration),
};