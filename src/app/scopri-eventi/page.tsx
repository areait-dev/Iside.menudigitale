import Link from 'next/link'
import { montserrat } from '@/lib/font-family'

export default function ScopriEventiPage() {
  return (
    <main className={`${montserrat.className} min-h-screen bg-cream`}>
      <header className="bg-primary text-white py-8 text-center">
        <img src="/logo.png" alt="Logo" className="h-24 sm:h-32 md:h-40 mx-auto mb-2" />
        <p className="text-xl text-secondary">Scopri il Menu Eventi</p>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif text-dark mb-6">Benvenuto</h2>
        <p className="text-lg text-gray-700 mb-8">
          Esplora il menu eventi con tutte le proposte dedicate ai tuoi momenti speciali.
        </p>
        <Link
          href="/menu/eventi"
          className="inline-block bg-primary text-white px-10 py-5 rounded-lg text-xl font-semibold hover:bg-[#003D5A] transition-colors shadow-lg"
        >
          Scopri il Menu Eventi
        </Link>
      </section>
    </main>
  )
}
