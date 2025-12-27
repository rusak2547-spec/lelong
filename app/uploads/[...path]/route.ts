import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filename = path.join('/')
  
  // Security: Prevent directory traversal
  if (filename.includes('..')) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  // Look for the file in public/uploads
  const filePath = join(process.cwd(), 'public', 'uploads', filename)

  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 })
  }

  try {
    const fileBuffer = await readFile(filePath)
    
    // Determine mime type manually to avoid external deps
    const ext = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg'
    if (ext === 'png') contentType = 'image/png'
    if (ext === 'webp') contentType = 'image/webp'
    if (ext === 'svg') contentType = 'image/svg+xml'
    if (ext === 'ico') contentType = 'image/x-icon'
    if (ext === 'gif') contentType = 'image/gif'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Error reading file', { status: 500 })
  }
}
