import { Montserrat } from 'next/font/google'
import { getStaffDipendenteMenu } from '@/lib/supabase/menu'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import EmployeeMenuSection from '@/components/menu/EmployeeMenuSection'
import type { MenuSection } from '@/types/menu'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export default async function MenuDipendentiPage() {
  const menuByDay = await getStaffDipendenteMenu()
  const sections: MenuSection[] = menuByDay.map((day) => ({
    id: `dipendente-${day.day.toLowerCase().replace(/\s+/g, '-')}`,
    title: day.day,
    type: 'employee',
    items: day.items.map((item) => ({
      ...item,
      price: null,
    })),
    order: 0,
  }))

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
        sections.map((section) => <EmployeeMenuSection key={section.id} section={section} />)
      )}
    </MenuPageLayout>
  )
}
