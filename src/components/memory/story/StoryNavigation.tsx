'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Memory } from '@/data/memories';

interface StoryNavigationProps {
  prevMemory: Memory | null;
  nextMemory: Memory | null;
}

export default function StoryNavigation({
  prevMemory,
  nextMemory,
}: StoryNavigationProps) {
  return (
    <nav
      aria-label="Story navigation"
      className="mx-auto mb-5 mt-5 w-full max-w-3xl border-t border-[#8b1235]/10 pt-7 sm:mt-16 sm:pt-8"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">

        {/* PREVIOUS */}
        <div className="flex justify-start">
          {prevMemory ? (
            <Link
              href={`/inf/${prevMemory.slug}`}
              aria-label={`Previous memory: ${prevMemory.title}`}
              className="group inline-flex min-w-0 items-center gap-2 text-ruby transition-colors duration-300 hover:text-ruby/80"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ruby-gradient text-white shadow-[0_5px_20px_rgba(102,2,31,0.25)] transition-all duration-300 group-hover:-translate-x-1 group-hover:shadow-[0_8px_25px_rgba(102,2,31,0.35)] sm:h-10 sm:w-10"
              >
                <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="hidden max-w-[130px] truncate font-serif text-xs sm:block">
                {prevMemory.title}
              </span>
            </Link>
          ) : (
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b1235]/8 text-[#68152f]/20 sm:h-10 sm:w-10"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </span>
          )}
        </div>

        {/* BACK TO HOME */}
        <Link
          href="/home"
          className="group flex flex-col items-center justify-center text-center"
        >
          <span
            className="font-serif text-[11px] tracking-[0.18em] text-ruby/70 uppercase transition-colors duration-300 group-hover:text-ruby"
          >
            Back to Home
          </span>
          <span
            className="mt-1 text-[9px] text-ruby/40 transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            ✦
          </span>
        </Link>

        {/* NEXT */}
        <div className="flex justify-end">
          {nextMemory ? (
            <Link
              href={`/inf/${nextMemory.slug}`}
              aria-label={`Next memory: ${nextMemory.title}`}
              className="group inline-flex min-w-0 items-center gap-2 text-ruby transition-colors duration-300 hover:text-ruby/80"
            >
              <span className="hidden max-w-[130px] truncate font-serif text-xs sm:block">
                {nextMemory.title}
              </span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ruby-gradient text-white shadow-[0_5px_20px_rgba(102,2,31,0.25)] transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-[0_8px_25px_rgba(102,2,31,0.35)] sm:h-10 sm:w-10"
              >
                <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            </Link>
          ) : (
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b1235]/8 text-[#68152f]/20 sm:h-10 sm:w-10"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}