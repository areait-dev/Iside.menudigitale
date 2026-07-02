'use client'

import type { MenuSectionGroup } from '@/types/menu'

interface GroupedMenuSectionProps {
  group: MenuSectionGroup
}

export default function GroupedMenuSection({ group }: GroupedMenuSectionProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-14">
      <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
          {group.title}
        </h2>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
        </div>
      </div>

      {group.sections.map((section, idx) => (
        <div key={section.id} className={idx > 0 ? 'mt-8 sm:mt-10 md:mt-14' : ''}>
          <h3 className="font-serif text-primary/70 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase mb-5 sm:mb-6 md:mb-8 px-2 sm:px-0">
            {section.title}
          </h3>
          <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-0">
            {section.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-start gap-4 sm:gap-6">
                  <div className="flex-1 min-w-0 pr-4 sm:pr-6">
                    <h3 className="text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base italic font-light leading-snug break-words">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.price != null && item.price > 0 && (
                    <span className="text-sm sm:text-base md:text-lg font-serif font-semibold text-primary whitespace-nowrap flex-shrink-0">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="h-px bg-gray-200 mt-3 sm:mt-4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
