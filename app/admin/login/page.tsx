'use client'
import { useActionState } from 'react'
import { login } from '@/modules/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && <div className="p-3 rounded-md bg-red-100 text-red-600 text-sm">{state.error}</div>}
            <div className="space-y-2"><Label htmlFor="username">Username</Label><Input id="username" name="username" required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
            <Button type="submit" className="w-full" disabled={pending}>{pending ? 'Logging in...' : 'Login'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
