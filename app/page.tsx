import db from '@/lib/db'
import { products } from '@/lib/schema'
import { ProductCard } from '@/modules/product/components/ProductCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { eq, desc, asc } from 'drizzle-orm'

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = {
  title: 'Lelang Emas Indonesia - Perhiasan & Gadget Murah',
  description: 'Ikuti lelang emas perhiasan sitaan bank dengan harga terendah. Gratis ongkos tukang. Bid sekarang di Telegram!'
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams;
  
  // Query products with optional category filter
  let productList;
  if (category && category !== 'ALL') {
    productList = await db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(asc(products.status), desc(products.createdAt))
  } else {
    productList = await db.select().from(products)
      .orderBy(asc(products.status), desc(products.createdAt))
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      
      {/* Premium Hero Section */}
      <section 
        className="relative py-20 md:py-32 overflow-hidden" 
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
         {/* Abstract Background */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black"></div>
         </div>

         <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-zinc-200 text-sm mb-6 backdrop-blur-md">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Lelang Live & Jual Langsung
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg" style={{ color: '#ffffff' }}>
               Lelang Emas & Perhiasan
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#d4d4d8' }}>
               Dapatkan emas sitaan bank dengan harga lelang terendah. <br/>
               <span className="font-medium px-2 rounded" style={{ color: '#facc15', backgroundColor: 'rgba(0,0,0,0.3)' }}>Gratis Ongkos Tukang. Kualitas Terjamin.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 transition-all font-bold border-0" render={<Link href="/?category=GOLD" />}>
                   Lihat Emas
                </Button>
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all font-bold border-0" render={<Link href="/?category=GADGET" />}>
                   Lihat Gadget
                </Button>
            </div>
         </div>
      </section>

      {/* Catalog Section */}
      <main className="container mx-auto px-4 py-8 md:py-16 -mt-10 relative z-20">
         {/* Category Tabs */}
         <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800">
               <Link 
                 href="/" 
                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!category || category === 'ALL' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
               >
                 Semua
               </Link>
               <Link 
                 href="/?category=GOLD" 
                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${category === 'GOLD' ? 'bg-yellow-500 text-white shadow-md' : 'text-zinc-500 hover:text-yellow-600'}`}
               >
                 Emas
               </Link>
               <Link 
                 href="/?category=GADGET" 
                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${category === 'GADGET' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-500 hover:text-blue-600'}`}
               >
                 Gadget
               </Link>
            </div>
         </div>

         {productList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {productList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
         ) : (
             <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                    <ShoppingBag className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Belum ada produk</h3>
                <p className="text-zinc-500 mt-2 max-w-sm mx-auto">Tidak ada produk saat ini.</p>
                {category && (
                    <Button variant="link" className="mt-4 text-blue-500" render={<Link href="/" />}>
                        Lihat semua kategori
                    </Button>
                )}
             </div>
         )}
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4 text-center">
             <div className="mb-6">
                <span className="font-bold text-2xl tracking-tighter">Lelang Emas Indonesia</span>
             </div>
             <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
                Platform lelang emas dan gadget terpercaya di Indonesia. Harga kompetitif, barang berkualitas, dan transaksi aman.
             </p>
             <div className="text-sm text-zinc-400">
                &copy; {new Date().getFullYear()} Lelang Emas Indonesia. All rights reserved.
             </div>
          </div>
      </footer>
    </div>
  )
}
