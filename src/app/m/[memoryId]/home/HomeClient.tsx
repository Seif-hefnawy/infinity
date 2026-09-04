"use client";

import PageTransition from "@/components/shared/PageTransition";
import { useState } from "react";
import MemoryCarousel from "@/components/memory/carousel/MemoryCarousel";
import SecretSection from "./SecretSection";
import Image from "next/image";
import type { PublishedMemory } from "@/types/memory";

interface HomeClientProps {
  memoryId: string;
  memory: PublishedMemory;
}

export default function HomeClient({ memoryId, memory }: HomeClientProps) {
  const [showSecret, setShowSecret] = useState(false);

  const handleRevealSecret = () => {
    setShowSecret(true);
  };

  return (
    <div className="min-h-screen bg-roseIvory relative overflow-hidden">
      {/* خلفية ثابتة */}
      <div className="absolute inset-0 bg-linear-to-br from-roseIvory via-ruby/5 to-roseIvory" />

      <div className="relative z-10 px-6   max-w-4xl mx-auto">
        {/* ===== Cinematic Entrance ===== */}
        <PageTransition stages={6} delay={220} initialDelay={100}>
          {/* <div className="flex justify-center ">
            <Image
              src="/images/logo.png"
              alt="Infinity Logo"
              width={120}
              height={10}
              className="mx-auto h-auto w-auto object-contain drop-shadow-lg"

            />
          </div> */}
          {/* Stage 1: Hero */}
          <div key="hero" className="">
            <div className="ruby-gradient rounded-3xl md:rounded-4xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="font-heading text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
                  Our Memories
                </h1>
                <p className="font-body text-white/90 text-sm md:text-base mt-3 max-w-lg drop-shadow">
                  Every picture holds a memory. Tap any photo to relive the
                  moment.
                </p>
                <div className="w-20 h-1 bg-white/50 rounded-full mt-4" />
              </div>
            </div>
          </div>

          {/* Stage 2: Made with Love */}
          <div key="love" className="mt-6 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-ruby/5 blur-xl rounded-full" />
              <p className="font-heading text-ruby/80 text-lg md:text-2xl relative z-10 tracking-wide">
                Made with love, <span className="text-ruby">just for you</span>
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-ruby/20 rounded-full" />
            </div>
          </div>

          {/* Stage 3: Carousel */}
          <div key="carousel" className="mt-8 md:mt-10">
            <MemoryCarousel memoryId={memoryId} stories={memory.stories} />
          </div>

          {/* Stage 4: Footer */}
          <div key="footer" className="mt-10 text-center">
            <p className="font-body text-ruby/50 text-sm">
              ✦ {memory.stories.length} memories waiting for you ✦
            </p>
          </div>

          {/* Stage 5: Secret Trigger or Section */}
          <div key="secret" className="mt-12 text-center">
            {!showSecret ? (
              <button
                onClick={handleRevealSecret}
                className="group mb-5 relative inline-flex items-center gap-3 px-8 py-4 rounded-full border border-ruby/20 text-ruby/80 font-heading text-sm tracking-wider transition-all duration-300 hover:border-ruby/40 hover:bg-ruby/5 hover:shadow-lg hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">
                  If You See All Stories, Tap Here
                </span>
                <span className="text-ruby/30 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
                <span className="absolute inset-0 rounded-full bg-ruby/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            ) : (
              <SecretSection memoryId={memoryId} stories={memory.stories} />
            )}
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
