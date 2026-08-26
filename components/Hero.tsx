import Link from "next/link";
import { ChevronRight } from "lucide-react";

const reactions = [
  "Nie mogę się doczekać",
  "Będzie pięknie!",
  "Tak!",
  "Brawooo",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-mauve-400 via-mauve-500 to-mauve-400">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-0">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white sm:text-sm">
            Weseleo <span className="font-bold">strona wesela</span>
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Wesele jakiego jeszcze psia mać nie było
          </h1>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition hover:bg-mauve-300"
          >
            Stwórz stronę wesela
          </Link>
        </div>

        <div className="relative flex items-end justify-center lg:justify-end top-32">
          <div className="relative w-full max-w-85 sm:max-w-120">
            <img
              src="/phone.png"
              alt="Podgląd galerii gości na telefonie"
              className="relative z-10 mx-auto w-[78%] -left-4 drop-shadow-2xl lg:w-[85%]"
            />

            <div className="absolute top-[18%] -right-20 z-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="relative rounded-2xl bg-white px-4 py-2 text-xs font-medium text-neutral-800 shadow-lg sm:text-sm">
                weseleo.pl/ania-tomek
              </div>
            </div>

            <div className="absolute top-[28%] right-0 z-20 flex flex-col items-end gap-2 sm:-right-20">
              {reactions.map((text, i) => (
                <div
                  key={text}
                  className="animate-in shadow-lg fade-in slide-in-from-bottom-2 rounded-2xl border border-white/50 bg-white/20 px-4 py-2 text-xs text-white backdrop-blur-sm duration-500 fill-mode-both sm:text-sm"
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* <button
            type="button"
            aria-label="Następny slajd"
            className="absolute top-1/2 right-0 z-30 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-700 shadow-md transition hover:bg-orange-50 lg:flex xl:-right-2"
          >
            <ChevronRight className="size-5" />
          </button> */}
        </div>
      </div>
    </section>
  );
}
