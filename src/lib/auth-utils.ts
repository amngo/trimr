import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { logger } from '@/utils/logger';

export async function getCurrentUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        return session?.user || null;
    } catch (error) {
        logger.error('Error getting current user', error);
        return null;
    }
}

export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Authentication required');
    }

    return user;
}
