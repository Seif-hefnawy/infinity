"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface StoryContentProps {
  story?: string | null;
  date: string;

  // Up to 3 in-story images.
  contentImages?: {
    src: string;
    alt: string;
  }[];
}

export default function StoryContent({
  story,
  date,
  contentImages,
}: StoryContentProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!story) return null;

  const paragraphs = story
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const images = contentImages ?? [];

  const showNextImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex(
      (current) => (current + 1) % images.length
    );
  };

  const showPreviousImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex(
      (current) =>
        (current - 1 + images.length) % images.length
    );
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number } }
  ) => {
    if (images.length <= 1) return;

    const swipeThreshold = 50;

    if (info.offset.x < -swipeThreshold) {
      showNextImage();
    } else if (info.offset.x > swipeThreshold) {
      showPreviousImage();
    }
  };

  return (
    <section className="w-full">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] border border-[#8b1235]/10 bg-[#fffaf8] px-6 py-8 shadow-xl sm:px-10"
      >
        {/* ================= HEADER ================= */}

        <header className="text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8b1235]/45">
            The Memory
          </p>

          <p className="mt-3 font-serif text-xs tracking-[0.2em] text-[#8b1235]/40">
            {date}
          </p>

          <div className="mx-auto mt-4 h-px w-10 bg-[#8b1235]/15" />
        </header>

        {/* ================= STORY TEXT ================= */}

        <div className="mt-8 space-y-5">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
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

        {/* ================= PHOTO STACK ================= */}

        {images.length > 0 && (
          <div className="mt-10">
            <div className="relative mx-auto w-full max-w-[520px] pb-9">
              <div className="relative aspect-[4/5] w-full">
                {images.map((_, depth) => {
                  const imageIndex =
                    (activeImageIndex + depth) % images.length;

                  const image = images[imageIndex];

                  const isFront = depth === 0;

                  let x = 0;
                  let y = 0;
                  let rotate = 0;
                  let scale = 1;

                  if (depth === 1) {
                    x = 10;
                    y = 15;
                    rotate = 2.5;
                    scale = 0.97;
                  }

                  if (depth === 2) {
                    x = -10;
                    y = 27;
                    rotate = -2.5;
                    scale = 0.94;
                  }

                  return (
                    <motion.div
                      key={`${image.src}-${imageIndex}`}
                      animate={{
                        x,
                        y,
                        rotate,
                        scale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 25,
                      }}
                      drag={isFront && images.length > 1 ? "x" : false}
                      dragConstraints={{
                        left: 0,
                        right: 0,
                      }}
                      dragElastic={0.18}
                      onDragEnd={
                        isFront
                          ? handleDragEnd
                          : undefined
                      }
                      onClick={
                        isFront && images.length > 1
                          ? showNextImage
                          : undefined
                      }
                      style={{
                        zIndex: images.length - depth,
                      }}
                      className={`absolute inset-0 overflow-hidden rounded-[22px] border border-[#8b1235]/10 bg-[#f8eceb] shadow-xl ${
                        isFront && images.length > 1
                          ? "cursor-grab active:cursor-grabbing"
                          : "pointer-events-none"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        priority={isFront}
                        sizes="(max-width: 640px) 90vw, 520px"
                        className="select-none object-cover"
                        draggable={false}
                      />

                      {/* Soft bottom overlay */}
                      {isFront && images.length > 1 && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                      )}

                      {/* Image counter */}
                      {isFront && images.length > 1 && (
                        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] tracking-wider text-white backdrop-blur-sm">
                          {activeImageIndex + 1} / {images.length}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ================= DOTS ================= */}

            {images.length > 1 && (
              <div className="mt-1 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setActiveImageIndex(index)
                      }
                      aria-label={`Show photo ${index + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        index === activeImageIndex
                          ? "h-1.5 w-5 bg-[#8b1235]/55"
                          : "h-1.5 w-1.5 bg-[#8b1235]/20"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-[#8b1235]/25">
                  Tap or swipe
                </p>
              </div>
            )}
          </div>
        )}
      </motion.article>
    </section>
  );
}