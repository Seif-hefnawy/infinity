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
    e.stopPropagation(); // منع أي تأثير على العناصر الأب
    console.log("Button clicked:", memory.slug);
    router.push(`/inf/${memory.slug}`);
  };

  return (
    <div
      className={`
        relative w-full aspect-4/5 rounded-2xl overflow-hidden
        transition-all duration-300
        ${isCenter ? "shadow-strong hover:shadow-strong" : "shadow-soft"}
        glass-strong border border-white/20 backdrop-blur-lg
      `}
    >
      {/* الصورة - غير قابلة للضغط */}
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

      {/* Overlay مع الزر - الزر هو العنصر الوحيد القابل للضغط */}
      <div
        className="
          absolute inset-0
          bg-linear-to-t from-ruby/80 via-ruby/30 to-transparent
          flex items-end justify-center pb-8 md:pb-12
          transition-opacity duration-300
          group-hover:opacity-100 opacity-0
          pointer-events-none
        "
      >
        <button
          onClick={handleReadStory}
          className="
            font-heading text-white text-lg md:text-xl
            px-6 py-3 rounded-full glass
            transition-all duration-300
            transform group-hover:scale-105
            border border-white/30
            pointer-events-auto cursor-pointer
            relative z-10
          "
          type="button"
        >
          Tap to Read Story
        </button>
      </div>
    </div>
  );
}