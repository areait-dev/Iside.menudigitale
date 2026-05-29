import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary text-white py-8 text-center">
        <img src="/logo.png" alt="Logo" className="h-24 sm:h-32 md:h-40 mx-auto mb-2" />
        <p className="text-xl text-secondary">Menu Digitale</p>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif text-dark mb-6">Benvenuti</h2>
        <p className="text-lg text-gray-700 mb-8">
          Scopri il nostro menu e lasciati conquistare dai sapori autentici della nostra cucina.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu/cibo"
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#003D5A] transition-colors"
          >
            Menu Cucina
          </Link>
          <Link
            href="/menu/vini"
            className="bg-secondary text-dark px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#B89650] transition-colors"
          >
            Menu Vini & Bevande
          </Link>
        </div>
      </section>

    </main>
  )
}
