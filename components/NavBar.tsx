import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function NavBar() {
  return (
    <header className="w-full bg-white  backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center">
            {/* <Link href="/" className="text-4xl font-serif text-rose-900">
              Weseleo
            </Link> */}
          </div>
          <nav className="hidden  w-full md:flex space-x-3 text-sm items-center justify-between">
            {/* <div>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                Możliwości
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                Cennik
              </Link>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                FAQ
              </Link>
            </div> */}
            <Link
              href="/"
              className="text-2xl font-serif text-neutral-900 italic"
            >
              Weseleo.
            </Link>

            <div className="space-x-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                )}
              >
                Zaloguj się
              </Link>
              <Link href="/register" className={cn(buttonVariants({}))}>
                Załóż konto
              </Link>
            </div>
          </nav>
          <div className="md:hidden">{/* mobile menu placeholder */}</div>
        </div>
      </div>
    </header>
  );
}
