import prisma from '@/lib/prisma'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, RotateCcw } from 'lucide-react'
import { deleteProduct, toggleProductStatus } from '@/modules/product/actions'

export default async function DashboardPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
         <Button render={<Link href="/admin/products/new" />}>
               <Plus className="mr-2 h-4 w-4" />
               Add Product
         </Button>
      </div>

      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
           <TableHeader>
              <TableRow>
                 <TableHead>Image</TableHead>
                 <TableHead>Title</TableHead>
                 <TableHead>Price (Open)</TableHead>
                 <TableHead>Category</TableHead>
                 <TableHead>Weight</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
             {products.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={7} className="text-center h-24 text-zinc-500">
                    No products found. Start by adding one.
                 </TableCell>
               </TableRow>
             ) : (
               products.map(product => (
                 <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>BND {product.price.toLocaleString()}</TableCell>
                    <TableCell>
                       {/* @ts-ignore */}
                       <Badge variant="outline">{(product as any).category || 'GOLD'}</Badge>
                    </TableCell>
                    <TableCell>{product.weight}g</TableCell>
                    <TableCell>
                       <Badge variant={product.status === 'AVAILABLE' ? 'default' : 'destructive'}>
                          {product.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                          <form action={toggleProductStatus.bind(null, product.id, product.status)}>
                             <Button type="submit" variant="outline" size="icon" title="Toggle Status">
                               <RotateCcw className="h-4 w-4" />
                             </Button>
                          </form>
                          <form action={deleteProduct.bind(null, product.id)}>
                             <Button type="submit" variant="destructive" size="icon" title="Delete">
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </form>
                       </div>
                    </TableCell>
                 </TableRow>
               ))
             )}
           </TableBody>
        </Table>
      </div>
    </div>
  )
}
