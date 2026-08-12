import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <div className="text-2xl text-white font-serif">Nasz Dzień</div>
            <p className="text-xs mt-2">
              Nowoczesna strona dla gości weselnych.
            </p>

            <p className="text-xs mt-4">
              © 2026 Nasz Dzień. Wszystkie prawa zastrzeżone.
            </p>
          </div>
          <div className="mt-6 md:mt-0 space-x-4">
            <Link href="/privacy" className="text-white text-xs underline">
              Polityka prywatności
            </Link>
            <Link href="/terms" className="text-white text-xs underline">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
