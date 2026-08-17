// src/app/(public)/home/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { memories } from '@/data/memories';
import MemoryCarousel from '@/components/memory/carousel/MemoryCarousel';

const SecretSection = dynamic(() => import('./SecretSection'), {
  ssr: false,
});

export default function HomePage() {
  const [showSecret, setShowSecret] = useState(false);

  const handleRevealSecret = () => {
    setShowSecret(true);
  };

  // ✅ للتأكد من وجود البيانات
  console.log('Memories in HomePage:', memories);

  return (
    <>
      <div className="min-h-screen bg-roseIvory relative overflow-hidden">
        {/* خلفية ثابتة (من غير أي حركة) */}
        <div className="absolute inset-0 bg-linear-to-br from-roseIvory via-ruby/5 to-roseIvory" />

        <div className="relative z-10 px-6 py-12 md:py-20 max-w-4xl mx-auto">
          {/* ===== 1. Hero ===== */}
          <div className="mt-6">
            <div className="ruby-gradient rounded-3xl md:rounded-4xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="font-heading text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
                  Our Memories
                </h1>
                <p className="font-body text-white/90 text-sm md:text-base mt-3 max-w-lg drop-shadow">
                  Every picture holds a memory. Tap any photo to relive the moment.
                </p>
                <div className="w-20 h-1 bg-white/50 rounded-full mt-4" />
              </div>
            </div>
          </div>

          {/* ===== 2. Made with Love ===== */}
          <div className="mt-6 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-ruby/5 blur-xl rounded-full" />
              <p className="font-heading text-ruby/80 text-lg md:text-2xl relative z-10 tracking-wide">
                Made with love, <span className="text-ruby">just for you</span>
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-ruby/20 rounded-full" />
            </div>
          </div>

          {/* ===== 3. Carousel ===== */}
          <div className="mt-8 md:mt-10">
            <MemoryCarousel memories={memories} />
          </div>

          {/* ===== 4. Footer ===== */}
          <div className="mt-10 text-center">
            <p className="font-body text-ruby/50 text-sm">
              ✦ {memories.length} memories waiting for you ✦
            </p>
          </div>

          {/* ===== 5. Secret Trigger or Section ===== */}
          {!showSecret ? (
            <div className="mt-12 text-center">
              <button
                onClick={handleRevealSecret}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border border-ruby/20 text-ruby/80 font-heading text-sm tracking-wider transition-all duration-300 hover:border-ruby/40 hover:bg-ruby/5 hover:shadow-lg hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">If You See All Stories, Tap Here</span>
                <span className="text-ruby/30 group-hover:translate-x-1 transition-transform duration-300">→</span>
                <span className="absolute inset-0 rounded-full bg-ruby/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
          ) : (
            <div className="mt-12">
              <SecretSection />
            </div>
          )}
        </div>
      </div>
    </>
  );
}