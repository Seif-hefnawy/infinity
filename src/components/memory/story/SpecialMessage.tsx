'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface SpecialMessageProps {
  message?: string;
}

export default function SpecialMessage({
  message = 'If you found this, you were meant to read it.',
}: SpecialMessageProps) {
  const [revealed, setRevealed] = useState(false);

  const words = [
    'remember',
    'always',
    'forever',
    'you',
    'together',
    'remember',
    'always',
    'love',
    'forever',
  ];

  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#8b1235]/45">
            One little secret
          </p>

          <h2 className="mt-5 font-serif text-3xl text-[#68152f] sm:text-5xl">
            Something was left here for you.
          </h2>
        </motion.div>

        {/* ================================================= */}
        {/* BEFORE REVEAL — THE PUZZLE */}
        {/* ================================================= */}

        <AnimatePresence mode="wait">
          {!revealed && (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.97,
                transition: { duration: 0.45 },
              }}
              className="mt-14"
            >
              <p className="font-serif text-sm italic text-[#8b1235]/55">
                Find the hidden word.
              </p>

              <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-3">
                {words.map((word, index) => {
                  const isCorrect = word === 'love';

                  return (
                    <motion.button
                      key={`${word}-${index}`}
                      type="button"
                      onClick={() => {
                        if (isCorrect) {
                          setRevealed(true);
                        }
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.94,
                      }}
                      className={`
                        rounded-full
                        border
                        px-5
                        py-2.5
                        font-serif
                        text-sm
                        transition-all
                        duration-300
                        ${
                          isCorrect
                            ? `
                              border-[#8b1235]/20
                              bg-[#8b1235]/5
                              text-[#8b1235]/65
                              hover:border-[#8b1235]/40
                              hover:bg-[#8b1235]/10
                              hover:shadow-[0_8px_25px_rgba(139,18,53,0.12)]
                            `
                            : `
                              border-[#8b1235]/10
                              bg-white/30
                              text-[#8b1235]/35
                              hover:border-[#8b1235]/20
                            `
                        }
                      `}
                    >
                      {word}
                    </motion.button>
                  );
                })}
              </div>

              <p className="mt-8 text-xs tracking-wide text-[#8b1235]/35">
                Take your time.
              </p>
            </motion.div>
          )}

          {/* ================================================= */}
          {/* AFTER LOVE — REVEALED MESSAGE */}
          {/* ================================================= */}

          {revealed && (
            <motion.div
              key="revealed"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                mt-14
                overflow-hidden
                rounded-[30px]
                border
                border-[#8b1235]/10
                bg-[#fffaf8]
                px-7
                py-16
                shadow-[0_30px_90px_rgba(91,16,40,0.14)]
                sm:px-14
                sm:py-20
              "
            >

              {/* Soft glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[280px]
                  w-[280px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#8b1235]/5
                  blur-3xl
                "
              />

              {/* Top ornament */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.25,
                  duration: 0.6,
                }}
                className="relative"
              >
                <span className="font-serif text-3xl text-[#8b1235]/55">
                  ✦
                </span>
              </motion.div>

              {/* Label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                }}
                className="
                  relative
                  mt-7
                  text-[10px]
                  uppercase
                  tracking-[0.45em]
                  text-[#8b1235]/45
                "
              >
                You found it
              </motion.p>

              {/* Main message */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                  duration: 0.8,
                }}
                className="
                  relative
                  mx-auto
                  mt-10
                  max-w-2xl
                  whitespace-pre-line
                  font-serif
                  text-3xl
                  leading-[1.7]
                  text-[#68152f]
                  sm:text-5xl
                "
              >
                {message}
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{
                  opacity: 0,
                  scaleX: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.6,
                }}
                className="
                  relative
                  mx-auto
                  mt-10
                  h-px
                  w-20
                  bg-[#8b1235]/25
                "
              />

              {/* Bottom sentence */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.95,
                  duration: 0.7,
                }}
                className="
                  relative
                  mt-8
                  font-serif
                  text-base
                  italic
                  text-[#8b1235]/55
                  sm:text-lg
                "
              >
                Some things are worth discovering twice.
              </motion.p>

              {/* Heart */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: [0, -4, 0],
                }}
                transition={{
                  delay: 1.15,
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="
                  relative
                  mt-12
                  font-serif
                  text-xl
                  text-[#8b1235]/45
                "
              >
                ♡
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}