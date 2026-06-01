import { Montserrat } from 'next/font/google'
import { getPublicMenu } from '@/lib/supabase/menu'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
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

function sectionId(section: MenuSection) {
  return section.title.toLowerCase().replace(/\s+/g, '-')
}

function renderSection(item: MenuDisplayItem) {
  if (item.type === 'group') {
    return <GroupedMenuSection key={item.id} group={item as MenuSectionGroup} />
  }

  const section = item as MenuSection
  const id = sectionId(section)

  return (
    <section key={section.id} id={id}>
      {section.type === 'weekly' ? (
        <WeeklyMenuCard section={section} />
      ) : section.type === 'buffet' ? (
        <SimpleListSection section={section} />
      ) : (
        <StandardMenuSection section={section} />
      )}
    </section>
  )
}

export default async function MenuEventiPage() {
  const items = await getPublicMenu('eventi')

  return (
    <MenuPageLayout
      title="Menu Eventi"
      navItems={[
        { href: '#young-menu', label: 'Young Menu' },
        { href: '#buffet', label: 'Buffet Menu' },
        { href: '/menu/iside', label: 'Buffet ISIDE' },
      ]}
    >
      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
          Il menu eventi è in aggiornamento, torna presto!
        </p>
      ) : (
        items.map((item) => renderSection(item))
      )}
    </MenuPageLayout>
  )
}
