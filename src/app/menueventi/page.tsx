import { Montserrat } from 'next/font/google'
import { getPublicMenu } from '@/lib/supabase/menu'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import EventMenuTabs from '@/components/menu/EventMenuTabs'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function MenuEventiPage() {
  const items = await getPublicMenu('eventi')

  return (
    <MenuPageLayout title="Menu Eventi">
      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
          Il menu eventi è in aggiornamento, torna presto!
        </p>
      ) : (
        <EventMenuTabs items={items} />
      )}
    </MenuPageLayout>
  )
}
