'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGlobalSettings() {
  const settings = await prisma.globalSettings.findFirst()
  if (!settings) {
    // Return default if not set
    return { telegramUrl: 'https://t.me/' }
  }
  return settings
}

export async function updateGlobalSettings(formData: FormData) {
  const telegramUrl = formData.get('telegramUrl') as string

  // Upsert (Create if first time, Update if exists)
  // Since we don't know the ID, we findFirst and update, or create.
  const existing = await prisma.globalSettings.findFirst()

  if (existing) {
    await prisma.globalSettings.update({
      where: { id: existing.id },
      data: { telegramUrl }
    })
  } else {
    await prisma.globalSettings.create({
      data: { telegramUrl }
    })
  }

  revalidatePath('/')
  revalidatePath('/product/[id]', 'page')
  revalidatePath('/admin/settings')
  return { success: true }
}
