import { create } from 'zustand';

interface FormState {
    url: string;
    customSlug: string;
    expiration: string;
    startingDate: string;
    password: string;
    result: {
        slug?: string;
        url?: string;
        error?: string;
    } | null;
    setUrl: (url: string) => void;
    setCustomSlug: (slug: string) => void;
    setExpiration: (expiration: string) => void;
    setStartingDate: (date: string) => void;
    setPassword: (password: string) => void;
    setResult: (result: { slug?: string; url?: string; error?: string; } | null) => void;
    resetForm: () => void;
}

export const useFormStore = create<FormState>((set) => ({
    url: '',
    customSlug: '',
    expiration: 'never',
    startingDate: '',
    password: '',
    result: null,
    setUrl: (url: string) => set({ url }),
    setCustomSlug: (customSlug: string) => set({ customSlug }),
    setExpiration: (expiration: string) => set({ expiration }),
    setStartingDate: (startingDate: string) => set({ startingDate }),
    setPassword: (password: string) => set({ password }),
    setResult: (result) => set({ result }),
    resetForm: () => set({
        url: '',
        customSlug: '',
        expiration: 'never',
        startingDate: '',
        password: '',
        result: null,
    }),
}));