import {
  Wheat,
  Shell,
  Egg,
  Fish,
  Nut,
  Bean,
  Milk,
  Salad,
  FlaskConical,
  Sprout,
  Waves,
  type LucideIcon,
} from 'lucide-react'

export interface AllergeneDef {
  id: number
  name: string
  Icon: LucideIcon
  colorClass: string
  keywords: string[]
}

export const ALLERGENI: AllergeneDef[] = [
  { id: 1, name: 'Glutine', Icon: Wheat, colorClass: 'bg-amber-50 text-amber-700 border-amber-200', keywords: ['glutine', 'grano', 'frumento'] },
  { id: 2, name: 'Crostacei', Icon: Shell, colorClass: 'bg-orange-50 text-orange-700 border-orange-200', keywords: ['crostacei', 'gamber', 'scampi'] },
  { id: 3, name: 'Uova', Icon: Egg, colorClass: 'bg-yellow-50 text-yellow-700 border-yellow-200', keywords: ['uova', 'uovo'] },
  { id: 4, name: 'Pesce', Icon: Fish, colorClass: 'bg-sky-50 text-sky-700 border-sky-200', keywords: ['pesce'] },
  { id: 5, name: 'Arachidi', Icon: Nut, colorClass: 'bg-lime-50 text-lime-700 border-lime-200', keywords: ['arachidi', 'noccioline'] },
  { id: 6, name: 'Soia', Icon: Bean, colorClass: 'bg-green-50 text-green-700 border-green-200', keywords: ['soia'] },
  { id: 7, name: 'Latte', Icon: Milk, colorClass: 'bg-blue-50 text-blue-700 border-blue-200', keywords: ['latte', 'lattosio'] },
  { id: 8, name: 'Frutta a guscio', Icon: Nut, colorClass: 'bg-orange-50 text-orange-800 border-orange-300', keywords: ['frutta a guscio', 'mandorle', 'nocciole', 'noci', 'pistacchi', 'anacardi'] },
  { id: 9, name: 'Sedano', Icon: Salad, colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', keywords: ['sedano'] },
  { id: 10, name: 'Senape', Icon: FlaskConical, colorClass: 'bg-yellow-50 text-yellow-800 border-yellow-300', keywords: ['senape'] },
  { id: 11, name: 'Sesamo', Icon: Sprout, colorClass: 'bg-stone-50 text-stone-700 border-stone-300', keywords: ['sesamo'] },
  { id: 12, name: 'Anidride solforosa e solfiti', Icon: FlaskConical, colorClass: 'bg-purple-50 text-purple-700 border-purple-200', keywords: ['anidride solforosa', 'solfiti', 'solforosa'] },
  { id: 13, name: 'Lupini', Icon: Sprout, colorClass: 'bg-teal-50 text-teal-700 border-teal-200', keywords: ['lupini'] },
  { id: 14, name: 'Molluschi', Icon: Waves, colorClass: 'bg-cyan-50 text-cyan-700 border-cyan-200', keywords: ['molluschi', 'cozze', 'vongole'] },
]

export function matchAllergene(freeText: string): AllergeneDef | undefined {
  const normalized = freeText.trim().toLowerCase()
  if (!normalized) return undefined
  return ALLERGENI.find((a) =>
    a.keywords.some((k) => normalized.includes(k) || k.includes(normalized))
  )
}
