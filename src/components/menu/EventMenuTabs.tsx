'use client'

import { useState } from 'react'
import type { MenuDisplayItem, MenuSection } from '@/types/menu'
import { menuIside } from '@/lib/data/menu-iside'
import type { MenuCategory } from '@/lib/data/menu-iside'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'

type TabId = 'young' | 'buffet'

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

interface EventMenuTabsProps {
  items: MenuDisplayItem[]
}

export default function EventMenuTabs({ items }: EventMenuTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('young')

  const youngItems = items.filter(
    (item) => item.type !== 'group' && (item as MenuSection).title === 'Young Menu'
  )

  return (
    <div>
      <nav className="sticky top-0 z-20 bg-secondary/20 backdrop-blur-sm border-b border-secondary/20">
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={() => setActiveTab('young')}
            className={`whitespace-nowrap text-sm sm:text-base transition-colors min-h-[44px] flex items-center ${
              activeTab === 'young'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Young Menu
          </button>
          <button
            onClick={() => setActiveTab('buffet')}
            className={`whitespace-nowrap text-sm sm:text-base transition-colors min-h-[44px] flex items-center ${
              activeTab === 'buffet'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Buffet Menu
          </button>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
            <div className="text-center mb-8 sm:mb-10 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary tracking-wide leading-tight">
                Buffet Menu
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
      </section>
    </div>
  )
}
