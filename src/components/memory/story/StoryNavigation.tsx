'use client';

import Link from 'next/link';
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
      className="
        mx-auto
        mt-12
        w-full
        max-w-3xl
        border-t
        border-[#8b1235]/10
        pt-7
        sm:mt-16
        sm:pt-8
      "
    >
      <div
        className="
          grid
          grid-cols-[1fr_auto_1fr]
          items-center
          gap-3
          sm:gap-6
        "
      >

        {/* PREVIOUS */}
        <div className="flex justify-start">
          {prevMemory ? (
            <Link
              href={`/inf/${prevMemory.slug}`}
              aria-label={`Previous memory: ${prevMemory.title}`}
              className="
                group
                inline-flex
                min-w-0
                items-center
                gap-2
                text-[#68152f]/60
                transition-colors
                duration-300
                hover:text-[#68152f]
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8b1235]/15
                  bg-white
                  text-[#68152f]/60
                  shadow-[0_5px_20px_rgba(91,16,40,0.05)]
                  transition-all
                  duration-300
                  group-hover:-translate-x-1
                  group-hover:border-[#8b1235]/30
                  group-hover:shadow-[0_8px_25px_rgba(91,16,40,0.1)]
                  sm:h-10
                  sm:w-10
                "
              >
                <span className="text-lg leading-none">
                  ←
                </span>
              </span>

              <span className="hidden max-w-[130px] truncate font-serif text-xs sm:block">
                {prevMemory.title}
              </span>
            </Link>
          ) : (
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-[#8b1235]/8
                text-[#68152f]/20
                sm:h-10
                sm:w-10
              "
            >
              ←
            </span>
          )}
        </div>

        {/* BACK TO HOME */}
        <Link
          href="/home"
          className="
            group
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <span
            className="
              font-serif
              text-[11px]
              tracking-[0.18em]
              text-[#68152f]/55
              uppercase
              transition-colors
              duration-300
              group-hover:text-[#68152f]
            "
          >
            Back to Home
          </span>

          <span
            className="
              mt-1
              text-[9px]
              text-[#8b1235]/30
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            "
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
              className="
                group
                inline-flex
                min-w-0
                items-center
                gap-2
                text-[#68152f]/60
                transition-colors
                duration-300
                hover:text-[#68152f]
              "
            >
              <span className="hidden max-w-[130px] truncate font-serif text-xs sm:block">
                {nextMemory.title}
              </span>

              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8b1235]/15
                  bg-white
                  text-[#68152f]/60
                  shadow-[0_5px_20px_rgba(91,16,40,0.05)]
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:border-[#8b1235]/30
                  group-hover:shadow-[0_8px_25px_rgba(91,16,40,0.1)]
                  sm:h-10
                  sm:w-10
                "
              >
                <span className="text-lg leading-none">
                  →
                </span>
              </span>
            </Link>
          ) : (
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-[#8b1235]/8
                text-[#68152f]/20
                sm:h-10
                sm:w-10
              "
            >
              →
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}