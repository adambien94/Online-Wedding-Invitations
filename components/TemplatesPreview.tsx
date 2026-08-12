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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5keGGvHwvja3oHg8hsAcZSVMP6YvU5ld2EJLD3ooOhQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6mrnte4yyfDXk-kWw8JuIrzaP4iLTe7HbaFJxtVmwgQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTVLQdSOno7yvPWCnXH13nLX7fBxcuiwcCNGEmyut4g&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6mrnte4yyfDXk-kWw8JuIrzaP4iLTe7HbaFJxtVmwgQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5keGGvHwvja3oHg8hsAcZSVMP6YvU5ld2EJLD3ooOhQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6mrnte4yyfDXk-kWw8JuIrzaP4iLTe7HbaFJxtVmwgQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTVLQdSOno7yvPWCnXH13nLX7fBxcuiwcCNGEmyut4g&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6mrnte4yyfDXk-kWw8JuIrzaP4iLTe7HbaFJxtVmwgQ&s=10",
  ];

  return (
    <section className="pt-12 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-serif font-base">
              Przykładowe szablony
            </h2>
            <p className="mt-2 text-muted-foreground">
              Podgląd dostępnych szablonów zaproszeń.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
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
                  <div className="h-96 overflow-hidden rounded-2xl border">
                    <img
                      src={src}
                      alt={`template-${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden lg:block" />
            <CarouselNext className="hidden lg:block" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
