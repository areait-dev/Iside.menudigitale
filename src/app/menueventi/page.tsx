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
  const categories = Object.keys(menuIside) as MenuCategory[]

  return (
    <MenuPageLayout
      title="Menu Eventi"
      navItems={[
        { href: '#young-menu', label: 'Young Menu' },
        { href: '#buffet', label: 'Buffet Menu' },
        { href: '#buffet-iside', label: 'Buffet ISIDE' },
      ]}
    >
      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
          Il menu eventi è in aggiornamento, torna presto!
        </p>
      ) : (
        items.map((item) => renderSection(item))
      )}

      <section id="buffet-iside" className="mt-16 sm:mt-20">
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary tracking-wide leading-tight">
            Buffet ISIDE
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl mx-auto">
            Seleziona il tuo buffet: ogni categoria offre una varietà di piatti pensati per rendere il tuo evento speciale.
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3">
            <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
            <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
          </div>
        </div>

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
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-gray-400 italic">
            * Il menu può variare in base alla disponibilità del momento.
          </p>
        </div>
      </section>
    </MenuPageLayout>
  )
}
