import { createClient } from '@/lib/supabase-server'
import MenuSection from '@/components/MenuSection'

interface MenuItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number
  available: boolean
}

interface Category {
  name: string
  order: number
}

export const dynamic = 'force-dynamic'

export default async function MenuCiboPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('category_order')
    .select('name, order')
    .eq('type', 'cibo')
    .order('order', { ascending: true })

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)

  const groupedMenu = (menuItems || []).reduce((acc, item: MenuItem) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const { data: { session } } = await supabase.auth.getSession()

  const orderedCategories = (categories || []).map((c: Category) => ({
    name: c.name,
    items: groupedMenu[c.name] || []
  })).filter(c => c.items.length > 0)

  return (
    <main className="min-h-screen bg-cream">
      {session && (
        <div className="bg-dark text-white py-2 px-3 text-center text-xs sm:text-sm flex flex-col sm:flex-row justify-between items-center gap-1">
          <span>Modalità admin</span>
          <a href="/admin/dashboard" className="text-secondary hover:text-white underline">Torna all'editor →</a>
        </div>
      )}
      <header className="bg-primary text-white py-5 sm:py-6 px-4 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 sm:h-20 md:h-24 lg:h-28 mx-auto mb-1" />
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary">Menu Cucina</p>
      </header>

      <nav className="bg-secondary/20 px-4 py-3 text-center sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
          <a href="/menu/cibo" className="text-primary font-semibold border-b-2 border-primary pb-1 text-sm sm:text-base">Cucina</a>
          <a href="/menu/vini" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base">Vini & Bevande</a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8 md:py-12">
        {orderedCategories.length === 0 ? (
          <p className="text-center text-gray-500 text-sm sm:text-base md:text-lg px-4">Menu in aggiornamento, torna presto!</p>
        ) : (
          orderedCategories.map(({ name, items }) => (
            <MenuSection key={name} category={name} items={items} />
          ))
        )}
      </section>

    </main>
  )
}
