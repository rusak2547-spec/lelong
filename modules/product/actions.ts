'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getSession } from '../auth/actions'

export async function createProduct(formData: FormData) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string // "GOLD" or "GADGET"
  const price = parseFloat(formData.get('price') as string)
  const weight = parseFloat(formData.get('weight') as string)
  const image = formData.get('image') as File


  if (!image || image.size === 0) {
    throw new Error('Image is required')
  }

  // File Upload Logic
  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  // Standard VPS Path (process.cwd() works fine with PM2)
  const uploadDir = join(process.cwd(), 'public', 'uploads')

  try {
     await mkdir(uploadDir, { recursive: true })
  } catch (error) {
     console.error('Error creating directory:', error)
  }
  
  const fileName = `${Date.now()}-${image.name.replace(/\s/g, '-')}`
  const filePath = join(uploadDir, fileName)
  
  try {
    await writeFile(filePath, buffer)
  } catch (err) {
    console.error('Error writing file:', err)
    throw new Error('Failed to save image file')
  }

  const imageUrl = `/uploads/${fileName}`

  await prisma.product.create({
    data: {
      title,
      description,
      category: category || 'GOLD',
      price,
      weight,
      imageUrl,

      status: 'AVAILABLE'
    }
  })

  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  redirect('/admin/dashboard')
}

export async function toggleProductStatus(id: number, currentStatus: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  const newStatus = currentStatus === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE'
  
  await prisma.product.update({
    where: { id },
    data: { status: newStatus }
  })
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
}

export async function deleteProduct(id: number) {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  await prisma.product.delete({
    where: { id }
  })
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/')
}
