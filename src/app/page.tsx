import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-utils'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (user) {
    // Redirect authenticated users to dashboard
    redirect('/dashboard')
  } else {
    // Redirect unauthenticated users to landing page
    redirect('/landing')
  }
}
