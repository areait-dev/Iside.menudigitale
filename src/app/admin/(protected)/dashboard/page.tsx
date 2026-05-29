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
}

interface Category {
  id: string
  name: string
  section_type?: string | null
  base_price?: number | null
  order: number
}

const SECTION_TYPES = [
  { value: 'ala_carte', label: 'Standard' },
  { value: 'weekly', label: 'Settimanale (Menu Proteico)' },
  { value: 'buffet', label: 'Buffet (Young Menu)' },
] as const

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryType, setEditingCategoryType] = useState('ala_carte')
  const [editingCategoryBasePrice, setEditingCategoryBasePrice] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState('ala_carte')
  const [newCategoryBasePrice, setNewCategoryBasePrice] = useState('')
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [openCategoryForAdd, setOpenCategoryForAdd] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', day: '', available: true })

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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), -1)
    const payload: Record<string, unknown> = {
      name: newCategoryName.trim(),
      section_type: newCategoryType,
      order: maxOrder + 1,
    }
    if (newCategoryType === 'weekly' && newCategoryBasePrice) {
      payload.base_price = parseFloat(newCategoryBasePrice)
    }
    const { data } = await supabase.from('category_order').insert([payload]).select().single()
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
    }
    if (editingCategoryType === 'weekly' && editingCategoryBasePrice) {
      payload.base_price = parseFloat(editingCategoryBasePrice)
    } else {
      payload.base_price = null
    }
    await supabase.from('category_order').update(payload).eq('id', id)
    if (editingCategoryName.trim() !== old.name) {
      await supabase.from('menu_items').update({ category: editingCategoryName.trim() }).eq('category', old.name)
    }
    setCategories(categories.map(c => c.id === id ? { ...c, ...payload, base_price: payload.base_price ?? null } as Category : c))
    setMenuItems(menuItems.map(i => i.category === old.name ? { ...i, category: editingCategoryName.trim() } : i))
    setEditingCategory(null)
  }

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat.id)
    setEditingCategoryName(cat.name)
    setEditingCategoryType(cat.section_type || 'ala_carte')
    setEditingCategoryBasePrice(cat.base_price?.toString() || '')
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

  const handleSaveItem = async (category: string) => {
    if (!itemForm.name.trim()) return
    const cat = categories.find(c => c.name === category)
    const isWeekly = cat?.section_type === 'weekly'
    const data: Record<string, unknown> = {
      category,
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || null,
      price: itemForm.price ? parseFloat(itemForm.price) : 0,
      available: itemForm.available,
    }
    if (isWeekly && itemForm.day) {
      data.day = itemForm.day
    } else {
      data.day = null
    }
    if (editingItemId) {
      await supabase.from('menu_items').update(data).eq('id', editingItemId)
    } else {
      await supabase.from('menu_items').insert([data])
    }
    resetItemForm()
    fetchData()
  }

  const handleEditItem = (item: MenuItem) => {
    const cat = categories.find(c => c.name === item.category)
    setEditingItemId(item.id)
    setOpenCategoryForAdd(item.category)
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price > 0 ? item.price.toString() : '',
      day: cat?.section_type === 'weekly' ? (item.day || '') : '',
      available: item.available,
    })
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Eliminare questo piatto?')) return
    await supabase.from('menu_items').delete().eq('id', id)
    fetchData()
  }

  const resetItemForm = () => {
    setEditingItemId(null)
    setOpenCategoryForAdd(null)
    setItemForm({ name: '', description: '', price: '', day: '', available: true })
  }

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/admin/login' }

  if (loading) return <div className="min-h-screen bg-iside flex items-center justify-center"><p className="text-xl font-montserrat">Caricamento...</p></div>

  return (
    <main className="min-h-screen bg-iside">
      <header className="bg-iside-primary text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">I</div>
          <span className="text-lg sm:text-xl font-bold tracking-wider hidden sm:inline">Editor Menu</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/menu" className="text-white/70 hover:text-white text-sm">Vedi Menu Pubblico</Link>
          <button onClick={handleLogout} className="text-red-300 hover:text-red-200 text-sm">Esci</button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-iside-primary">Tutte le Sezioni</h2>
          <button onClick={() => setShowAddCategory(true)} className="bg-iside-primary text-white px-4 py-2 rounded-lg hover:bg-iside-primary/90 text-sm font-semibold">+ Nuova Sezione</button>
        </div>

        {showAddCategory && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-4 space-y-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome sezione (es. Antipasti, Vini...)"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base"
              autoFocus
            />
            <select
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base bg-white"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {newCategoryType === 'weekly' && (
              <input
                type="number"
                step="0.01"
                value={newCategoryBasePrice}
                onChange={(e) => setNewCategoryBasePrice(e.target.value)}
                placeholder="Prezzo base (€, es. 5.50)"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-base"
              />
            )}
            <div className="flex gap-2">
              <button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="bg-iside-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-iside-primary/90 font-semibold">Aggiungi</button>
              <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); setNewCategoryType('ala_carte'); setNewCategoryBasePrice('') }} className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300">Annulla</button>
            </div>
          </div>
        )}

        {sortedCategories.map((cat, idx) => {
          const catItems = groupedMenu[cat.name] || []
          const isWeekly = cat.section_type === 'weekly'

          return (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-stone-100 mb-4 overflow-hidden">
              <div className="bg-iside px-4 py-3 flex items-center justify-between border-b border-stone-200">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMoveCategory(cat.id, 'up')} disabled={idx === 0} className="text-stone-400 hover:text-iside-primary disabled:opacity-20 text-xs leading-none min-w-[36px] min-h-[28px] flex items-center justify-center rounded">▲</button>
                    <button onClick={() => handleMoveCategory(cat.id, 'down')} disabled={idx === sortedCategories.length - 1} className="text-stone-400 hover:text-iside-primary disabled:opacity-20 text-xs leading-none min-w-[36px] min-h-[28px] flex items-center justify-center rounded">▼</button>
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingCategory === cat.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="font-bold text-base px-2 py-1 border border-stone-200 rounded w-full"
                          autoFocus
                        />
                        <select
                          value={editingCategoryType}
                          onChange={(e) => setEditingCategoryType(e.target.value)}
                          className="w-full px-2 py-1 border border-stone-200 rounded text-sm bg-white"
                        >
                          {SECTION_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                        {editingCategoryType === 'weekly' && (
                          <input
                            type="number"
                            step="0.01"
                            value={editingCategoryBasePrice}
                            onChange={(e) => setEditingCategoryBasePrice(e.target.value)}
                            placeholder="Prezzo base (€)"
                            className="w-full px-2 py-1 border border-stone-200 rounded text-sm"
                          />
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateCategory(cat.id)} className="bg-iside-primary text-white px-3 py-1 rounded text-sm">Salva</button>
                          <button onClick={() => setEditingCategory(null)} className="bg-stone-200 px-3 py-1 rounded text-sm">Annulla</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="font-bold text-iside-primary text-base cursor-pointer hover:opacity-70"
                            onClick={() => startEditCategory(cat)}
                          >
                            {cat.name}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isWeekly ? 'bg-amber-100 text-amber-700' :
                            cat.section_type === 'buffet' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-stone-100 text-stone-500'
                          }`}>
                            {isWeekly ? 'Settimanale' : cat.section_type === 'buffet' ? 'Buffet' : 'Standard'}
                          </span>
                          {cat.base_price != null && (
                            <span className="text-xs text-stone-400">€ {cat.base_price.toFixed(2)}</span>
                          )}
                          <span className="text-stone-400 text-xs">({catItems.length} piatti)</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setOpenCategoryForAdd(openCategoryForAdd === cat.name ? null : cat.name)} className="text-iside-primary hover:opacity-70 text-sm font-semibold">+ Aggiungi</button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-sm">Elimina</button>
                </div>
              </div>

              {openCategoryForAdd === cat.name && (
                <div className="p-4 bg-stone-50 border-b border-stone-200">
                  <h4 className="font-semibold text-sm text-iside-primary mb-3">{editingItemId ? 'Modifica Piatto' : 'Nuovo Piatto'}</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Nome *" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                    {!isWeekly && (
                      <input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="Prezzo (€)" className="px-3 py-2 border border-stone-200 rounded-lg text-base" />
                    )}
                    {isWeekly && (
                      <select value={itemForm.day} onChange={(e) => setItemForm({ ...itemForm, day: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-lg text-base bg-white">
                        <option value="">Seleziona giorno</option>
                        {DAYS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input type="text" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Descrizione (opzionale)" className="w-full px-3 py-2 border border-stone-200 rounded-lg mb-3 text-base" />
                  <label className="flex items-center gap-2 cursor-pointer text-sm mb-3">
                    <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} />
                    Disponibile
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveItem(cat.name)} disabled={!itemForm.name.trim() || (isWeekly && !itemForm.day)} className="bg-iside-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-iside-primary/90 font-semibold">{editingItemId ? 'Salva' : 'Aggiungi'}</button>
                    <button onClick={resetItemForm} className="bg-stone-200 px-4 py-2 rounded-lg hover:bg-stone-300">Annulla</button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-stone-100">
                {catItems.map((item) => {
                  const itemCat = categories.find(c => c.name === item.category)
                  const itemIsWeekly = itemCat?.section_type === 'weekly'

                  return (
                    <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {itemIsWeekly && item.day && (
                            <span className="text-xs font-bold text-iside-primary uppercase min-w-[60px]">{item.day}</span>
                          )}
                          <span className={`font-medium text-sm ${!item.available ? 'opacity-40' : ''}`}>{item.name}</span>
                          {!item.available && <span className="text-xs text-stone-400 italic">Non disp.</span>}
                        </div>
                        {item.description && <p className="text-xs text-stone-500 italic mt-0.5">{item.description}</p>}
                      </div>
                      {item.price > 0 && (
                        <span className="font-bold text-iside-primary text-sm mr-4 whitespace-nowrap">€{item.price.toFixed(2)}</span>
                      )}
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleEditItem(item)} className="text-iside-primary hover:opacity-70 text-sm">Modifica</button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">Elimina</button>
                      </div>
                    </div>
                  )
                })}
                {catItems.length === 0 && (
                  <div className="px-4 py-6 text-center text-stone-400 text-sm italic">Nessun piatto. Clicca &quot;+ Aggiungi&quot; per aggiungere.</div>
                )}
              </div>
            </div>
          )
        })}

        {sortedCategories.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p className="text-lg">Nessuna sezione creata</p>
            <p className="text-sm mt-1">Clicca &quot;Nuova Sezione&quot; per iniziare</p>
          </div>
        )}
      </section>
    </main>
  )
}
