import { createClient } from '@/lib/supabase-server'
import { MENU_DATA } from '@/lib/menu-data'
import type { MenuSection, MenuItem, MenuDisplayItem, MenuSectionGroup } from '@/types/menu'

interface SupabaseCategory {
  id: string
  name: string
  section_type?: string | null
  base_price?: number | null
  order: number
}

interface SupabaseItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number | null
  day?: string | null
  available?: boolean | null
}

const GROUP_MAP: Record<string, { groupTitle: string; groupOrder: number }> = {
  Vini: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
  Cocktail: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
  Bevande: { groupTitle: 'Vini & Bevande', groupOrder: 10 },
}

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
  if (cat.section_type === 'weekly' || cat.section_type === 'buffet') {
    return cat.section_type
  }
  return 'ala_carte'
}

export async function getMenuData(): Promise<MenuDisplayItem[]> {
  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase
      .from('category_order')
      .select('id, name, section_type, base_price, order')
      .order('order', { ascending: true })

    if (catError || !categories || categories.length === 0) {
      return buildFromStatic()
    }

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('id, category, name, description, price, day, available')

    if (itemsError) {
      return buildFromStatic()
    }

    const itemsByCategory = new Map<string, MenuItem[]>()
    for (const row of items ?? []) {
      if (row.available === false) continue
      const list = itemsByCategory.get(row.category) ?? []
      list.push(toMenuItem(row))
      itemsByCategory.set(row.category, list)
    }

    const standalone: MenuSection[] = []
    const grouped = new Map<string, MenuSection[]>()

    for (const cat of categories) {
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
      const group: MenuSectionGroup = {
        id: `group-${groupTitle.toLowerCase().replace(/\s+/g, '-')}`,
        title: groupTitle,
        type: 'group',
        sections,
        order: groupOrder,
      }
      result.push(group)
    }

    result.sort((a, b) => {
      const aOrder = 'sections' in a ? a.order : (a as MenuSection).order
      const bOrder = 'sections' in b ? b.order : (b as MenuSection).order
      return aOrder - bOrder
    })

    return result
  } catch {
    return buildFromStatic()
  }
}

function buildFromStatic(): MenuDisplayItem[] {
  const standalone: MenuSection[] = []
  const grouped = new Map<string, MenuSection[]>()

  for (const s of MENU_DATA) {
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
    const group: MenuSectionGroup = {
      id: `group-${groupTitle.toLowerCase().replace(/\s+/g, '-')}`,
      title: groupTitle,
      type: 'group',
      sections,
      order: groupOrder,
    }
    result.push(group)
  }

  result.sort((a, b) => {
    const aOrder = 'sections' in a ? a.order : (a as MenuSection).order
    const bOrder = 'sections' in b ? b.order : (b as MenuSection).order
    return aOrder - bOrder
  })

  return result
}
