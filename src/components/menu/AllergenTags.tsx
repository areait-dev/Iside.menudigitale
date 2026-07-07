'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import AllergeniModal from '@/components/menu/AllergeniModal'

interface AllergenTagsProps {
  allergens: string[]
}

export default function AllergenTags({ allergens }: AllergenTagsProps) {
  const [open, setOpen] = useState(false)

  if (!allergens || allergens.length === 0) return null

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 mt-1.5">
        <button
          onClick={() => setOpen(true)}
          aria-label="Mostra dettagli allergeni"
          className="flex items-center justify-center w-4 h-4 rounded-full border border-stone-300 text-stone-400 hover:border-primary hover:text-primary transition-colors"
        >
          <Info className="w-3 h-3" />
        </button>
        {allergens.map((a) => (
          <button
            key={a}
            onClick={() => setOpen(true)}
            className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 rounded-full px-1.5 py-0.5 leading-none hover:border-primary hover:text-primary transition-colors"
          >
            {a}
          </button>
        ))}
      </div>
      <AllergeniModal open={open} onClose={() => setOpen(false)} highlightAllergens={allergens} />
    </>
  )
}
