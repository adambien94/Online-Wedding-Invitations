import { Button } from "@/components/ui/button";
import InviteForm from "./InviteForm";

export default function Hero() {
  return (
    <section className="bg-[url('https://naszdzien.app/nasz-dzien-hero.webp')] bg-cover bg-left lg:bg-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="lg:py-16">
            <p className="text-xs lg:text-md tracking-widest text-rose-900 font-medium">
              — CYFROWA OPIEKA WASZEGO WESELA
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-base text-gray-900">
              Nasz Dzień
            </h1>
            {/* <p className="mt-4 lg:text-2xl text-neutral-900">
              Jedna piękna strona dla wszystkich gości
            </p> */}
            <p className="mt-4 lg:text-lg text-muted-foreground">
              Jedna piękna strona dla wszystkich gości — zdjęcia, harmonogram,
              menu i więcej.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="bg-rose-900 text-white px-6 w-full lg:w-auto"
                size="lg"
              >
                Stwórz stronę wesela
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 w-full lg:w-auto bg-white"
              >
                Zobacz możliwości
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-6">
              <span className="text-neutral-900 font-bold">od 199zł</span> /{" "}
              <span>miesiąc</span>
            </div>
          </div>
          <div className="lg:ml-auto">{/* <InviteForm /> */}</div>
        </div>
      </div>
    </section>
  );
}
