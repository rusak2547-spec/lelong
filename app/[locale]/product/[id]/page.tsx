import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TelegramButton } from '@/modules/settings/components/TelegramButton'
import { ArrowLeft, Send, ShieldCheck, Scale, Coins } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

// Force dynamic behavior for this page to ensure fresh data
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  const resolvedId = parseInt(id)
  
  if (isNaN(resolvedId)) return { title: 'Product Not Found' }

  const product = await prisma.product.findUnique({
    where: { id: resolvedId },
    select: { title: true, description: true, imageUrl: true }
  })

  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.title} | Pawnshop Brunei`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: [product.imageUrl],
    },
  }
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string, locale: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const resolvedId = parseInt(id)
  const t = await getTranslations('ProductDetail');
  
  if (isNaN(resolvedId)) {
      notFound()
  }

  const product = await prisma.product.findUnique({
    where: { id: resolvedId }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
       <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
             <Button variant="ghost" size="sm" render={<Link href="/" />}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
             </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
             {/* Image Section */}
             <div className="space-y-4">
                <div className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border shadow-sm relative">
                   <Image 
                     src={product.imageUrl} 
                     alt={product.title}
                     fill
                     sizes="(max-width: 768px) 100vw, 50vw"
                     className="object-cover w-full h-full"
                   />

                   {product.status === 'SOLD' && (
                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="text-white font-bold text-3xl tracking-wider border-4 border-white px-6 py-2 -rotate-12 rounded-lg">
                               SOLD
                           </span>
                       </div>
                   )}
                </div>
             </div>

             {/* Details Section */}
             <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={product.status === 'AVAILABLE' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                            {product.status}
                        </Badge>
                        <span className="text-sm text-zinc-500">
                             {t('posted')} {product.createdAt.toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {product.title}
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* @ts-ignore */}
                    {((product as any).category === 'GOLD' || !(product as any).category) && (
                        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <Scale className="h-4 w-4" />
                                <span className="text-sm">{t('weight')}</span>
                            </div>
                            <p className="text-2xl font-semibold">{product.weight}g</p>
                        </div>
                    )}
                     <div className={`p-4 rounded-lg bg-white dark:bg-zinc-900 border ${((product as any).category === 'GOLD' || !(product as any).category) ? '' : 'col-span-2'}`}>
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <Coins className="h-4 w-4" />
                            <span className="text-sm">{t('openBid')}</span>
                        </div>
                        <p className="text-2xl font-semibold">BND {product.price.toLocaleString()}</p>
                    </div>
                </div>

                <div className="prose dark:prose-invert">
                    <h3 className="text-lg font-semibold mb-2">{t('description')}</h3>
                    <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* Trust Badges - Only for Gold */}
                {/* @ts-ignore */}
                {((product as any).category === 'GOLD' || !(product as any).category) && (
                    <div className="grid grid-cols-3 gap-2 py-4">
                        <div className="flex flex-col items-center justify-center p-3 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg text-center border border-yellow-100 dark:border-yellow-900/20">
                            <ShieldCheck className="h-5 w-5 text-yellow-600 mb-1" />
                            <span className="text-xs font-medium text-yellow-800 dark:text-yellow-500">{t('trust1_title')}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg text-center border border-green-100 dark:border-green-900/20">
                            <Coins className="h-5 w-5 text-green-600 mb-1" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-500">{t('trust2_title')}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-center border border-blue-100 dark:border-blue-900/20">
                            <Scale className="h-5 w-5 text-blue-600 mb-1" />
                            <span className="text-xs font-medium text-blue-800 dark:text-blue-500">{t('trust3_title')}</span>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="pt-6 border-t">
                    <div className="mb-4 text-center">
                         <p className="text-sm text-zinc-500 mb-2">
                             {t('cta_text')}
                         </p>
                    </div>
                    {product.status === 'AVAILABLE' ? (
                         <Button className="w-full h-14 text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-colors" render={<Link href="https://t.me/Pawnshop_vip" target="_blank" />}>
                            <Send className="mr-2 h-5 w-5" />
                            Join Telegram to Bid
                         </Button>
                    ) : (
                         <Button disabled className="w-full h-14 text-lg font-semibold">
                            {t('cta_sold')}
                         </Button>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{t('safe_transaction')}</span>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}
