import { useState } from "react";

const items = [
  {
    title: "Galeria od pary młodej i gości",
    desc: "Zdjęcia i filmy przesyłane prosto z telefonu — goście dodają wspomnienia na bieżąco, a Wy macie wszystko w jednym miejscu.",
  },
  {
    title: "Plan dnia",
    desc: "Harmonogram, karta dań i karta drinków w czytelnej formie, żeby każdy wiedział, co dzieje się dalej.",
  },
  {
    title: "Dojazd na imprezę",
    desc: "Adres kościoła i sali z nawigacją — goście dojadą bez telefonowania i dopytywania o drogę.",
  },
  {
    title: "Prosty panel",
    desc: "Zarządzanie treścią i zdjęciami bez pomocy technicznej. Edytujesz wszystko sami, kiedy chcecie.",
  },
];

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className=" bg-mauve-100">
      <div className="max-w-[1440px] mx-auto grid  gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8  lg:pt-18 lg:pb-12 relative">
        <div className="lg:col-span-4">
          <h2 className="text-4xl font-serif leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Goście wiedzą, co dzieje się dalej
          </h2>

          <div
            className="mt-14 flex flex-col gap-3"
            role="tablist"
            aria-label="Funkcje"
          >
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(index)}
                  className={`w-full rounded-xl px-5 py-4 text-left font-medium text-md transition-colors ${
                    isActive
                      ? "border border-neutral-900 bg-white  text-neutral-900 shadow-xs"
                      : "border border-gray-400 bg-mauve-100 text-neutral-700 hover:bg-mauve-200"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end lg:col-span-4 relative">
          <p
            key={active}
            className="max-w-xs font-serif animate-in fade-in duration-300 text-left leading-relaxed text-neutral-800"
            role="tabpanel"
          >
            {items[active].desc}
          </p>
        </div>

        <div className="absolute  right-5 bottom-6 w-90 overflow-hidden rounded-2xl shadow-xl">
          <img src="tab1.png" alt="" className="scale-105" />
        </div>

        <div className="absolute  -right-5 bottom-65 w-90 overflow-hidden rounded-2xl shadow-xl">
          <img src="tab1.png" alt="" className="scale-105" />
        </div>

        <div className="absolute  -right-25 bottom-30 w-100 overflow-hidden rounded-2xl shadow-xl">
          <img src="tab2.png" alt="" className="scale-105" />
        </div>

        <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
