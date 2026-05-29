import { createClient } from '@/lib/supabase-server'
import { MENU_DATA } from '@/lib/menu-data'
import type { MenuDisplayItem, MenuItem, MenuSection, MenuSectionGroup } from '@/types/menu'

interface SupabaseCategory {
  id: string
  name: string
  section_type?: string | null
  base_price?: number | null
  order: number
  type?: string | null
}

interface SupabaseItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number | null
  day?: string | null
  available?: boolean | null
  display_area?: string | null
}

const GROUP_MAP: Record<string, { groupTitle: string; groupOrder: number }> = {
  Vini: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
  Cocktail: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
  Bevande: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
}

const DAY_ORDER = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']

const RESTAURANT_TITLES = new Set(['Antipasto', 'Primi', 'Secondi', 'Contorni', 'Insalata da comporre', 'Dolci'])
const BAR_TITLES = new Set(['Bar & Colazione', 'Croissant', 'Crostata', 'Toast', 'Piadine'])
const EVENT_TITLES = new Set(['Young Menu', 'Buffet'])
const VINI_TITLES = new Set(['Vini', 'Cocktail', 'Bevande'])

function toMenuItem(row: SupabaseItem): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: row.price,
    day: row.day ?? undefined,
  }
}

function detectSectionType(cat: SupabaseCategory): MenuSection['type'] {
  if (cat.section_type === 'weekly' || cat.section_type === 'buffet' || cat.section_type === 'employee') {
    return cat.section_type
  }
  return 'ala_carte'
}

function isCategoryVisibleForArea(cat: SupabaseCategory, area: string) {
  if (cat.name === 'Menu Proteico' || cat.name === 'Menu Dipendente') return false

  if (area === 'all') return true
  if (area === 'cibo') return cat.type === 'cibo' || RESTAURANT_TITLES.has(cat.name)
  if (area === 'vini') return cat.type === 'vini' || VINI_TITLES.has(cat.name)
  if (area === 'bar') return cat.type === 'bar' || BAR_TITLES.has(cat.name)
  if (area === 'eventi') {
    return (
      cat.type === 'eventi' ||
      EVENT_TITLES.has(cat.name) ||
      ['weekly', 'buffet'].includes(cat.section_type ?? '')
    )
  }
  return true
}

export async function getPublicMenu(area: string): Promise<MenuDisplayItem[]> {
  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase
      .from('category_order')
      .select('id, name, section_type, base_price, order, type')
      .order('order', { ascending: true })

    if (catError || !categories) {
      return area === 'all' ? buildFromStatic() : []
    }

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('id, category, name, description, price, day, available, display_area')
      .eq('available', true)

    if (itemsError || !items) {
      return area === 'all' ? buildFromStatic() : []
    }

    const publicItems = items.filter(
      (row) =>
        row.category !== 'Menu Proteico' &&
        row.category !== 'Menu Dipendente' &&
        row.display_area !== 'dipendente'
    )

    const itemsByCategory = new Map<string, MenuItem[]>()
    for (const row of publicItems) {
      const list = itemsByCategory.get(row.category) ?? []
      list.push(toMenuItem(row))
      itemsByCategory.set(row.category, list)
    }

    const standalone: MenuSection[] = []
    const grouped = new Map<string, MenuSection[]>()

    for (const cat of categories) {
      if (!isCategoryVisibleForArea(cat, area)) continue

      const sectionItems = itemsByCategory.get(cat.name) ?? []
      if (sectionItems.length === 0) continue

      const section: MenuSection = {
        id: cat.id,
        title: cat.name,
        type: detectSectionType(cat),
        basePrice: cat.base_price ?? undefined,
        items: sectionItems,
        order: cat.order,
      }

      const groupInfo = GROUP_MAP[cat.name]
      if (groupInfo) {
        const list = grouped.get(groupInfo.groupTitle) ?? []
        list.push(section)
        grouped.set(groupInfo.groupTitle, list)
      } else {
        standalone.push(section)
      }
    }

    const result: MenuDisplayItem[] = [...standalone]
    for (const [groupTitle, sections] of grouped) {
      const groupOrder = GROUP_MAP[sections[0]?.title ?? '']?.groupOrder ?? 99
      result.push({
        id: `group-${groupTitle.toLowerCase().replace(/\s+/g, '-')}`,
        title: groupTitle,
        type: 'group',
        sections,
        order: groupOrder,
      })
    }

    result.sort((a, b) => {
      const aOrder = 'sections' in a ? a.order : a.order
      const bOrder = 'sections' in b ? b.order : b.order
      return aOrder - bOrder
    })

    return result
  } catch {
    return area === 'all' ? buildFromStatic() : []
  }
}

function buildFromStatic(): MenuDisplayItem[] {
  const standalone: MenuSection[] = []
  const grouped = new Map<string, MenuSection[]>()

  for (const s of MENU_DATA) {
    if (s.title === 'Menu Proteico' || s.title === 'Menu Dipendente') continue

    const groupInfo = GROUP_MAP[s.title]
    if (groupInfo) {
      const list = grouped.get(groupInfo.groupTitle) ?? []
      list.push(s)
      grouped.set(groupInfo.groupTitle, list)
    } else {
      standalone.push(s)
    }
  }

  const result: MenuDisplayItem[] = [...standalone]
  for (const [groupTitle, sections] of grouped) {
    const groupOrder = GROUP_MAP[sections[0]?.title ?? '']?.groupOrder ?? 99
    result.push({
      id: `group-${groupTitle.toLowerCase().replace(/\s+/g, '-')}`,
      title: groupTitle,
      type: 'group',
      sections,
      order: groupOrder,
    })
  }

  result.sort((a, b) => {
    const aOrder = 'sections' in a ? a.order : a.order
    const bOrder = 'sections' in b ? b.order : b.order
    return aOrder - bOrder
  })

  return result
}

export interface StaffMenuItem {
  id: string
  name: string
  description?: string
  price: number | null
  category: string
}

export interface StaffMenuDay {
  day: string
  items: StaffMenuItem[]
}

export async function getStaffMenu(): Promise<StaffMenuDay[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name, description, price, day, category')
      .eq('available', true)
      .eq('category', 'Menu Proteico')
      .order('day', { ascending: true })

    if (error || !data) {
      return []
    }

    const groupedByDay = new Map<string, StaffMenuItem[]>(DAY_ORDER.map((day) => [day, []]))
    const otherItems: StaffMenuItem[] = []

    for (const row of data) {
      const item: StaffMenuItem = {
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        price: row.price,
        category: row.category,
      }

      const day = row.day?.trim() ?? ''
      if (groupedByDay.has(day)) {
        groupedByDay.get(day)?.push(item)
      } else {
        otherItems.push(item)
      }
    }

    const result = DAY_ORDER.map((day) => ({ day, items: groupedByDay.get(day) ?? [] })).filter(
      (entry) => entry.items.length > 0,
    )

    if (otherItems.length > 0) {
      result.push({ day: 'Altro', items: otherItems })
    }

    return result
  } catch {
    return []
  }
}
