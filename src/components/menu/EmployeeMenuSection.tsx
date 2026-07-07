'use client'

import type { MenuSection } from '@/types/menu'
import AllergenTags from '@/components/menu/AllergenTags'

interface EmployeeMenuSectionProps {
  section: MenuSection
}

export default function EmployeeMenuSection({ section }: EmployeeMenuSectionProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-14">
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
      <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-0">
        {section.items.map((item) => (
          <div key={item.id}>
            <h3 className="font-serif text-primary text-sm sm:text-base font-bold tracking-widest uppercase mb-3 pb-2 border-b border-secondary/30">
              {item.day}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words">
              {item.name}
            </p>
            {item.description && (
              <p className="text-gray-500 text-xs sm:text-sm md:text-base italic font-light mt-0.5 sm:mt-1 leading-snug">
                {item.description}
              </p>
            )}
            {item.allergens && item.allergens.length > 0 && (
              <AllergenTags allergens={item.allergens} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
