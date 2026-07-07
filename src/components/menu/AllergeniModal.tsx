'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import AllergeniGrid from '@/components/menu/AllergeniGrid'
import { matchAllergene } from '@/lib/allergeni'

interface AllergeniModalProps {
  open: boolean
  onClose: () => void
  highlightAllergens?: string[]
}

export default function AllergeniModal({ open, onClose, highlightAllergens }: AllergeniModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const highlightedIds = new Set(
    (highlightAllergens ?? [])
      .map((text) => matchAllergene(text)?.id)
      .filter((id): id is number => id != null)
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-cream rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-serif text-primary tracking-wide">Allergeni</h2>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="text-stone-400 hover:text-primary p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AllergeniGrid dense highlightedIds={highlightedIds} />
      </div>
    </div>
  )
}
