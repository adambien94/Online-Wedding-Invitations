import { Button } from "@/components/ui/button";
import InviteForm from "./InviteForm";

export default function Hero() {
  return (
    <section className="bg-gray-100 bg-cover bg-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm text-rose-900 font-medium">
              CYFROWA OPIEKA WASZEGO WESELA
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-base text-gray-900">
              Nasz Dzień
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Jedna piękna strona dla wszystkich gości — zdjęcia, harmonogram,
              menu i więcej.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="bg-rose-900 text-white" size="lg">
                Stwórz stronę wesela
              </Button>
              <Button variant="outline" size="lg">
                Zobacz możliwości
              </Button>
            </div>
          </div>
          <div className="lg:ml-auto">
            <InviteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
