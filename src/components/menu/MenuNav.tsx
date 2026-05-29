'use client'

import { useState, useMemo } from 'react'
import type { MenuDisplayItem, MenuSectionGroup } from '@/types/menu'

interface MenuNavProps {
  items: MenuDisplayItem[]
}

function getLabel(item: MenuDisplayItem): string {
  if (item.type === 'group') return (item as MenuSectionGroup).title
  return (item as import('@/types/menu').MenuSection).title
}

export default function MenuNav({ items }: MenuNavProps) {
  const [active, setActive] = useState<string>('')

  const labels = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      label: getLabel(item),
    }))
  }, [items])

  const handleClick = (id: string) => {
    setActive(id)
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-0 z-20 bg-iside/95 backdrop-blur-sm border-b border-stone-200 overflow-x-auto">
      <div className="flex max-w-4xl mx-auto px-2 sm:px-4">
        {labels.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`whitespace-nowrap px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors flex-shrink-0 ${
              active === id
                ? 'text-iside-primary border-b-2 border-iside-primary'
                : 'text-stone-500 hover:text-iside-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
