"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryContentProps {
  story?: string;
  date: string;
  contentImage?: {
    src: string;
    alt: string;
  };
}

export default function StoryContent({
  story,
  date,
  contentImage,
}: StoryContentProps) {
  if (!story) return null;

  const paragraphs = story
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="w-full">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] border border-[#8b1235]/10 bg-[#fffaf8] px-6 py-8 shadow-xl sm:px-10"
      >
        <header className="text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8b1235]/45">
            The Memory
          </p>

          <p className="mt-3 font-serif text-xs tracking-[0.2em] text-[#8b1235]/40">
            {date}
          </p>

          <div className="mx-auto mt-4 h-px w-10 bg-[#8b1235]/15" />
        </header>

        <div className="mt-8 space-y-5">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={
                index === 0
                  ? "font-serif text-xl leading-relaxed text-[#68152f] sm:text-2xl"
                  : "text-sm leading-7 text-[#68152f]/65 sm:text-base sm:leading-8"
              }
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {contentImage && (
          <div className="mt-8 overflow-hidden rounded-[18px]">
            <Image
              src={contentImage.src}
              alt={contentImage.alt}
              width={1200}
              height={800}
              sizes="(max-width: 640px) 100vw, 768px"
              className=" object-cover"
            />
          </div>
        )}
      </motion.article>
    </section>
  );
}