// src/app/m/[memoryId]/page.tsx
//
// Entry point after an NFC scan / visiting the memory link. Server
// Component: makes one direct, unauthenticated status check to decide
// whether to send the visitor into their own Setup flow or the PIN gate.
// The actual PIN-gated content fetch happens client-side (see PinGate)
// since it depends on a token the browser holds, not something a Server
// Component can read.
import { notFound, redirect } from "next/navigation";
import { memoryService } from "@/services/memoryService";
import PinGate from "./PinGate";

interface PageProps {
  params: Promise<{ memoryId: string }>;
}

export default async function MemoryEntryPage({ params }: PageProps) {
  const { memoryId } = await params;
  const resolution = await memoryService.resolveMemory(memoryId);

  if (!resolution.memory_exists) {
    notFound();
  }

  if (resolution.status === "NOT_SETUP") {
    // The customer sets this memory up themselves, the first time they
    // scan/open their link - see /m/[memoryId]/setup.
    redirect(`/m/${memoryId}/setup`);
  }

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

          {/* By this point status is always PUBLISHED - NOT_SETUP already redirected above, and a nonexistent memory already called notFound(). */}
          <PinGate memoryId={memoryId} />
        </div>
      </div>
    </div>
  );
}
