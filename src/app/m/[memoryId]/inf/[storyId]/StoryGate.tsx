"use client";

import { useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { memoryService } from "@/services/memoryService";
import { clearMemorySession, getMemoryToken } from "@/services/tokenStorage";
import { ApiClientError } from "@/services/apiClient";
import type { PublishedMemory } from "@/types/memory";

import PageTransition from "@/components/shared/PageTransition";
import StoryUnfoldHero from "@/components/memory/story/StoryUnfoldHero";
import StoryContent from "@/components/memory/story/StoryContent";
import CounterCard from "@/components/memory/story/CounterCard";
import SpecialMessage from "@/components/memory/story/SpecialMessage";
import StoryNavigation from "@/components/memory/story/StoryNavigation";
import SectionLabel from "@/components/memory/story/SectionLabel";
import InfinityLoader from "@/components/shared/InfinityLoader";

interface StoryGateProps {
  memoryId: string;
  storyId: string;
}

export default function StoryGate({ memoryId, storyId }: StoryGateProps) {
  const router = useRouter();
  const [memory, setMemory] = useState<PublishedMemory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const viewToken = getMemoryToken(memoryId, "view");
    if (!viewToken) {
      router.replace(`/m/${memoryId}`);
      return;
    }

    let cancelled = false;
    memoryService
      .getPublishedMemory(memoryId, viewToken)
      .then((data) => {
        if (!cancelled) setMemory(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiClientError && err.status === 401) {
          clearMemorySession(memoryId);
          router.replace(`/m/${memoryId}`);
          return;
        }
        setError(err instanceof ApiClientError ? err.message : "Something went wrong loading this story.");
      });

    return () => {
      cancelled = true;
    };
  }, [memoryId, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-roseIvory px-6 text-center">
        <p className="font-body text-ruby/70 text-sm">{error}</p>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-roseIvory">
        <InfinityLoader />
      </div>
    );
  }

  const stories = memory.stories;
  const memoryIndex = stories.findIndex((s) => s.id === storyId);

  if (memoryIndex === -1) {
    notFound();
  }

  const story = stories[memoryIndex];
  const previousMemory = memoryIndex > 0 ? stories[memoryIndex - 1] : null;
  const nextMemory = memoryIndex < stories.length - 1 ? stories[memoryIndex + 1] : null;

  const contentImages = story.content_images.map((src) => ({
    src,
    alt: story.title || "Memory photo",
  }));

  return (
    <main>
      <PageTransition stages={5} delay={200} initialDelay={100}>
        <StoryUnfoldHero
          title={story.title ?? ""}
          date={story.date ?? ""}
          image={story.image_url ?? "/images/logo.png"}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <SectionLabel>One Moment To Remember</SectionLabel>

          <StoryContent
            story={story.content}
            date={story.date ?? ""}
            contentImages={contentImages}
          />

          <SectionLabel>Every Second Since</SectionLabel>

          <CounterCard date={story.date ?? ""} />


          <SectionLabel>one little secret</SectionLabel>
          <SpecialMessage
            songTitle="The song that remembers us"
            spotifyUrl={story.spotify_url ?? undefined}
          />

          <StoryNavigation
            memoryId={memoryId}
            prevMemory={previousMemory}
            nextMemory={nextMemory}
          />
        </div>
      </PageTransition>
    </main>
  );
}
