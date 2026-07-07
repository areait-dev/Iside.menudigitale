'use client'

import type { MenuSection } from '@/types/menu'
import AllergenTags from '@/components/menu/AllergenTags'

interface StandardMenuSectionProps {
  section: MenuSection
}

export default function StandardMenuSection({ section }: StandardMenuSectionProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-14">
      <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
          {section.title}
          {section.type !== 'employee' && section.basePrice != null && (
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
        {section.items.map((item) => {
          const displayPrice =
            item.price != null && item.price > 0
              ? item.price
              : section.basePrice != null && section.basePrice > 0
              ? section.basePrice
              : null

          return (
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
                  {item.allergens && item.allergens.length > 0 && (
                    <AllergenTags allergens={item.allergens} />
                  )}
                </div>
                {displayPrice != null && (
                  <span className="text-sm sm:text-base md:text-lg font-serif font-semibold text-primary whitespace-nowrap flex-shrink-0">
                    €{displayPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="h-px bg-gray-200 mt-3 sm:mt-4" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
