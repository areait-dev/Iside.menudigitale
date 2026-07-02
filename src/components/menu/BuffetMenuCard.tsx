'use client'

import type { MenuSection } from '@/types/menu'

interface BuffetMenuCardProps {
  section: MenuSection
}

export default function BuffetMenuCard({ section }: BuffetMenuCardProps) {
  return (
    <div className="mb-8 sm:mb-10 md:mb-14">
      <div className="text-center mb-5 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight">
          {section.title}
        </h2>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
          <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {section.items.map((item) => {
          const bullets = item.description
            ? item.description.split(',').map((s) => s.trim())
            : []

          return (
            <div key={item.id}>
              <h3 className="font-serif text-primary text-sm sm:text-base font-bold tracking-widest uppercase mb-3 pb-2 border-b border-secondary/30">
                {item.name}
              </h3>
              {bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="text-gray-500 text-xs sm:text-sm leading-relaxed flex items-start gap-2 font-light italic"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-secondary/50 flex-shrink-0" />
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
