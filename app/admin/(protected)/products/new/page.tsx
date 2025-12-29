import { createProduct } from '@/modules/product/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/admin/dashboard" />}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <Card>
        <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form action={createProduct as any} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="price">Price (BND)</Label><Input id="price" name="price" type="number" step="0.01" required /></div>
              <div className="space-y-2"><Label htmlFor="weight">Weight (g)</Label><Input id="weight" name="weight" type="number" step="0.01" required /></div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="GOLD">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="GOLD">Emas</SelectItem><SelectItem value="GADGET">Gadget</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="image">Product Image</Label><Input id="image" name="image" type="file" accept="image/*" required /></div>
            <Button type="submit" className="w-full">Create Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
