import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { Scale, Tag, ArrowRight, Clock } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: number
    title: string
    price: number
    weight: number
    imageUrl: string
    status: string
    category?: string
    createdAt: Date
  }
}

export async function ProductCard({ product }: ProductCardProps) {
  const t = await getTranslations('ProductCard');
  const isGold = product.category === 'GOLD' || !product.category;
  
  return (
    <div className="group relative bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image 
          src={product.imageUrl} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <Badge 
             className={`backdrop-blur-md border-0 px-3 py-1 font-semibold tracking-wide ${
                product.status === 'AVAILABLE' 
                ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/20'
             }`}
           >
             {product.status}
           </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
           <Badge variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-black/80 font-medium border border-white/20">
              {product.category || 'GOLD'}
           </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="mb-4 flex-1">
           <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <Clock className="w-3 h-3" />
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
           </div>
           <h3 className="font-bold text-lg md:text-xl leading-snug text-zinc-900 dark:text-zinc-50 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
             {product.title}
           </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
           <div className={`flex flex-col ${!isGold ? 'col-span-2' : ''}`}>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {t('openBid')}
              </span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400 truncate">
                 <span className="text-xs text-zinc-400 font-normal mr-1">BND</span>
                 {product.price.toLocaleString()}
              </span>
           </div>
           
           {isGold && (
             <div className="flex flex-col text-right border-l border-zinc-200 dark:border-zinc-700 pl-3">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1 flex items-center justify-end gap-1">
                   {t('weight')} <Scale className="w-3 h-3" />
                </span>
                <span className="font-bold text-lg text-zinc-700 dark:text-zinc-300">
                   {product.weight}<span className="text-sm font-medium text-zinc-400 ml-0.5">g</span>
                </span>
             </div>
           )}
        </div>

        {/* Action */}
        <Button 
          className="w-full rounded-xl h-12 font-semibold text-base shadow-sm group-hover:shadow-blue-500/25 transition-all duration-300 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200" 
          render={<Link href={`/product/${product.id}`} />}
        >
          {t('viewDetail')}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
