'use client'

import type { MenuSection } from '@/types/menu'

interface WeeklyMenuCardProps {
  section: MenuSection
}

export default function WeeklyMenuCard({ section }: WeeklyMenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="bg-iside-primary px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h2 className="text-white text-lg sm:text-xl font-bold tracking-widest uppercase">
          {section.title}
        </h2>
        {section.basePrice != null && (
          <span className="text-white/80 text-sm font-semibold">
            € {section.basePrice.toFixed(2)}
          </span>
        )}
      </div>
      <div className="divide-y divide-stone-100">
        {section.items.map((item) => (
          <div key={item.id} className="px-5 sm:px-6 py-3.5 flex items-start gap-4">
            <span className="text-iside-primary font-bold text-sm uppercase min-w-[80px] tracking-wide">
              {item.day}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-iside-primary font-semibold text-sm sm:text-base">
                {item.name}
              </p>
              {item.description && (
                <p className="text-iside-secondary text-xs sm:text-sm italic mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
