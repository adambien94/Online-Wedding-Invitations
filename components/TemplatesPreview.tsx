import React from "react";
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
    <section className="pt-16 pb-1 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>
            <h2 className="text-4xl font-serif font-base">
              Przykładowe szablony
            </h2>
            <p className="mt-2 text-muted-foreground">
              Podgląd dostępnych szablonów zaproszeń.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-4 mb-6 w-full lg:w-auto px-6"
          >
            Zobacz wszystkie szablony
          </Button>
        </div>

        <div className="mt-2 relative">
          <Carousel>
            <CarouselContent className="items-start pb-12 pt-4">
              {images.map((src, idx) => (
                <CarouselItem key={src} className="basis-full lg:basis-1/5">
                  <div className="h-96 overflow-hidden rounded-2xl">
                    <img
                      src={src}
                      alt={`template-${idx + 1}`}
                      className="w-full h-full object-cover"
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
