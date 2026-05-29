export type MenuType = 'ala_carte' | 'weekly' | 'buffet' | 'group'

export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number | null
  day?: string
}

export interface MenuSection {
  id: string
  title: string
  type: MenuType
  basePrice?: number
  items: MenuItem[]
  order: number
}

export interface MenuSectionGroup {
  id: string
  title: string
  type: 'group'
  sections: MenuSection[]
  order: number
}

export type MenuDisplayItem = MenuSection | MenuSectionGroup
