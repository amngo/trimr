export interface Link {
    id: string;
    slug: string;
    url: string;
    clickCount: number;
    visitorCount: number;
    createdAt: Date;
    startsAt: Date | null;
    expiresAt: Date | null;
    enabled: boolean;
    userId: string | null;
    password: string | null;
}

export type LinkStatus = 'active' | 'inactive' | 'expired' | 'disabled';
