'use client'

import { useActionState } from 'react'
import { login } from '@/modules/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function LoginPage() {

  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Admin Login
          </CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter your credentials to access the dashboard
          </p>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                type="text" 
                placeholder="admin" 
                required 
                className="bg-white dark:bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-white dark:bg-zinc-950"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-500 font-medium">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Logging in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
