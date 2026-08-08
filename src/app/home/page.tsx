// src/app/(public)/home/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { memories } from '@/data/memories';
import MemoryCarousel from '@/components/memory/carousel/MemoryCarousel';
import PageTransition from '@/components/shared/PageTransition';
import SecretSection from './SecretSection';

const FallingRoses = dynamic(() => import('@/components/shared/FallingRoses'), {
  ssr: false,
});

export default function HomePage() {
  const [showSecret, setShowSecret] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);

  const handleRevealSecret = () => {
    setShowSecret(true);
    // trigger entrance animation after mount
    requestAnimationFrame(() => {
      setSecretVisible(true);
    });
  };

  return (
    <div className="min-h-screen bg-roseIvory relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-roseIvory via-ruby/5 to-roseIvory animate-gradient" />

      {/* Falling Roses */}
      <FallingRoses />

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12 md:py-20 max-w-4xl mx-auto">
        <PageTransition stages={5} delay={280} initialDelay={150}>
          {/* Stage 1: Logo */}
          {/* <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 mx-auto rounded-full ruby-gradient flex items-center justify-center shadow-lg">
                <span className="text-white font-heading text-xl">∞</span>
              </div>
              <div className="w-8 h-0.5 bg-ruby/20 mx-auto mt-2" />
            </div>
          </div> */}

          {/* Stage 2: Hero */}
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

          {/* Stage 3: Made with Love */}
          <div className="mt-6 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-ruby/5 blur-xl rounded-full" />
              <p className="font-heading text-ruby/80 text-lg md:text-2xl relative z-10 tracking-wide">
                Made with love, <span className="text-ruby">just for you</span>
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-ruby/20 rounded-full" />
            </div>
          </div>

          {/* Stage 4: Carousel */}
          <div className="mt-8 md:mt-10">
            <MemoryCarousel memories={memories} />
          </div>

          {/* Stage 5: Footer */}
          <div className="mt-10 text-center">
            <p className="font-body text-ruby/50 text-sm">
              ✦ {memories.length} memories waiting for you ✦
            </p>
          </div>
        </PageTransition>

        {/* Secret Section Trigger Button */}
        {!showSecret && (
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
        )}

        {/* Secret Section - with cinematic entrance */}
        {showSecret && (
          <div
            className={`
              mt-12
              transition-all duration-700 ease-out
              ${secretVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <SecretSection />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}