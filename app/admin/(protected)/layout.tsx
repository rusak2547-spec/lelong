import { getSession } from '@/modules/auth/actions'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900"><div className="container mx-auto px-4 py-8">{children}</div></div>
}
