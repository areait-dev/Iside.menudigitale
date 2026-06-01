'use client'

import { useState } from 'react'
import type { MenuDisplayItem, MenuSection, MenuSectionGroup } from '@/types/menu'
import WeeklyMenuCard from '@/components/menu/WeeklyMenuCard'
import EmployeeMenuSection from '@/components/menu/EmployeeMenuSection'
import SimpleListSection from '@/components/menu/SimpleListSection'
import StandardMenuSection from '@/components/menu/StandardMenuSection'
import GroupedMenuSection from '@/components/menu/GroupedMenuSection'

type TabId = 'cucina' | 'bar' | 'young' | 'proteico' | 'dipendente' | 'vini'

interface Tab {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  { id: 'cucina', label: 'Cucina' },
  { id: 'bar', label: 'Bar & Colazione' },
  { id: 'young', label: 'Young Menu' },
  { id: 'proteico', label: 'Menu Proteico' },
  { id: 'dipendente', label: 'Menu Dipendente' },
  { id: 'vini', label: 'Vini & Bevande' },
]

const CUCI_TITLES = new Set([
  'Antipasto', 'Primi', 'Secondi', 'Contorni',
  'Insalata da comporre', 'Dolci',
])

const BAR_TITLES = new Set([
  'Bar & Colazione', 'Croissant', 'Crostata', 'Toast', 'Piadine',
])

function tabForItem(item: MenuDisplayItem): TabId | null {
  if (item.type === 'group') return 'vini'
  const section = item as MenuSection
  if (BAR_TITLES.has(section.title)) return 'bar'
  if (section.title === 'Young Menu') return 'young'
  if (section.title === 'Menu Proteico') return 'proteico'
  if (section.title === 'Menu Dipendente') return 'dipendente'
  if (CUCI_TITLES.has(section.title)) return 'cucina'
  return null
}

function renderSection(item: MenuDisplayItem) {
  if (item.type === 'group') {
    return <GroupedMenuSection key={item.id} group={item as MenuSectionGroup} />
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

interface MenuNavProps {
  items: MenuDisplayItem[]
}

export default function MenuNav({ items }: MenuNavProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cucina')

  const grouped = new Map<TabId, MenuDisplayItem[]>()
  for (const tab of TABS) grouped.set(tab.id, [])
  for (const item of items) {
    const tab = tabForItem(item)
    if (tab) grouped.get(tab)!.push(item)
  }

  return (
    <div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-secondary/20 backdrop-blur-sm border-t sm:border-t-0 sm:border-b border-secondary/20 overflow-x-auto sm:sticky sm:top-0 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sm:shadow-none">
        <div className="flex justify-start sm:justify-center gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4 py-3">
          {TABS.map((tab) => {
            const count = grouped.get(tab.id)?.length ?? 0
            if (count === 0) return null
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap text-sm sm:text-base transition-colors flex-shrink-0 min-h-[44px] flex items-center ${
                  activeTab === tab.id
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24 sm:py-16 sm:pb-16 space-y-14">
        {(grouped.get(activeTab) ?? []).map((item) => (
          <div key={item.id}>{renderSection(item)}</div>
        ))}
      </section>
    </div>
  )
}
