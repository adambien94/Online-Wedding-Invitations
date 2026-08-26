import React from "react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function TemplatesPreview() {
  const images = [
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
    "/phone-front.png",
  ];

  return (
    <section className="pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>
            <h2 className="text-4xl font-serif font-base">
              Przykładowe szablony
            </h2>
            <p className="mt-2 text-neutral-900">
              Podgląd dostępnych szablonów zaproszeń.
            </p>
          </div>

          <Link
            href="/register"
            className="mb-8 inline-flex items-center justify-center bg-neutral-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-neutral-700"
          >
            Zobacz wszystkie
          </Link>
        </div>

        <div className="mt-2 relative">
          <Carousel>
            <CarouselContent className="items-start pb-12 pt-4">
              {images.map((src, idx) => (
                <CarouselItem
                  key={src}
                  className="basis-full lg:basis-1/5 bg-rose-50 mx-4 text-center pr-3 pt-5"
                >
                  <div className="h-64 overflow-hidden rounded-2xl">
                    {/* <p className="pt-3 text-sm text-left">Klasyczny</p> */}
                    <img
                      src={src}
                      alt={`template-${idx + 1}`}
                      className="w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="max-lg:hidden" />
            <CarouselNext className="max-lg:hidden" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
