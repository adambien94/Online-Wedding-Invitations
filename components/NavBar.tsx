import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function NavBar() {
  return (
    <header className="w-full bg-white  backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-serif text-rose-900">
              Nasz Dzień
            </Link>
          </div>
          <nav className="hidden md:flex space-x-3 text-sm items-center">
            <Link
              href="#features"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              Możliwości
            </Link>
            <Link
              href="#pricing"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              Cennik
            </Link>
            <Link
              href="#faq"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                }),
              )}
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
