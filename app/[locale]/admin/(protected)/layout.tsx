import { getSession, logout } from '@/modules/auth/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Inbox, Package, Plus, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = await getSession()
  
  if (!isLoggedIn) {
     redirect('/admin/login')
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-900">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <h2 className="text-xl font-bold">Pawnshop Admin</h2>
          </SidebarHeader>
          <SidebarContent>
             <SidebarMenu className="mt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/admin/dashboard" />}>
                      <Package />
                      <span>Products</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/admin/products/new" />}>
                      <Plus />
                      <span>Add New Product</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/admin/settings" />}>
                      <Inbox />
                      <span>Global Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <form action={logout}>
               <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                 <LogOut className="mr-2 h-4 w-4" />
                 Sign Out
               </Button>
            </form>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto">
           <div className="p-4 flex items-center gap-4 border-b bg-white dark:bg-zinc-950 px-6 py-3">
             <SidebarTrigger />
             <h1 className="text-sm font-medium text-zinc-500">Dashboard</h1>
           </div>
           <div className="p-6">
              {children}
           </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
