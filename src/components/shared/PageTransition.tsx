
'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  stages?: number; // عدد مراحل الظهور (افتراضي 5)
  delay?: number; // التأخير بين كل مرحلة (افتراضي 300ms)
  initialDelay?: number; // تأخير قبل البدء (افتراضي 100ms)
}

export default function PageTransition({
  children,
  stages = 5,
  delay = 300,
  initialDelay = 100,
}: PageTransitionProps) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // بدء التسلسل بعد التأخير الابتدائي
    const startTimer = setTimeout(() => {
      for (let i = 0; i < stages; i++) {
        const timer = setTimeout(() => {
          setCurrentStage(i + 1);
        }, i * delay);
        timers.push(timer);
      }
    }, initialDelay);

    return () => {
      clearTimeout(startTimer);
      timers.forEach(clearTimeout);
    };
  }, [stages, delay, initialDelay]);

  return (
    <div className="relative z-10">
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={`
                transition-all duration-700 ease-out
                ${currentStage > index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
              `}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}