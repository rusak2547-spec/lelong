import { getGlobalSettings } from '@/modules/settings/actions'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import Link from 'next/link'

export async function TelegramButton() {
  const settings = await getGlobalSettings()
  
  return (
    <Button 
      className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-[#0088cc] hover:bg-[#0077b5] text-white" 
      render={
        <Link 
            href={settings.telegramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
        />
      }
    >
        <Send className="mr-2 h-5 w-5" />
        Sertai Lelong di Telegram
    </Button>
  )
}
