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
    basePrice: 5.5,
    items: day.items.map((item) => ({
      ...item,
      price: 5.5,
    })),
    order: 0,
  }))

  return (
    <MenuPageLayout
      title="Menu Dipendenti"
      subtitle="Pagina riservata al personale, prezzo fisso 5,50€."
      navItems={[
        { href: '/menu/bar', label: 'Bar & Colazione' },
        { href: '/menuristorante', label: 'Ristorante' },
        { href: '/menu/vini', label: 'Vini & Bevande' },
        { href: '/menu/proteico', label: 'Menu Proteico' },
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
