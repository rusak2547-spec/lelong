import { ShoppingBag } from 'lucide-react' // eslint-disable-line @typescript-eslint/no-unused-vars
import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
       <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="relative size-10 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800">
                <Image src="/logo.jpg" alt="Lelang Emas Logo" fill className="object-cover" />
             </div>
             <span className="font-bold text-xl tracking-tight">Lelang Emas Indonesia</span>
          </Link>
       </div>
    </header>
  )
}
