"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Memory } from "@/data/memories";

interface MemoryCardProps {
  memory: Memory;
  isCenter?: boolean;
}

export default function MemoryCard({
  memory,
  isCenter = false,
}: MemoryCardProps) {
  const router = useRouter();

  const handleReadStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Button clicked:", memory.slug);
    router.push(`/inf/${memory.slug}`);
  };

  // دعم إضافي للموبايل عشان يتجاوز أي تعارض من الـ Carousel
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // يمنع المتصفح من انتظار حركة السحب (swipe)
    e.stopPropagation();
    console.log("Touch ended:", memory.slug);
    router.push(`/inf/${memory.slug}`);
  };

  return (
    <div
      className={`
        relative w-full aspect-4/5 rounded-2xl overflow-hidden
        transition-all duration-300
        ${isCenter ? "shadow-strong hover:shadow-strong" : "shadow-soft"}
        glass-strong border border-white/20 backdrop-blur-lg
        group
      `}
    >
      <div className="relative w-full h-full select-none">
        <Image
          src={memory.image}
          alt={memory.title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Overlay + Button */}
      <div
        className="
          absolute inset-0
          bg-linear-to-t from-ruby/80 via-ruby/30 to-transparent
          flex items-end justify-center pb-8 md:pb-12
          transition-opacity duration-300
          opacity-100 md:opacity-0
          md:group-hover:opacity-100
          pointer-events-none
        "
      >
        <button
          onClick={handleReadStory}
          onTouchEnd={handleTouchEnd}
          className="
            font-heading text-white text-lg md:text-xl
            px-6 py-3 rounded-full glass
            transition-all duration-300
            transform active:scale-95 md:group-hover:scale-105
            border border-white/30
            pointer-events-auto cursor-pointer
            relative z-10
            touch-action:manipulation
          "
          type="button"
        >
          Tap to Read Story
        </button>
      </div>
    </div>
  );
}