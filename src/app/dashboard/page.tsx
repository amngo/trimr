import { db } from '@/lib/db'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const links = await db.link.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit for performance
  })

  return <DashboardClient initialLinks={links} />
}