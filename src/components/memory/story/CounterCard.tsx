"use client";

import { useEffect, useState } from "react";

interface CounterCardProps {
  date: string;
}

interface CounterTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseDate(date: string): Date | null {
  const parsed = new Date(date);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const parts = date.trim().split(" ");

  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = parts[1];
  const year = Number(parts[2]);

  if (
    Number.isNaN(day) ||
    Number.isNaN(year) ||
    !month
  ) {
    return null;
  }

  const parsedDate = new Date(`${month} ${day}, ${year}`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function getElapsedTime(startDate: Date): CounterTime {
  const difference = Math.max(
    0,
    Date.now() - startDate.getTime()
  );

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function CounterCard({
  date,
}: CounterCardProps) {
  const [time, setTime] = useState<CounterTime | null>(null);

  useEffect(() => {
    const startDate = parseDate(date);

    if (!startDate) {
      return;
    }

    const update = () => {
      setTime(getElapsedTime(startDate));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [date]);

  if (!time) {
    return null;
  }

 return (
  <section className="mx-auto w-full px-5   sm:py-8">
    
    <div className="w-full rounded-[28px] bg-[#7A1C30] px-6 py-10 text-[#FAEDEB] shadow-xl sm:rounded-[32px] sm:px-12 sm:py-12">
      
      {/* Label */}
      <div className="mb-10 flex items-center justify-center gap-4">
        <div className="h-px w-10 bg-[#E8C5B0]/30 sm:w-16" />

        <span className="font-serif text-xs uppercase tracking-[0.3em] text-[#E8C5B0]/90 sm:text-sm">
          Since That Day
        </span>

        <div className="h-px w-10 bg-[#E8C5B0]/30 sm:w-16" />
      </div>

      {/* Counter */}
      <div className="grid grid-cols-4 text-center">
        <div>
          <div className="font-serif text-4xl text-white sm:text-6xl">
            {time.days}
          </div>

          <div className="mt-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#E8C5B0]/70 sm:text-xs">
            Days
          </div>
        </div>

        <div>
          <div className="font-serif text-4xl text-white sm:text-6xl">
            {time.hours}
          </div>

          <div className="mt-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#E8C5B0]/70 sm:text-xs">
            Hours
          </div>
        </div>

        <div>
          <div className="font-serif text-4xl text-white sm:text-6xl">
            {time.minutes}
          </div>

          <div className="mt-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#E8C5B0]/70 sm:text-xs">
            Minutes
          </div>
        </div>

        <div>
          <div className="font-serif text-4xl text-white sm:text-6xl">
            {time.seconds}
          </div>

          <div className="mt-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#E8C5B0]/70 sm:text-xs">
            Seconds
          </div>
        </div>
      </div>

    </div>
  </section>
);
}