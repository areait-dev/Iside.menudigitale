'use client'

import type { MenuSectionGroup } from '@/types/menu'

interface GroupedMenuSectionProps {
  group: MenuSectionGroup
}

export default function GroupedMenuSection({ group }: GroupedMenuSectionProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-iside-primary text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">
          {group.title}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="h-px bg-iside-primary/20 w-12 sm:w-16" />
          <span className="w-1.5 h-1.5 rounded-full bg-iside-primary/30" />
          <span className="h-px bg-iside-primary/20 w-12 sm:w-16" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {group.sections.map((section, idx) => (
          <div key={section.id}>
            {idx > 0 && <div className="mx-4 sm:mx-6 h-px bg-stone-200" />}
            <div className="px-4 sm:px-6 pt-5 pb-2">
              <h3 className="text-iside-primary/70 text-xs font-bold tracking-[0.15em] uppercase">
                {section.title}
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {section.items.map((item) => (
                <div key={item.id} className="px-4 sm:px-6 py-3 sm:py-3.5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-iside-primary font-semibold text-sm sm:text-base leading-snug">
                        {item.name}
                      </p>
                      {item.description && (
                        <p className="text-iside-secondary text-xs sm:text-sm italic mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.price != null && item.price > 0 && (
                      <span className="text-iside-primary font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                        € {item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
