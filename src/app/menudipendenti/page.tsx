import { getStaffDipendenteMenu } from '@/lib/supabase/menu'
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

export default async function MenuDipendentiPage() {
  const menuByDay = await getStaffDipendenteMenu()

  const sections: MenuDisplayItem[] = [{
    id: 'dipendente',
    title: 'Menu Dipendenti',
    basePrice: 5.5,
    type: 'employee' as const,
    items: menuByDay.flatMap((day) =>
      day.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: null,
        day: day.day,
        allergens: item.allergens,
      }))
    ),
    order: 0,
  }]

  return (
    <MenuPageLayout
      title="Menu Dipendenti"
      subtitle="Menu riservato al personale — prezzo fisso € 5,50"
      navItems={[
        { href: '/menudipendenti', label: 'Menu Dipendenti', active: true },
      ]}
    >
      {sections.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
          Nessun menu dipendente disponibile al momento.
        </p>
      ) : (
        sections.map((item) => renderSection(item))
      )}
    </MenuPageLayout>
  )
}
