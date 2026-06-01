import Link from 'next/link'
import type { ReactNode } from 'react'

type MenuNavItem = {
  href: string
  label: string
  active?: boolean
}

interface MenuPageLayoutProps {
  title: string
  subtitle?: string
  navItems?: MenuNavItem[]
  customNav?: ReactNode
  banner?: ReactNode
  children: ReactNode
}

export default function MenuPageLayout({ title, subtitle, navItems, customNav, banner, children }: MenuPageLayoutProps) {
  return (
    <main className="min-h-screen bg-cream">
      {banner}
      <header className="bg-primary text-white py-6 px-4 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 sm:h-20 md:h-24 lg:h-28 mx-auto mb-2" />
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary">{title}</p>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-slate-200 max-w-2xl mx-auto sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </header>

      {customNav && (
        <div className="fixed bottom-0 left-0 right-0 z-10 sm:static sm:z-auto">{customNav}</div>
      )}
      {navItems && navItems.length > 0 && !customNav && (
        <nav className="bg-[#ECE4D4] px-4 py-3 text-center fixed bottom-0 left-0 right-0 z-10 sm:static sm:z-auto sm:sticky sm:top-0 sm:z-10 sm:bg-secondary/20 backdrop-blur-sm border-b border-secondary/20">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.active
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1 text-sm sm:text-base'
                    : 'text-gray-600 hover:text-primary transition-colors text-sm sm:text-base'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <section className="max-w-4xl mx-auto px-4 py-10 pb-24 sm:px-6 sm:py-12 sm:pb-12">
        {children}
      </section>
    </main>
  )
}
