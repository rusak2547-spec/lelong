'use client'

import { useActionState } from 'react'
import { createProduct } from '@/modules/product/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea' // Assuming I have this or will use standard textarea
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center gap-2">
         <Button variant="ghost" size="sm" render={<Link href="/admin/dashboard" />}>
               <ArrowLeft className="h-4 w-4 mr-1" />
               Back
         </Button>
         <h1 className="text-2xl font-bold">Add New Product</h1>
       </div>

       <Card>
          <CardHeader>
             <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <form action={createProduct}>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="title">Product Title</Label>
                 <Input id="title" name="title" required placeholder="e.g. Cincin Emas 5gr" />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="description">Description</Label>
                 <textarea 
                   id="description" 
                   name="description" 
                   required 
                   placeholder="Condition, karat, etc."
                   className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="price">Open Bid Price (BND)</Label>
                   <Input id="price" name="price" type="number" required placeholder="1000000" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="weight">Weight (grams)</Label>
                   <Input id="weight" name="weight" type="number" step="0.01" required placeholder="5.0" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="category">Category</Label>
                   <div className="relative">
                      <select 
                        id="category" 
                        name="category" 
                        required 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      >
                         <option value="GOLD">Emas (Gold)</option>
                         <option value="GADGET">Gadget / Elektronik</option>
                      </select>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="image">Product Image</Label>
                   <Input id="image" name="image" type="file" required accept="image/*" />
                 </div>
               </div>


            </CardContent>
            <CardFooter className="justify-end gap-2">
               <Button variant="outline" type="button" render={<Link href="/admin/dashboard" />}>
                  Cancel
               </Button>
               <Button type="submit">Create Product</Button>
            </CardFooter>
          </form>
       </Card>
    </div>
  )
}
