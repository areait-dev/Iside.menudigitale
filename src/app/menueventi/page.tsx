import { Montserrat } from 'next/font/google'
import { getPublicMenu } from '@/lib/supabase/menu'
import { menuIside } from '@/lib/data/menu-iside'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import GroupedMenuSection from '@/components/menu/GroupedMenuSection'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import type { MenuDisplayItem, MenuSection, MenuSectionGroup } from '@/types/menu'
import type { MenuCategory } from '@/lib/data/menu-iside'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

const categoryLabels: Record<MenuCategory, string> = {
  aperitivo: 'Aperitivo',
  primi: 'Primi',
  carne: 'Carne',
  fritti: 'Fritti',
  contorni: 'Contorni',
  bevande: 'Bevande',
}

function sectionId(section: MenuSection) {
  return section.title.toLowerCase().replace(/\s+/g, '-')
}

function BuffetIsideSection() {
  const categories = Object.keys(menuIside) as MenuCategory[]

  return (
    <div className="space-y-10 sm:space-y-12">
      {categories.map((category) => (
        <div key={category}>
          <div className="text-center mb-5 sm:mb-6 px-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-primary tracking-wide leading-tight">
              {categoryLabels[category]}
            </h3>
            <div className="h-px bg-secondary/30 w-12 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {menuIside[category].map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-secondary/10 px-4 py-3 sm:px-5 sm:py-3.5"
              >
                <p className="text-sm sm:text-base md:text-lg font-serif text-dark tracking-wide leading-snug">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <p className="text-sm text-gray-400 italic">
          * Il menu può variare in base alla disponibilità del momento.
        </p>
      </div>
    </div>
  )
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
        <>
          <SimpleListSection section={section} />
          <div className="mt-12 sm:mt-16">
            <BuffetIsideSection />
          </div>
        </>
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
