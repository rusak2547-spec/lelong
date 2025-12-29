'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { admins } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // Simple hardcoded check for MVP or check DB
  // For now, let's use the DB check since we have an Admin model
  // Note: In a real app, use bcrypt. Here we compare plain text as per "Simple login" requirement for MVP, 
  // or I can add a simple hash check if I install bcrypt. 
  // Given the "Simple" requirement, I'll match text directly or check a hardcoded fallback if DB is empty.
  
  let admin = null
  try {
    const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1)
    admin = result[0] || null
  } catch (error) {
    console.error('Database connection failed:', error)
    // Fallback to hardcoded creds if DB fails
  }

  // Fallback for initial login if no admin exists or DB failed
  if ((!admin) && username === 'admin' && password === 'admin123') {
     // Allow default admin
     console.log('Using default admin credentials')
  } else if (!admin || admin.password !== password) {
    return { error: 'Invalid credentials' }
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  
  redirect('/admin/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'true'
}
