import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { getPublicMenu } from '@/lib/supabase/menu'
import { menuIside } from '@/lib/data/menu-iside'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import type { MenuDisplayItem, MenuSection } from '@/types/menu'
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

function renderDbSection(item: MenuDisplayItem) {
  const section = item as MenuSection
  return (
    <div key={section.id}>
      {section.type === 'weekly' ? (
        <WeeklyMenuCard section={section} />
      ) : section.type === 'buffet' ? (
        <SimpleListSection section={section} />
      ) : (
        <StandardMenuSection section={section} />
      )}
    </div>
  )
}

function BuffetIsideSection() {
  const categories = Object.keys(menuIside) as MenuCategory[]
  return (
    <div className="space-y-12 sm:space-y-14">
      {categories.map((category) => (
        <div key={category}>
          <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
              {categoryLabels[category]}
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
              <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
              <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
              <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-0">
            {menuIside[category].map((item) => (
              <div key={item.id}>
                <p className="text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words">
                  {item.name}
                </p>
                <div className="h-px bg-gray-200 mt-3 sm:mt-4" />
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

interface PageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function MenuEventiPage({ searchParams }: PageProps) {
  const { tab } = await searchParams
  const activeTab = tab === 'buffet' ? 'buffet' : 'young'
  const items = await getPublicMenu('eventi')

  const youngItems = items.filter(
    (item) => item.type !== 'group' && (item as MenuSection).title === 'Young Menu'
  )

  const nav = (
    <nav className="bg-secondary/20 px-4 py-3 text-center sticky top-0 z-10 backdrop-blur-sm border-b border-secondary/20">
      <div className="flex justify-between max-w-4xl mx-auto">
        <Link
          href="/menueventi"
          className={`text-sm sm:text-base transition-colors ${
            activeTab === 'young'
              ? 'text-primary font-semibold border-b-2 border-primary pb-1'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          Young Menu
        </Link>
        <Link
          href="/menueventi?tab=buffet"
          className={`text-sm sm:text-base transition-colors ${
            activeTab === 'buffet'
              ? 'text-primary font-semibold border-b-2 border-primary pb-1'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          Buffet Menu
        </Link>
      </div>
    </nav>
  )

  return (
    <MenuPageLayout title="Menu Eventi" customNav={nav}>
      {activeTab === 'young' ? (
        youngItems.length === 0 ? (
          <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">
            Nessun menu young disponibile al momento.
          </p>
        ) : (
          <div className="space-y-14">{youngItems.map(renderDbSection)}</div>
        )
      ) : (
        <div>
          <div className="text-center mb-8 sm:mb-10 md:mb-14 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary tracking-wide leading-tight">
              Buffet Menu
              <span className="text-primary/60 ml-3 text-lg sm:text-xl md:text-2xl font-normal italic">
                € 35.00
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3">
              <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
              <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
              <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
            </div>
          </div>
          <BuffetIsideSection />
        </div>
      )}
    </MenuPageLayout>
  )
}
