import { getPublicMenu } from '@/lib/supabase/menu'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import EmployeeMenuSection from '@/components/menu/EmployeeMenuSection'
import type { MenuDisplayItem, MenuSection, MenuSectionGroup } from '@/types/menu'

export const dynamic = 'force-dynamic'

function renderSection(item: MenuDisplayItem) {
  if (item.type === 'group') {
    return <div key={item.id} />
  }

  const section = item as MenuSection

  switch (section.type) {
    case 'weekly':
      return <WeeklyMenuCard key={section.id} section={section} />
    case 'buffet':
      return <SimpleListSection key={section.id} section={section} />
    case 'employee':
      return <EmployeeMenuSection key={section.id} section={section} />
    default:
      return <StandardMenuSection key={section.id} section={section} />
  }
}

export default async function MenuProteicoPage() {
  const items = await getPublicMenu('proteico')

  return (
    <MenuPageLayout
      title="Menu Proteico"
      navItems={[
        { href: '/menu/bar', label: 'Bar & Colazione' },
        { href: '/menuristorante', label: 'Ristorante' },
        { href: '/menu/vini', label: 'Vini & Bevande' },
        { href: '/menu/proteico', label: 'Menu Proteico', active: true },
      ]}
    >
      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
          Il menu proteico è in aggiornamento, torna presto!
        </p>
      ) : (
        items.map((item) => renderSection(item))
      )}
    </MenuPageLayout>
  )
}
