"use client";

import { useEffect, useRef, useState } from "react";
import { Memory } from "@/data/memories";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MemoryCarouselProps {
  memories: Memory[];
}

export default function MemoryCarousel({ memories }: MemoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const router = useRouter();

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const nextSlide = () => {
    if (currentIndex === memories.length - 1) return;
    setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // ===== دوال اللمس =====
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleReadStory = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/inf/${slug}`);
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto"
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center center",
      }}
    >
      <div
        className="relative flex items-center justify-center min-h-[400px] md:min-h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {memories.map((memory, index) => {
          const offset = index - currentIndex;

          const isActive = offset === 0;

          const isLeft =
            offset === -1 ||
            (currentIndex === 0 && index === memories.length - 1);

          const isRight =
            offset === 1 ||
            (currentIndex === memories.length - 1 && index === 0);

          let scale = 0.6;
          let rotateY = 0;
          let translateX = 0;
          let translateZ = -200;
          let opacity = 0.3;
          let zIndex = 1;

          if (isActive) {
            scale = 1;
            rotateY = 0;
            translateX = 0;
            translateZ = 0;
            opacity = 1;
            zIndex = 10;
          } else if (isLeft) {
            scale = 0.7;
            rotateY = 30;
            translateX = -180;
            translateZ = -100;
            opacity = 0.6;
            zIndex = 5;
          } else if (isRight) {
            scale = 0.7;
            rotateY = -30;
            translateX = 180;
            translateZ = -100;
            opacity = 0.6;
            zIndex = 5;
          } else {
            scale = 0.5;
            rotateY = 0;
            translateX = 0;
            translateZ = -300;
            opacity = 0.2;
            zIndex = 0;
          }

          return (
            <div
              key={memory.id}
              className="absolute transition-[transform,opacity] duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",

                // Fix for mobile 3D compositing
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform, opacity",

                width: "320px",
                height: "400px",
              }}
              onClick={() => {
                if (!isActive) {
                  goToSlide(index);
                }
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                <Image
                  src={memory.image}
                  alt={memory.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ruby/70 via-ruby/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-heading text-2xl font-bold">
                    {memory.title}
                  </h3>

                  <p className="font-body text-white/80 text-sm mt-1">
                    {memory.date}
                  </p>

                  {isActive && (
                    <button
                      onClick={(e) => handleReadStory(memory.slug, e)}
                      className="mt-3 inline-block px-4 py-2 rounded-full glass border border-white/30 text-sm font-heading cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20"
                    >
                      Tap to Read Story
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {memories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-ruby"
                : "w-2 bg-ruby/30 hover:bg-ruby/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}