import { ALLERGENI } from '@/lib/allergeni'

interface AllergeniGridProps {
  dense?: boolean
  highlightedIds?: Set<number>
}

export default function AllergeniGrid({ dense = false, highlightedIds }: AllergeniGridProps) {
  const hasHighlight = highlightedIds != null && highlightedIds.size > 0

  return (
    <div
      className={
        dense
          ? 'grid grid-cols-3 sm:grid-cols-4 gap-2'
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
      }
    >
      {ALLERGENI.map((a) => {
        const isHighlighted = hasHighlight && highlightedIds!.has(a.id)
        const isDimmed = hasHighlight && !isHighlighted
        const Icon = a.Icon
        return (
          <div
            key={a.id}
            className={`flex flex-col items-center justify-center text-center rounded-xl border transition-opacity ${a.colorClass} ${
              dense ? 'p-2 gap-1' : 'p-4 gap-2'
            } ${isHighlighted ? 'ring-2 ring-primary shadow-md' : ''} ${isDimmed ? 'opacity-40' : ''}`}
          >
            <Icon className={dense ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10'} strokeWidth={1.75} />
            <span className={dense ? 'text-[11px] leading-tight font-medium' : 'text-sm sm:text-base font-medium leading-tight'}>
              {a.id}. {a.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
