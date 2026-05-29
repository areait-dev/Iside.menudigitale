import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { getPublicMenu } from '@/lib/supabase/menu'
import GroupedMenuSection from '@/components/menu/GroupedMenuSection'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import type { MenuDisplayItem, MenuSection, MenuSectionGroup } from '@/types/menu'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

function renderSection(item: MenuDisplayItem) {
  if (item.type === 'group') {
    return <GroupedMenuSection key={item.id} group={item as MenuSectionGroup} />
  }

  const section = item as MenuSection

  switch (section.type) {
    case 'weekly':
      return <WeeklyMenuCard key={section.id} section={section} />
    case 'buffet':
      return <SimpleListSection key={section.id} section={section} />
    default:
      return <StandardMenuSection key={section.id} section={section} />
  }
}

export default async function MenuPage() {
  const items = await getPublicMenu('all')

  return (
    <main className={`${montserrat.className} min-h-screen bg-cream`}>
      <header className="bg-primary text-white py-6 px-4 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 sm:h-20 md:h-24 lg:h-28 mx-auto mb-2" />
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary">Menu Ristorante</p>
      </header>

      <nav className="bg-secondary/20 px-4 py-3 text-center sticky top-0 z-10 backdrop-blur-sm border-b border-secondary/20">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          <Link href="/menu" className="text-primary font-semibold border-b-2 border-primary pb-1 text-sm sm:text-base">
            Ristorante
          </Link>
          <Link href="/menu/eventi" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
            Eventi
          </Link>
          <Link href="/menu/bar" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
            Bar & Colazione
          </Link>
          <Link href="/menu/vini" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">
            Vini & Bevande
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-10 sm:px-6 sm:py-12">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
            Il menu ristorante è in aggiornamento, torna presto!
          </p>
        ) : (
          items.map((item) => renderSection(item))
        )}
      </section>
    </main>
  )
}
