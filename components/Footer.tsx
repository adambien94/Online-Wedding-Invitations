import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-rose-900 text-rose-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <div className="text-2xl font-serif">Nasz Dzień</div>
            <p className="text-sm mt-2">© 2026 Nasz Dzień. Wszystkie prawa zastrzeżone.</p>
          </div>
          <div className="mt-6 md:mt-0 space-x-4">
            <Link href="/privacy" className="text-sm hover:underline">Polityka prywatności</Link>
            <Link href="/terms" className="text-sm hover:underline">Regulamin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
