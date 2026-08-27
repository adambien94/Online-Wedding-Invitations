import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 text-neutral-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <div className="text-2xl font-serif text-neutral-900 italic">
              Weseleo.
            </div>
            <p className="text-xs mt-2">
              Nowoczesna strona dla gości weselnych.
            </p>
          </div>
          <p className="text-xs mt-4">
            © 2026 Nasz Dzień. Wszystkie prawa zastrzeżone.
          </p>
          <div className="mt-6 md:mt-0 space-x-4">
            <Link href="/privacy" className="text-xs underline">
              Polityka prywatności
            </Link>
            <Link href="/terms" className="text-xs underline">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
