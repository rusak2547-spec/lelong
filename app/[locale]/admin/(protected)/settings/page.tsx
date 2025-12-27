import { getGlobalSettings, updateGlobalSettings } from '@/modules/settings/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export default async function SettingsPage() {
  const settings = await getGlobalSettings()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Global Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Telegram Configuration</CardTitle>
          <CardDescription>
            Set the global Telegram link for all products. All &quot;Join Auction&quot; buttons will point here.
          </CardDescription>
        </CardHeader>
        {/* @ts-expect-error - action type mismatch workaround */}
        <form action={updateGlobalSettings}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegramUrl">Telegram Group/Channel Link</Label>
                <Input 
                  id="telegramUrl" 
                  name="telegramUrl" 
                  defaultValue={settings.telegramUrl} 
                  placeholder="https://t.me/your_channel" 
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
