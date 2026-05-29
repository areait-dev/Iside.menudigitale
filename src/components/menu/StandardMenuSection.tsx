'use client'

import type { MenuSection } from '@/types/menu'

interface StandardMenuSectionProps {
  section: MenuSection
}

export default function StandardMenuSection({ section }: StandardMenuSectionProps) {
  return (
    <div>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-iside-primary text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase">
          {section.title}
        </h2>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="h-px bg-iside-primary/20 w-12 sm:w-16" />
          <span className="w-1.5 h-1.5 rounded-full bg-iside-primary/30" />
          <span className="h-px bg-iside-primary/20 w-12 sm:w-16" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 divide-y divide-stone-100">
        {section.items.map((item) => (
          <div key={item.id} className="px-4 sm:px-6 py-3.5 sm:py-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-iside-primary font-semibold text-sm sm:text-base leading-snug">
                  {item.name}
                </h3>
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
              {item.price != null && item.price === 0 && (
                <span className="text-iside-secondary text-xs italic whitespace-nowrap flex-shrink-0">
                  Vedi prezzi
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
