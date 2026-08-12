import Link from "next/link";

export default function NavBar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif text-rose-900">
              Nasz Dzień
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm items-center">
            <Link
              href="#features"
              className="text-gray-700 hover:text-rose-600"
            >
              Możliwości
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-rose-600">
              Cennik
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-rose-600">
              FAQ
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-rose-900 text-white text-sm"
            >
              Zaloguj
            </Link>
          </nav>
          <div className="md:hidden">{/* mobile menu placeholder */}</div>
        </div>
      </div>
    </header>
  );
}
