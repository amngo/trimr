import { createMockLinks } from '@/test-utils/test-factories';
import ExampleDashboardClient from './ExampleDashboardClient';

export default function ExampleDashboardPage() {
    // Create mock links with variety of data
    const mockLinks = createMockLinks(15, {}).map((link, index) => ({
        ...link,
        id: `example-link-${index}`,
        name: `Example Link ${index + 1}`,
        slug: `example-${index + 1}`,
        url: `https://example${index + 1}.com`,
        clickCount: Math.floor(Math.random() * 1000),
        visitorCount: Math.floor(Math.random() * 500),
        enabled: Math.random() > 0.2, // 80% enabled
        createdAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ), // Random date within last 30 days
        expiresAt:
            index % 5 === 0 ? new Date(Date.now() - 24 * 60 * 60 * 1000) : null, // 20% expired
        startsAt:
            index % 7 === 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // ~14% pending
        password: index % 3 === 0 ? 'password123' : null, // 33% password protected
    }));

    return <ExampleDashboardClient initialLinks={mockLinks} />;
}
