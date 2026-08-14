'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface StoryUnfoldHeroProps {
  title: string;
  date: string;
  image: string;
}

export default function StoryUnfoldHero({
  title,
  date,
  image,
}: StoryUnfoldHeroProps) {
  return (
    <section className="relative mx-auto max-w-5xl pt-6 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-[32px] shadow-[0_35px_100px_rgba(91,16,40,0.20)]"
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 1100px"
          />

          {/* luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#350817]/75 via-[#350817]/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
            <p className="mb-3 font-serif text-sm tracking-[0.3em] text-white/75 uppercase">
              A Memory
            </p>

            <h1 className="font-serif text-4xl text-white sm:text-6xl">
              {title}
            </h1>

            <div className="mt-5 flex items-center gap-4">
              <div className="h-px w-12 bg-white/50" />

              <span className="font-serif text-sm italic text-white/80">
                {date}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}