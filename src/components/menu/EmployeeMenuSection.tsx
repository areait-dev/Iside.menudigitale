'use client'

import type { MenuSection } from '@/types/menu'

interface EmployeeMenuSectionProps {
  section: MenuSection
}

export default function EmployeeMenuSection({ section }: EmployeeMenuSectionProps) {
  return (
    <div>
      <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
          {section.title}
          {section.basePrice != null && (
            <span className="text-primary/60 ml-3 text-lg sm:text-xl md:text-2xl font-normal italic">
              € {section.basePrice.toFixed(2)}
            </span>
          )}
        </h2>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
        </div>
      </div>
      <div className="space-y-6 sm:space-y-7 px-2 sm:px-0">
        {section.items.map((item) => (
          <div key={item.id}>
            <h3 className="font-serif text-primary text-sm sm:text-base font-bold tracking-widest uppercase mb-3 pb-2 border-b border-secondary/30">
              {item.day}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words">
              {item.name}
            </p>
            {item.description && (
              <p className="text-gray-500 text-xs sm:text-sm italic font-light mt-1.5 leading-snug">
                {item.description}
              </p>
            )}
            {item.allergens && item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.allergens.map((a) => (
                  <span key={a} className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 rounded-full px-1.5 py-0.5 leading-none">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
