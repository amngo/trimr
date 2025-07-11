export interface Link {
    id: string;
    slug: string;
    url: string;
    clickCount: number;
    createdAt: Date;
    startsAt: Date | null;
    expiresAt: Date | null;
    enabled: boolean;
}
