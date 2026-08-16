'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SpecialMessageProps {
  message?: string; // النص اللي هيظهر بعد الكشف (اختياري)
  songTitle?: string; // عنوان الأغنية (بيجيله من الداتا)
  spotifyUrl?: string; // رابط Spotify Embed (بيجيله من الداتا)
}

export default function SpecialMessage({
  message = 'If you found this, you were meant to read it.',
  songTitle,
  spotifyUrl,
}: SpecialMessageProps) {
  const [revealed, setRevealed] = useState(false);

  const words = ['remember', 'always', 'forever', 'you', 'together', 'love'];
  const [secretWord] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">
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
                  const isCorrect = word === secretWord;
                  return (
                    <motion.button
                      key={`${word}-${index}`}
                      type="button"
                      onClick={() => {
                        if (isCorrect) {
                          setRevealed(true);
                        }
                      }}
                      whileHover={{ y: -4, scale: 1.03 }}
                      whileTap={{ scale: 0.94 }}
                      className="cursor-pointer rounded-full border border-[#8b1235]/10 bg-white/30 px-5 py-2.5 font-serif text-sm text-[#8b1235]/35 transition-all duration-300 hover:border-[#8b1235]/20 hover:bg-[#8b1235]/5"
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

          {revealed && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mt-10 overflow-hidden rounded-[30px] border border-[#8b1235]/10 bg-[#fffaf8] px-7 py-4 shadow-[0_30px_90px_rgba(91,16,40,0.14)] sm:px-14 sm:py-12"
            >
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-70 w-70 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b1235]/5 blur-3xl" />

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="relative"
              >
                <span className="font-serif text-3xl text-[#8b1235]/55">✦</span>
              </motion.div>

              {/* لو في عنوان، يظهر */}
              {songTitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative mt- font-serif text-2xl text-[#68152f] sm:text-3xl"
                >
                  {songTitle}
                </motion.p>
              )}

              {/* لو في رابط Spotify، يظهر الـ iframe */}
              {spotifyUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                  className="relative mx-auto mt-5 max-w-2xl"
                >
                  <iframe
                    src={spotifyUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl shadow-lg"
                    title="Spotify player"
                  />
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="relative mt-5 font-serif text-sm italic text-[#8b1235]/55"
              >
                Every memory has its own melody.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}