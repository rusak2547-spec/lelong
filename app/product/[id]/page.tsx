import db from '@/lib/db'
import { products } from '@/lib/schema'
import { getGlobalSettings } from '@/modules/settings/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { eq } from 'drizzle-orm'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, ShieldCheck, Scale, Coins } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resolvedId = parseInt(id)
  if (isNaN(resolvedId)) return { title: 'Produk Tidak Ditemukan' }

  const result = await db.select({ title: products.title, description: products.description, imageUrl: products.imageUrl })
    .from(products).where(eq(products.id, resolvedId)).limit(1)
  const product = result[0]
  if (!product) return { title: 'Produk Tidak Ditemukan' }

  return {
    title: `${product.title} | Lelang Emas Indonesia`,
    description: product.description.substring(0, 160),
    openGraph: { title: product.title, description: product.description.substring(0, 160), images: [product.imageUrl] },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resolvedId = parseInt(id)
  if (isNaN(resolvedId)) notFound()

  const result = await db.select().from(products).where(eq(products.id, resolvedId)).limit(1)
  const product = result[0]
  if (!product) notFound()

  const createdAtDate = product.createdAt ? new Date(product.createdAt) : new Date()
  const { telegramUrl } = await getGlobalSettings()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
       <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
             <Button variant="ghost" size="sm" render={<Link href="/" />}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Katalog
             </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
             <div className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border shadow-sm relative">
                <Image src={product.imageUrl} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                {product.status === 'SOLD' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white font-bold text-3xl tracking-wider border-4 border-white px-6 py-2 -rotate-12 rounded-lg">TERJUAL</span>
                    </div>
                )}
             </div>

             <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={product.status === 'AVAILABLE' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                          {product.status === 'AVAILABLE' ? 'TERSEDIA' : 'TERJUAL'}
                        </Badge>
                        <span className="text-sm text-zinc-500">Diposting {createdAtDate.toLocaleDateString('id-ID')}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{product.title}</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {(product.category === 'GOLD' || !product.category) && (
                        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1"><Scale className="h-4 w-4" /><span className="text-sm">Berat</span></div>
                            <p className="text-2xl font-semibold">{product.weight}g</p>
                        </div>
                    )}
                     <div className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border ${(product.category === 'GOLD' || !product.category) ? '' : 'col-span-2'}`}>
                        <div className="flex items-center gap-2 text-zinc-500 mb-1"><Coins className="h-4 w-4" /><span className="text-sm">Harga Buka</span></div>
                        <p className="text-2xl font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <div className="prose dark:prose-invert">
                    <h3 className="text-lg font-semibold mb-2">Deskripsi Produk</h3>
                    <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 leading-relaxed">{product.description}</p>
                </div>

                {(product.category === 'GOLD' || !product.category) && (
                    <div className="grid grid-cols-3 gap-2 py-4">
                        <div className="flex flex-col items-center justify-center p-3 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg text-center border border-yellow-100 dark:border-yellow-900/20">
                            <ShieldCheck className="h-5 w-5 text-yellow-600 mb-1" /><span className="text-xs font-medium text-yellow-800 dark:text-yellow-500">Emas Murni</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg text-center border border-green-100 dark:border-green-900/20">
                            <Coins className="h-5 w-5 text-green-600 mb-1" /><span className="text-xs font-medium text-green-800 dark:text-green-500">Gratis Ongkos</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-center border border-blue-100 dark:border-blue-900/20">
                            <Scale className="h-5 w-5 text-blue-600 mb-1" /><span className="text-xs font-medium text-blue-800 dark:text-blue-500">Timbang Akurat</span>
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t">
                    <p className="text-sm text-zinc-500 mb-4 text-center">Tertarik dengan barang ini? Gabung grup Telegram kami untuk ikut lelang!</p>
{product.status === 'AVAILABLE' ? (
                         <Button className="w-full h-14 text-lg font-semibold bg-blue-500 hover:bg-blue-600" render={<Link href={telegramUrl} target="_blank" />}>
                            <Send className="mr-2 h-5 w-5" /> Gabung Telegram untuk Bid
                         </Button>
                    ) : (
                         <Button disabled className="w-full h-14 text-lg font-semibold">Barang Sudah Terjual</Button>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                        <ShieldCheck className="h-3 w-3" /><span>Transaksi Aman & Terpercaya</span>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
