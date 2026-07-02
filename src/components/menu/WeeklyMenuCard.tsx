'use client'

import type { MenuSection } from '@/types/menu'

interface WeeklyMenuCardProps {
  section: MenuSection
}

export default function WeeklyMenuCard({ section }: WeeklyMenuCardProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-14">
      <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
          {section.title}
        </h2>
        {section.basePrice != null && (
          <p className="text-primary/60 text-sm sm:text-base mt-1 font-serif italic">
            € {section.basePrice.toFixed(2)}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
        </div>
      </div>
      <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-0">
        {section.items.map((item) => (
          <div key={item.id}>
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="font-serif text-primary font-bold text-xs sm:text-sm uppercase min-w-[72px] tracking-wide flex-shrink-0 pt-0.5">
                {item.day}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 sm:gap-6">
                  <h3 className="text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words">
                    {item.name}
                  </h3>
                  {item.price != null && item.price > 0 && (
                    <span className="text-sm sm:text-base md:text-lg font-serif font-semibold text-primary whitespace-nowrap flex-shrink-0">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base italic font-light leading-snug break-words">
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
            </div>
            <div className="h-px bg-gray-200 mt-3 sm:mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
