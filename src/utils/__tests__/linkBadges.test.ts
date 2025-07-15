import { getLinkBadges, getBadgeClasses } from '../linkBadges';
import { createMockLink } from '@/test-utils/test-factories';

describe('linkBadges', () => {
    describe('getLinkBadges', () => {
        it('should return empty array for basic link', () => {
            const link = createMockLink({ enabled: true });
            expect(getLinkBadges(link)).toEqual([]);
        });

        it('should return password badge for protected links', () => {
            const link = createMockLink({ password: 'secret123' });
            const badges = getLinkBadges(link);

            expect(badges).toHaveLength(1);
            expect(badges[0]).toEqual({
                type: 'password',
                text: 'Protected',
                variant: 'primary',
            });
        });

        it('should return expired badge for expired links', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const link = createMockLink({ expiresAt: yesterday });
            const badges = getLinkBadges(link);

            expect(badges).toHaveLength(1);
            expect(badges[0]).toEqual({
                type: 'expired',
                text: 'Expired',
                variant: 'neutral',
            });
        });

        it('should return starts-in badge for future start dates', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const link = createMockLink({ startsAt: tomorrow });
            const badges = getLinkBadges(link);

            expect(badges).toHaveLength(1);
            expect(badges[0]).toEqual({
                type: 'starts-in',
                text: 'Starts in 1 day',
                variant: 'info',
            });
        });

        it('should return expires-in badge for links expiring within 30 days', () => {
            const inThreeDays = new Date();
            inThreeDays.setDate(inThreeDays.getDate() + 3);

            const link = createMockLink({ expiresAt: inThreeDays });
            const badges = getLinkBadges(link);

            expect(badges).toHaveLength(1);
            expect(badges[0]).toEqual({
                type: 'expires-in',
                text: 'Expires in 3 days',
                variant: 'warning',
            });
        });

        it('should not return expires-in badge for links expiring after 30 days', () => {
            const inTwoMonths = new Date();
            inTwoMonths.setDate(inTwoMonths.getDate() + 60);

            const link = createMockLink({ expiresAt: inTwoMonths });
            const badges = getLinkBadges(link);

            expect(badges).toEqual([]);
        });

        it('should return warning variant for links expiring within 7 days', () => {
            const inFiveDays = new Date();
            inFiveDays.setDate(inFiveDays.getDate() + 5);

            const link = createMockLink({ expiresAt: inFiveDays });
            const badges = getLinkBadges(link);

            expect(badges[0].variant).toBe('warning');
        });

        it('should return info variant for links expiring within 30 days but after 7 days', () => {
            const inTenDays = new Date();
            inTenDays.setDate(inTenDays.getDate() + 10);

            const link = createMockLink({ expiresAt: inTenDays });
            const badges = getLinkBadges(link);

            expect(badges[0].variant).toBe('info');
        });

        it('should return multiple badges for links with multiple conditions', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const inFiveDays = new Date();
            inFiveDays.setDate(inFiveDays.getDate() + 5);

            const link = createMockLink({
                password: 'secret',
                startsAt: tomorrow,
                expiresAt: inFiveDays,
            });
            const badges = getLinkBadges(link);

            expect(badges).toHaveLength(3); // password, starts-in, and expires-in badges
            expect(badges.find((b) => b.type === 'password')).toBeDefined();
            expect(badges.find((b) => b.type === 'starts-in')).toBeDefined();
            expect(badges.find((b) => b.type === 'expires-in')).toBeDefined();
        });

        it('should handle time formatting correctly for hours', () => {
            const inTwoHours = new Date();
            inTwoHours.setTime(inTwoHours.getTime() + 2 * 60 * 60 * 1000); // Add exactly 2 hours in milliseconds

            const link = createMockLink({ expiresAt: inTwoHours });
            const badges = getLinkBadges(link);

            expect(badges[0].text).toBe('Expires in 2 hours');
        });

        it('should handle time formatting correctly for minutes', () => {
            const inThirtyMinutes = new Date();
            inThirtyMinutes.setMinutes(inThirtyMinutes.getMinutes() + 30);

            const link = createMockLink({ startsAt: inThirtyMinutes });
            const badges = getLinkBadges(link);

            expect(badges[0].text).toBe('Starts in 30 minutes');
        });

        it('should handle singular time units correctly', () => {
            const inOneDay = new Date();
            inOneDay.setDate(inOneDay.getDate() + 1);
            const inOneHour = new Date();
            inOneHour.setHours(inOneHour.getHours() + 1);

            const dayLink = createMockLink({ expiresAt: inOneDay });
            const hourLink = createMockLink({ startsAt: inOneHour });

            expect(getLinkBadges(dayLink)[0].text).toBe('Expires in 1 day');
            expect(getLinkBadges(hourLink)[0].text).toBe('Starts in 1 hour');
        });

        it('should not show starts-in badge for past start dates', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const link = createMockLink({ startsAt: yesterday });
            const badges = getLinkBadges(link);

            expect(badges.find((b) => b.type === 'starts-in')).toBeUndefined();
        });
    });

    describe('getBadgeClasses', () => {
        it('should return correct class for primary variant', () => {
            expect(getBadgeClasses('primary')).toBe('badge-primary');
        });

        it('should return correct class for warning variant', () => {
            expect(getBadgeClasses('warning')).toBe('badge-warning');
        });

        it('should return correct class for error variant', () => {
            expect(getBadgeClasses('error')).toBe('badge-error');
        });

        it('should return correct class for info variant', () => {
            expect(getBadgeClasses('info')).toBe('badge-info');
        });

        it('should return correct class for success variant', () => {
            expect(getBadgeClasses('success')).toBe('badge-success');
        });

        it('should return correct class for neutral variant', () => {
            expect(getBadgeClasses('neutral')).toBe('badge-neutral');
        });

        it('should return neutral class for unknown variant', () => {
            expect(
                getBadgeClasses(
                    'unknown' as
                        | 'primary'
                        | 'warning'
                        | 'error'
                        | 'info'
                        | 'success'
                        | 'neutral',
                ),
            ).toBe('badge-neutral');
        });
    });
});
