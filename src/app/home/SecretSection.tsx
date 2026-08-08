// src/components/home/SecretSection.tsx
'use client';

import { useMemo, useState } from 'react';
import { memories } from '@/data/memories';

type Stage = 'locked' | 'unlocked' | 'open';

export default function SecretSection() {
  const [stage, setStage] = useState<Stage>('locked');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [error, setError] = useState(false);

  const firstMemory = memories[0];

  // Extract day and month from first memory
  const correctDay = useMemo(() => {
    if (!firstMemory) return '';
    const date = new Date(firstMemory.date);
    if (isNaN(date.getTime())) return '';
    return String(date.getDate()).padStart(2, '0');
  }, [firstMemory]);

  const correctMonth = useMemo(() => {
    if (!firstMemory) return '';
    const date = new Date(firstMemory.date);
    if (isNaN(date.getTime())) return '';
    return String(date.getMonth() + 1).padStart(2, '0');
  }, [firstMemory]);

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSelectDay = (day: string) => {
    if (stage !== 'locked') return;
    setSelectedDay(day);
    setError(false);
  };

  const handleSelectMonth = (month: string) => {
    if (stage !== 'locked') return;
    setSelectedMonth(month);
    setError(false);
  };

  const handleUnlock = () => {
    if (selectedDay === correctDay && selectedMonth === correctMonth) {
      setError(false);
      setStage('unlocked');
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setSelectedDay('');
        setSelectedMonth('');
      }, 1200);
    }
  };

  const handleOpenLetter = () => {
    setStage('open');
  };

  if (!firstMemory) return null;

  return (
    <section className="relative w-full max-w-xl mx-auto px-4 py-8">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/20 blur-[100px]" />

      <div className="relative z-10 text-center">
        {/* ===== LOCKED ===== */}
        {stage === 'locked' && (
          <div className="animate-fade-in">
            <div className="mb-6 text-xl text-[#9c4b67]/70">✦</div>

            <p className="font-serif text-3xl text-[#7d1635] md:text-5xl">
              One Last Thing...
            </p>

            <p className="mt-4 font-serif text-lg italic text-[#a45b73] md:text-xl">
              The day it all began.
            </p>

            {/* Day Selector */}
            <div className="mt-8">
              <p className="text-sm text-[#a45b73]">Day</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((day) => (
                  <button
                    key={day}
                    onClick={() => handleSelectDay(day)}
                    className={`px-3 py-1 rounded-full border text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                      selectedDay === day
                        ? 'bg-[#7d1635] text-white border-[#7d1635]'
                        : 'border-[#a45b73]/20 bg-white/30 text-[#7d1635] hover:bg-white/50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Selector */}
            <div className="mt-6">
              <p className="text-sm text-[#a45b73]">Month</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {monthNames.map((month, index) => {
                  const monthNum = String(index + 1).padStart(2, '0');
                  return (
                    <button
                      key={month}
                      onClick={() => handleSelectMonth(monthNum)}
                      className={`px-3 py-1 rounded-full border text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        selectedMonth === monthNum
                          ? 'bg-[#7d1635] text-white border-[#7d1635]'
                          : 'border-[#a45b73]/20 bg-white/30 text-[#7d1635] hover:bg-white/50'
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            <div className="h-7 mt-4">
              {error && (
                <p className="text-sm text-[#9c3657] animate-fade-in">
                  Not quite... Try again.
                </p>
              )}
            </div>

            {/* Unlock Button */}
            <button
              onClick={handleUnlock}
              disabled={!selectedDay || !selectedMonth}
              className="mt-4 rounded-full bg-[#7d1635] px-8 py-3 font-serif text-white shadow-lg shadow-[#7d1635]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
            >
              Unlock
            </button>

            <p className="mt-6 text-xs tracking-wide text-[#a45b73]/60">
              Select the day and month of your first memory.
            </p>
          </div>
        )}

        {/* ===== UNLOCKED ===== */}
        {stage === 'unlocked' && (
          <div className="animate-secret-reveal">
            <div className="mb-6 text-2xl text-[#9c4b67]">✦</div>

            <p className="font-serif text-2xl italic text-[#a45b73] md:text-3xl">
              You found it.
            </p>

            <p className="mt-4 font-serif text-lg text-[#7d1635] md:text-xl">
              There&apos;s one more thing waiting for you.
            </p>

            {/* Envelope */}
            <button
              onClick={handleOpenLetter}
              className="group mx-auto mt-12 block"
            >
              <div className="relative flex h-40 w-56 items-center justify-center rounded-2xl border border-[#a45b73]/20 bg-white/40 shadow-[0_25px_80px_rgba(125,22,53,0.12)] backdrop-blur-md transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_35px_100px_rgba(125,22,53,0.18)]">
                <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#a45b73]/10 bg-white/50" />
                <span className="relative z-10 font-serif text-sm tracking-[0.2em] text-[#7d1635]">
                  OPEN
                </span>
              </div>
            </button>

            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-[#a45b73]/60">
              A little message for you
            </p>
          </div>
        )}

        {/* ===== LETTER OPEN ===== */}
        {stage === 'open' && (
          <div className="animate-letter-open">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-2xl text-[#9c4b67]">✦</div>

              <div className="relative rounded-[32px] border border-[#a45b73]/15 bg-white/50 px-8 py-14 shadow-[0_30px_100px_rgba(125,22,53,0.10)] backdrop-blur-xl md:px-16 md:py-20">
                <p className="text-xs uppercase tracking-[0.35em] text-[#a45b73]">
                  Just For You
                </p>

                <div className="mx-auto my-8 h-px w-16 bg-[#a45b73]/30" />

                <p className="font-serif text-2xl leading-relaxed text-[#7d1635] md:text-4xl">
                  I hope we never stop making
                  <br />
                  memories worth remembering.
                </p>

                <p className="mt-10 font-serif text-lg italic text-[#a45b73]">
                  Forever yours. ❤️
                </p>
              </div>

              <p className="mt-8 font-serif text-sm italic text-[#a45b73]/70">
                Some things are meant to be kept close.
              </p>

              <div className="mt-4 text-[#9c4b67]/60">✦</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}