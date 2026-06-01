import { Montserrat } from 'next/font/google'
import { menuIside } from '@/lib/data/menu-iside'
import MenuPageLayout from '@/components/menu/MenuPageLayout'
import type { MenuCategory } from '@/lib/data/menu-iside'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

const categoryLabels: Record<MenuCategory, string> = {
  aperitivo: 'Aperitivo',
  primi: 'Primi',
  carne: 'Carne',
  fritti: 'Fritti',
  contorni: 'Contorni',
  bevande: 'Bevande',
}

const categoryIcons: Record<MenuCategory, string> = {
  aperitivo: '🍸',
  primi: '🍝',
  carne: '🥩',
  fritti: '🍤',
  contorni: '🥗',
  bevande: '🍷',
}

export default function MenuIsidePage() {
  const categories = Object.keys(menuIside) as MenuCategory[]

  return (
    <MenuPageLayout
      title="Menu Buffet ISIDE"
      subtitle="Seleziona il tuo buffet: ogni categoria offre una varietà di piatti pensati per rendere il tuo evento speciale."
      navItems={[
        { href: '/menu/bar', label: 'Bar & Colazione' },
        { href: '/menuristorante', label: 'Ristorante' },
        { href: '/menu/vini', label: 'Vini & Bevande' },
        { href: '/menu/proteico', label: 'Menu Proteico' },
        { href: '/menueventi', label: 'Menu Eventi' },
        { href: '/menu/iside', label: 'Buffet ISIDE', active: true },
      ]}
    >
      <div className="space-y-10 sm:space-y-12 md:space-y-16">
        {categories.map((category) => (
          <section key={category}>
            <div className="text-center mb-6 sm:mb-8 px-2">
              <span className="text-3xl sm:text-4xl md:text-5xl">{categoryIcons[category]}</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-primary tracking-wide leading-tight mt-2">
                {categoryLabels[category]}
              </h2>
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2">
                <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
                <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
                <div className="h-px bg-secondary/50 w-10 sm:w-12 md:w-16" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {menuIside[category].map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-secondary/10 px-4 py-3 sm:px-5 sm:py-4 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm sm:text-base md:text-lg font-serif text-dark tracking-wide leading-snug">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center pt-4 pb-2">
          <p className="text-sm text-gray-400 italic">
            * Il menu può variare in base alla disponibilità del momento.
          </p>
        </div>
      </div>
    </MenuPageLayout>
  )
}
