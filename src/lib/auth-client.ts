import { BASE_URL } from '@/constants';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
