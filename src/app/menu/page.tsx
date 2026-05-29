import { Montserrat } from 'next/font/google'
import { getMenuData } from '@/lib/menu-service'
import type { MenuSection, MenuSectionGroup, MenuDisplayItem } from '@/types/menu'
import MenuNav from '@/components/menu/MenuNav'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import BuffetMenuCard from '@/components/menu/BuffetMenuCard'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import GroupedMenuSection from '@/components/menu/GroupedMenuSection'

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
      return <BuffetMenuCard key={section.id} section={section} />
    default:
      return <StandardMenuSection key={section.id} section={section} />
  }
}

export default async function MenuPage() {
  const items = await getMenuData()

  return (
    <main className={`${montserrat.className} flex-1 bg-iside`}>
      <header className="bg-iside-primary text-white py-12 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.15em] uppercase">
          Il Nostro Menu
        </h1>
      </header>

      <MenuNav items={items} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
        {items.map((item) => (
          <div key={item.id} id={`section-${item.id}`}>
            {renderSection(item)}
          </div>
        ))}
      </section>
    </main>
  )
}
