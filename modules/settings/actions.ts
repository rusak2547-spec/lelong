'use server'

import db from '@/lib/db'
import { globalSettings } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function getGlobalSettings() {
  const result = await db.select().from(globalSettings).limit(1)
  
  if (result.length === 0) {
    // Return default if not set
    return { telegramUrl: 'https://t.me/' }
  }
  // Ensure telegramUrl is always a string (Drizzle may return null)
  return { 
    ...result[0],
    telegramUrl: result[0].telegramUrl ?? 'https://t.me/' 
  }
}

export async function updateGlobalSettings(formData: FormData) {
  const telegramUrl = formData.get('telegramUrl') as string

  // Upsert (Create if first time, Update if exists)
  const existing = await db.select().from(globalSettings).limit(1)

  if (existing.length > 0) {
    await db.update(globalSettings)
      .set({ telegramUrl })
      .where(eq(globalSettings.id, existing[0].id))
  } else {
    await db.insert(globalSettings).values({ telegramUrl })
  }

  revalidatePath('/')
  revalidatePath('/product/[id]', 'page')
  revalidatePath('/admin/settings')
  return { success: true }
}
