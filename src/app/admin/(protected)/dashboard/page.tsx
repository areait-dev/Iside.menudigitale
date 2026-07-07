'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

interface MenuItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number
  available: boolean
  day?: string | null
  allergens?: string[] | null
}

interface Category {
  id: string
  name: string
  section_type?: string | null
  base_price?: number | null
  order: number
  type?: string | null
}

const SECTION_TYPES = [
  { value: 'ala_carte', label: 'Menu Ristorante' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'employee', label: 'Menu dipendenti' },
] as const

const CATEGORY_TYPES = [
  { value: 'cibo', label: 'Cucina' },
  { value: 'bar', label: 'Bar & Colazione' },
  { value: 'vini', label: 'Vini & Bevande' },
  { value: 'eventi', label: 'Eventi' },
  { value: 'proteico', label: 'Menu Proteico' },
  { value: 'dipendente', label: 'Menu Dipendente' },
] as const

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']

type TabId = 'cucina' | 'bar' | 'young' | 'buffet' | 'proteico' | 'dipendente' | 'vini'

const TABS: { id: TabId; label: string }[] = [
  { id: 'cucina', label: 'Cucina' },
  { id: 'bar', label: 'Bar & Colazione' },
  { id: 'young', label: 'Young Menu' },
  { id: 'buffet', label: 'Buffet Menu' },
  { id: 'proteico', label: 'Menu Proteico' },
  { id: 'dipendente', label: 'Menu Dipendente' },
  { id: 'vini', label: 'Vini & Bevande' },
]

const CUCI_TITLES = new Set(['Antipasto', 'Primi', 'Secondi', 'Contorni', 'Insalata da comporre', 'Dolci'])
const BAR_TITLES = new Set(['Bar & Colazione', 'Croissant', 'Crostata', 'Toast', 'Piadine'])
const GRP_TITLES = new Set(['Vini', 'Cocktail', 'Bevande'])

function tabForCat(name: string, type?: string | null, sectionType?: string | null): TabId | null {
  if (CUCI_TITLES.has(name)) return 'cucina'
  if (BAR_TITLES.has(name) || type === 'bar') return 'bar'
  if (name === 'Young Menu') return 'young'
  if (name === 'Buffet' || name === 'Buffet Menu' || sectionType === 'buffet') return 'buffet'
  if (type === 'eventi') return 'young'
  if (name === 'Menu Proteico' || type === 'proteico') return 'proteico'
  if (name === 'Menu Dipendente' || type === 'dipendente') return 'dipendente'
  if (GRP_TITLES.has(name) || type === 'vini') return 'vini'
  if (type === 'cibo') return 'cucina'
  console.warn('Sezione senza tab assegnato:', name, type, sectionType)
  return null
}

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('cucina')

  // category editing state
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryType, setEditingCategoryType] = useState('ala_carte')
  const [editingCategoryBasePrice, setEditingCategoryBasePrice] = useState('')
  const [editingCategoryMenuType, setEditingCategoryMenuType] = useState('cibo')

  // add category state
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState('ala_carte')
  const [newCategoryMenuType, setNewCategoryMenuType] = useState('cibo')
  const [newCategoryBasePrice, setNewCategoryBasePrice] = useState('')

  // item editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', day: '', available: true, allergens: '' })

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: items } = await supabase.from('menu_items').select('*')
    const { data: cats } = await supabase.from('category_order').select('*').order('order', { ascending: true })
    if (items) setMenuItems(items)
    if (cats) setCategories(cats)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const tabCategories = sortedCategories.filter((c) => tabForCat(c.name, c.type, c.section_type) === activeTab)

  // Category CRUD
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), -1)
    const payload: Record<string, unknown> = {
      name: newCategoryName.trim(),
      section_type: newCategoryType,
      type: newCategoryMenuType,
      order: maxOrder + 1,
    }
    if (newCategoryType === 'weekly' && newCategoryBasePrice) {
      payload.base_price = parseFloat(newCategoryBasePrice)
    }
    const { data, error } = await supabase.from('category_order').insert([payload]).select().single()
    if (error) console.error('handleAddCategory error:', JSON.stringify(error, null, 2), error.message, error.code, error.details, error.hint)
    if (data) {
      setCategories([...categories, data])
      setNewCategoryName('')
      setNewCategoryType('ala_carte')
      setNewCategoryBasePrice('')
      setShowAddCategory(false)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    const old = categories.find(c => c.id === id)
    if (!old || !editingCategoryName.trim()) return
    const payload: Record<string, unknown> = {
      name: editingCategoryName.trim(),
      section_type: editingCategoryType,
      type: editingCategoryMenuType,
    }
    if (editingCategoryType === 'weekly' && editingCategoryBasePrice) {
      payload.base_price = parseFloat(editingCategoryBasePrice)
    } else {
      payload.base_price = null
    }
    const { error: catUpdateError } = await supabase.from('category_order').update(payload).eq('id', id)
    if (catUpdateError) console.error('handleUpdateCategory (category_order) error:', catUpdateError)
    if (editingCategoryName.trim() !== old.name) {
      const { error: itemsUpdateError } = await supabase.from('menu_items').update({ category: editingCategoryName.trim() }).eq('category', old.name)
      if (itemsUpdateError) console.error('handleUpdateCategory (menu_items) error:', itemsUpdateError)
    }
    setCategories(categories.map(c => c.id === id ? { ...c, ...payload, base_price: payload.base_price ?? null } as Category : c))
    setMenuItems(menuItems.map(i => i.category === old.name ? { ...i, category: editingCategoryName.trim() } : i))
    setEditingCategory(null)
    setEditingCategoryMenuType('cibo')
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Eliminare questa sezione e tutti i suoi piatti?')) return
    const cat = categories.find(c => c.id === id)
    if (!cat) return
    await supabase.from('menu_items').delete().eq('category', cat.name)
    await supabase.from('category_order').delete().eq('id', id)
    setCategories(categories.filter(c => c.id !== id))
    setMenuItems(menuItems.filter(i => i.category !== cat.name))
  }

  const handleMoveCategory = async (id: string, dir: 'up' | 'down') => {
    const idx = sortedCategories.findIndex(c => c.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === sortedCategories.length - 1)) return
    const current = sortedCategories[idx]
    const swap = sortedCategories[dir === 'up' ? idx - 1 : idx + 1]
    await supabase.from('category_order').update({ order: swap.order }).eq('id', current.id)
    await supabase.from('category_order').update({ order: current.order }).eq('id', swap.id)
    fetchData()
  }

  // Item CRUD
  const handleSaveItem = async (category: string) => {
    if (!itemForm.name.trim()) return
    const cat = categories.find(c => c.name === category)
    const hasDay = cat?.section_type === 'weekly' || cat?.section_type === 'employee'
    const data: Record<string, unknown> = {
      category,
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || null,
      price: itemForm.price ? parseFloat(itemForm.price) : 0,
      available: itemForm.available,
    }
    if (hasDay && itemForm.day) {
      data.day = itemForm.day
    } else {
      data.day = null
    }
    data.allergens = itemForm.allergens
      ? itemForm.allergens.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []
    if (editingItemId) {
      const { error } = await supabase.from('menu_items').update(data).eq('id', editingItemId)
      if (error) console.error('handleSaveItem (update) error:', error)
    } else {
      const { error } = await supabase.from('menu_items').insert([data])
      if (error) console.error('handleSaveItem (insert) error:', error)
    }
    resetItemForm()
    fetchData()
  }

  const handleEditItem = (item: MenuItem) => {
    const cat = categories.find(c => c.name === item.category)
    const hasDay = cat?.section_type === 'weekly' || cat?.section_type === 'employee'
    setEditingItemId(item.id)
    setAddingToCategory(item.category)
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price > 0 ? item.price.toString() : '',
      day: hasDay ? (item.day || '') : '',
      available: item.available,
      allergens: (item.allergens || []).join(', '),
    })
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Eliminare questo piatto?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    fetchData()
  }

  const resetItemForm = () => {
    setEditingItemId(null)
    setAddingToCategory(null)
    setItemForm({ name: '', description: '', price: '', day: '', available: true, allergens: '' })
  }

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/admin/login' }

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="text-xl font-serif text-primary">Caricamento...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* HEADER — same style as public menu */}
      <header className="bg-primary text-white py-4 sm:py-5 px-4 text-center relative">
        <div className="absolute right-4 top-4 flex gap-3 items-center">
          <Link href="/menu" className="text-white/70 hover:text-white text-xs sm:text-sm">Vedi Menu</Link>
          <button onClick={handleLogout} className="text-red-300 hover:text-red-200 text-xs sm:text-sm">Esci</button>
        </div>
        <img src="/logo.png" alt="Logo" className="h-12 sm:h-16 mx-auto mb-1" />
        <p className="text-sm sm:text-base text-secondary">Menu Digitale <span className="text-white/40 text-xs ml-2">Admin</span></p>
      </header>

      {/* TAB NAV — same as MenuNav */}
      <nav className="bg-primary text-[#ECE4D4] backdrop-blur-sm border-b border-primary/20 overflow-x-auto order-last sm:order-none sticky bottom-0 left-0 right-0 z-20 sm:sticky sm:top-0 sm:z-10">
        <div className="flex justify-start sm:justify-center gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4 py-3">
          {TABS.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap text-sm sm:text-base transition-colors flex-shrink-0 min-h-[44px] flex items-center ${
                  activeTab === tab.id
                    ? 'text-[#ECE4D4] font-semibold border-b-2 border-[#ECE4D4]'
                    : 'text-[#ECE4D4]/70 hover:text-[#ECE4D4]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Add section button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-[#003D5A] text-sm font-semibold"
          >
            + Nuova Sezione
          </button>
        </div>

        {showAddCategory && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 mb-6 space-y-3 max-w-md mx-auto">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome sezione"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base"
              autoFocus
            />
            <select
              value={newCategoryType}
              onChange={(e) => {
                setNewCategoryType(e.target.value)
                if (e.target.value === 'employee') setNewCategoryMenuType('dipendente')
              }}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base bg-white"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={newCategoryMenuType}
              onChange={(e) => setNewCategoryMenuType(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base bg-white"
            >
              {CATEGORY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {newCategoryType === 'weekly' && (
              <input
                type="number"
                step="0.01"
                value={newCategoryBasePrice}
                onChange={(e) => setNewCategoryBasePrice(e.target.value)}
                placeholder="Prezzo base (€)"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base"
              />
            )}
            <div className="flex gap-2">
              <button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-[#003D5A] font-semibold">Aggiungi</button>
              <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); setNewCategoryType('ala_carte'); setNewCategoryMenuType('cibo'); setNewCategoryBasePrice('') }} className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300">Annulla</button>
            </div>
          </div>
        )}

        {/* Sections for this tab */}
        {tabCategories.map((cat) => {
          const catItems = (groupedMenu[cat.name] || []).sort((a, b) => {
            const dayOrder = (d: string) => DAYS.indexOf(d)
            return dayOrder(a.day || '') - dayOrder(b.day || '')
          })
          const hasDay = cat.section_type === 'weekly' || cat.section_type === 'employee'
          const showAllergens = true
          const isBuffet = cat.section_type === 'buffet'

          return (
            <div key={cat.id} className="mb-10 sm:mb-12 last:mb-0">
              {/* SECTION HEADER — editable */}
              <div className="text-center mb-4 sm:mb-5 px-2">
                {editingCategory === cat.id ? (
                  <div className="space-y-2 max-w-sm mx-auto">
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="text-center w-full px-3 py-2 border border-stone-200 rounded-lg text-lg font-serif"
                      autoFocus
                    />
                    <select
                      value={editingCategoryType}
                      onChange={(e) => {
                        setEditingCategoryType(e.target.value)
                        if (e.target.value === 'employee') setEditingCategoryMenuType('dipendente')
                      }}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                    >
                      {SECTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <select
                      value={editingCategoryMenuType}
                      onChange={(e) => setEditingCategoryMenuType(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                    >
                      {CATEGORY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {editingCategoryType === 'weekly' && (
                      <input
                        type="number"
                        step="0.01"
                        value={editingCategoryBasePrice}
                        onChange={(e) => setEditingCategoryBasePrice(e.target.value)}
                        placeholder="Prezzo base (€)"
                        className="w-full px-3 py-2 border border-stone-200 rounded text-sm"
                      />
                    )}
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleUpdateCategory(cat.id)} className="bg-primary text-white px-4 py-1.5 rounded text-sm">Salva</button>
                      <button onClick={() => setEditingCategory(null)} className="bg-stone-200 px-4 py-1.5 rounded text-sm">Annulla</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
                      <div className="flex gap-0.5">
                        <button onClick={() => handleMoveCategory(cat.id, 'up')} disabled={sortedCategories.findIndex(c => c.id === cat.id) === 0} className="text-stone-400 hover:text-primary disabled:opacity-20 text-xs leading-none min-w-[28px] min-h-[24px] flex items-center justify-center rounded">▲</button>
                        <button onClick={() => handleMoveCategory(cat.id, 'down')} disabled={sortedCategories.findIndex(c => c.id === cat.id) === sortedCategories.length - 1} className="text-stone-400 hover:text-primary disabled:opacity-20 text-xs leading-none min-w-[28px] min-h-[24px] flex items-center justify-center rounded">▼</button>
                      </div>
                      <h2
                        className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight cursor-pointer hover:opacity-70"
                        onClick={() => {
                          const c = categories.find(cat2 => cat2.id === cat.id)
                          if (c) {
                            setEditingCategory(c.id)
                            setEditingCategoryName(c.name)
                            setEditingCategoryType(c.section_type || 'ala_carte')
                            setEditingCategoryMenuType(c.type || 'cibo')
                            setEditingCategoryBasePrice(c.base_price?.toString() || '')
                          }
                        }}
                      >
                        {cat.name}
                      </h2>
                      {cat.base_price != null && (
                        <span className="text-primary/60 text-base sm:text-lg font-serif italic">€ {cat.base_price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-1">
                      <span className="text-xs text-stone-400">{catItems.length} piatti</span>
                      <button onClick={() => { setEditingCategory(cat.id); setEditingCategoryName(cat.name); setEditingCategoryType(cat.section_type || 'ala_carte'); setEditingCategoryMenuType(cat.type || 'cibo'); setEditingCategoryBasePrice(cat.base_price?.toString() || '') }} className="text-xs text-stone-400 hover:text-primary">Modifica</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-xs text-red-400 hover:text-red-600">Elimina</button>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
                  <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
                  <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-4 sm:space-y-5 px-2 sm:px-0">
                {catItems.map((item) => {
                  const isEditing = editingItemId === item.id

                  if (isEditing) {
                    return (
                      <div key={item.id} className="bg-white rounded-lg border border-stone-200 p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Nome *" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                          {!hasDay && (
                            <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="Prezzo (€)" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                          )}
                          {hasDay && (
                            <div className="px-3 py-2 border border-stone-200 rounded-lg text-base bg-stone-50 text-stone-600">
                              {itemForm.day || 'Nessun giorno assegnato'}
                            </div>
                          )}
                        </div>
                        <input type="text" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Descrizione (opzionale)" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base" />
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} />
                          Disponibile
                        </label>
                        {showAllergens && (
                          <div className="space-y-2">
                            <label className="block text-xs text-stone-500 font-medium">Allergeni</label>
                            <input type="text" value={itemForm.allergens} onChange={(e) => setItemForm({ ...itemForm, allergens: e.target.value })} placeholder="Glutine, Latte, Uova..." className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveItem(cat.name)} disabled={!itemForm.name.trim() || (hasDay && !itemForm.day)} className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-[#003D5A] font-semibold">Salva</button>
                          <button onClick={resetItemForm} className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300">Annulla</button>
                        </div>
                      </div>
                    )
                  }

                  // Display: same style as frontend components
                  return (
                    <div key={item.id}>
                      <div className="flex justify-between items-start gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                          {hasDay && item.day && (
                            <span className="font-serif text-primary text-xs sm:text-sm font-bold tracking-widest uppercase block mb-1">
                              {item.day}
                            </span>
                          )}
                          <h3 className={`text-sm sm:text-base md:text-lg font-serif font-semibold text-dark tracking-wide leading-snug break-words ${!item.available ? 'opacity-40' : ''}`}>
                            {item.name}
                          </h3>
                          {!isBuffet && item.description && (
                            <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm italic font-light leading-snug break-words">
                              {item.description}
                            </p>
                          )}
                          {isBuffet && item.description && (
                            <div className="mt-1 space-y-0.5">
                              {item.description.split(',').map((s, i) => (
                                <p key={i} className="text-gray-500 text-xs sm:text-sm font-light leading-snug">{s.trim()}</p>
                              ))}
                            </div>
                          )}
                        </div>
                        {!hasDay && item.price > 0 && (
                          <span className="text-sm sm:text-base md:text-lg font-serif font-semibold text-primary whitespace-nowrap flex-shrink-0">
                            €{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.allergens.map((a) => (
                            <span key={a} className="text-[10px] uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <button onClick={() => handleEditItem(item)} className="text-xs text-stone-400 hover:text-primary">Modifica</button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-xs text-red-400 hover:text-red-600">Elimina</button>
                        {!item.available && <span className="text-xs text-stone-400 italic">Non disp.</span>}
                      </div>
                      <div className="h-px bg-gray-200 mt-3 sm:mt-4" />
                    </div>
                  )
                })}
              </div>

              {/* Add item to this section */}
              {addingToCategory === cat.name && editingItemId === null ? (
                <div className="mt-4 bg-white rounded-lg border border-stone-200 p-4 space-y-3">
                  <h4 className="font-semibold text-sm text-primary">Nuovo Piatto</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Nome *" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                    {!hasDay && (
                      <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="Prezzo (€)" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                    )}
                    {hasDay && (
                      <select value={itemForm.day} onChange={(e) => setItemForm({ ...itemForm, day: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-lg text-base bg-white">
                        <option value="">Seleziona giorno</option>
                        {DAYS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input type="text" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Descrizione (opzionale)" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base" />
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} />
                    Disponibile
                  </label>
                  {showAllergens && (
                    <div className="space-y-2">
                      <label className="block text-xs text-stone-500 font-medium">Allergeni</label>
                      <input type="text" value={itemForm.allergens} onChange={(e) => setItemForm({ ...itemForm, allergens: e.target.value })} placeholder="Glutine, Latte, Uova..." className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveItem(cat.name)} disabled={!itemForm.name.trim() || (hasDay && !itemForm.day)} className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-[#003D5A] font-semibold">Aggiungi</button>
                    <button onClick={resetItemForm} className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300">Annulla</button>
                  </div>
                </div>
              ) : (
                <div className="text-center mt-4">
                  <button
                    onClick={() => { resetItemForm(); setAddingToCategory(cat.name) }}
                    className="text-primary hover:opacity-70 text-sm font-semibold"
                  >
                    + Aggiungi piatto
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {tabCategories.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-lg font-serif">Nessuna sezione in questo tab</p>
            <p className="text-sm mt-1">Clicca &quot;+ Nuova Sezione&quot; per aggiungerne una</p>
          </div>
        )}
      </section>
    </main>
  )
}
