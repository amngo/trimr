import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-utils';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const user = await getCurrentUser();

    //   if (!user) {
    //     redirect('/auth')
    //   }

    const links = await db.link.findMany({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit for performance
    });

    return <DashboardClient initialLinks={links} />;
}
