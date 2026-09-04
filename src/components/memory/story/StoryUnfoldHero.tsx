"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

interface StoryUnfoldHeroProps {
  title: string;
  subtitle?: string;
  date: string;
  image: string;
}

export default function StoryUnfoldHero({
  title,
  subtitle,
  date,
  image,
}: StoryUnfoldHeroProps) {
  return (
    <section className="relative h-screen w-full shadow-xl rounded mb- overflow-hidden lg:max-w-4xl lg:mx-auto">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/10 pointer-events-none" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 text-white sm:px-10 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mx-auto w-full max-w-4xl xl:max-w-3xl 2xl:max-w-2xl"
        >
          <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/75 sm:text-xs md:text-sm">
            {date}
          </p>

          <h1 className="font-serif text-4xl leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 max-w-md font-serif text-base italic text-white/80 sm:text-lg md:text-xl xl:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mx-auto mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/60">
            Unfold the memory
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-10 w-px bg-white/50"
          />
        </motion.div>
      </div>
    </section>
  );
}