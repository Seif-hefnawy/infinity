// src/app/(public)/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PinInput from '@/components/welcome/PinInput';
import NumericKeypad from '@/components/welcome/NumericKeypad';
import PageTransition from '@/components/shared/PageTransition';

const CORRECT_PIN = '1234';

export default function WelcomePage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handlePinChange = (value: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + value);
      setError('');
      setShowError(false);
    }
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError('Please enter complete PIN');
      setShowError(true);
      return;
    }

    if (pin === CORRECT_PIN) {
      setError('');
      setShowError(false);
      router.push('/home');
    } else {
      setError('PIN incorrect, please try again');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setPin('');
        setError('');
      }, 1500);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
    setShowError(false);
  };

  const handleClear = () => {
    setPin('');
    setError('');
    setShowError(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-roseIvory relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 romantic-linear opacity-30" />
      <div className="absolute inset-0 glass" />

      {/* 3D White Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-linear-to-br from-ruby/30 via-roseIvory to-ruby/20 rounded-3xl blur-sm" />
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl md:rounded-4xl p-8 md:p-10 shadow-2xl border border-white/30 relative overflow-hidden transform-gpu perspective-1000 rotate-x-2">
          {/* 3D Depth Effects */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-ruby/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-ruby/5 rounded-full blur-2xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

          {/* Subtle Linear Gradients */}
          <div className="absolute inset-0 bg-linear-to-b from-ruby/5 via-transparent to-ruby/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-ruby/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-linear-to-l from-ruby/5 to-transparent pointer-events-none" />

          {/* Flower Decoration - Top Right */}
          <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20">
            <span className="text-5xl md:text-6xl text-ruby/20 rotate-99 inline-block">
              🌹
            </span>
          </div>

          {/* Flower Decoration - Bottom Left (mirrored) */}
          <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-20">
            <span className="text-4xl md:text-5xl text-ruby/15 -rotate-12 inline-block scale-x-[-1]">
              🌹
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <PageTransition stages={4} delay={200} initialDelay={100}>
              <h1 className="font-heading text-ruby text-3xl md:text-4xl text-center font-bold leading-tight">
                A Special Memory Is Waiting For You
              </h1>

              <p className="font-body text-ruby/70 text-center mt-3 text-xs md:text-sm">
                Enter your secret PIN to unlock your memories.
              </p>

              <div className="mt-8 w-full flex justify-center">
                <PinInput pin={pin} error={showError} />
              </div>

              <div className="mt-8 w-full max-w-xs mx-auto flex justify-center">
                <NumericKeypad
                  onPress={handlePinChange}
                  onDelete={handleDelete}
                  onSubmit={handleSubmit}
                  onClear={handleClear}
                />
              </div>
            </PageTransition>

            {error && (
              <p className="text-error text-sm font-body mt-4 animate-shake text-center">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}