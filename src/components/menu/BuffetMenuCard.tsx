'use client'

import type { MenuSection } from '@/types/menu'

interface BuffetMenuCardProps {
  section: MenuSection
}

export default function BuffetMenuCard({ section }: BuffetMenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 text-center border-b border-stone-100">
        <h2 className="text-iside-primary text-lg sm:text-xl font-bold tracking-widest uppercase">
          {section.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-100">
        {section.items.map((item) => {
          const bullets = item.description
            ? item.description.split(',').map((s) => s.trim())
            : []

          return (
            <div key={item.id} className="p-5 sm:p-6">
              <h3 className="text-iside-primary text-sm font-bold tracking-widest uppercase mb-3 pb-2 border-b border-stone-200">
                {item.name}
              </h3>
              {bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-iside-secondary text-sm leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-iside-primary mt-1.5 size-1.5 rounded-full bg-iside-primary/40 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
