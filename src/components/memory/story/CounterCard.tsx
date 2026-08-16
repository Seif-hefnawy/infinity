"use client";

import React, { useState, useEffect } from 'react';
import { memories } from '@/data/memories';

interface CounterCardProps {
  startDate?: string;
}

export default function CounterCard({ startDate }: CounterCardProps) {
  const getStartDate = () => {
    if (startDate) {
      return new Date(startDate);
    }
    const firstMemory = memories[0];
    if (firstMemory) {
      return new Date(firstMemory.date);
    }
    return new Date();
  };

  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const start = getStartDate();

    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      if (diff < 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-xl xl:max-w-lg mx-auto my-10 rounded-2xl bg-[#7A1C30] text-[#FAEDEB] p-6 sm:p-8 md:p-10 lg:p-8 xl:p-6 shadow-2xl overflow-hidden border border-[#A23B52]/40">
      <div className="absolute inset-2 md:inset-3 border border-[#E8C5B0]/20 rounded-xl pointer-events-none" />

      <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
        <div className="h-[1px] w-8 md:w-12 bg-[#E8C5B0]/30" />
        <span className="tracking-[0.25em] text-[10px] sm:text-[11px] md:text-xs font-serif uppercase text-[#E8C5B0]/90 font-medium">
          Since That Day
        </span>
        <div className="h-[1px] w-8 md:w-12 bg-[#E8C5B0]/30" />
      </div>

      <div className="grid grid-cols-4 gap-3 text-center relative z-10 px-2">
        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-3xl font-light tracking-normal text-secondary">
            {time.days}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] font-serif uppercase mt-2 text-[#E8C5B0]/70">
            Days
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-3xl font-light tracking-normal text-secondary">
            {time.hours}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] font-serif uppercase mt-2 text-[#E8C5B0]/70">
            Hours
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-3xl font-light tracking-normal text-secondary">
            {time.minutes}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] font-serif uppercase mt-2 text-[#E8C5B0]/70">
            Minutes
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-3xl font-light tracking-normal text-secondary">
            {time.seconds}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-[0.2em] font-serif uppercase mt-2 text-[#E8C5B0]/70">
            Seconds
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-6 relative z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-[#E8C5B0]/40" />
      </div>
    </div>
  );
}