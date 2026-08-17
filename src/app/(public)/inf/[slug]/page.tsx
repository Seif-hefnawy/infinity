import { notFound } from "next/navigation";

import { memories } from "@/data/memories";

import PageTransition from "@/components/shared/PageTransition";
import StoryUnfoldHero from "@/components/memory/story/StoryUnfoldHero";
import StoryContent from "@/components/memory/story/StoryContent";
import CounterCard from "@/components/memory/story/CounterCard";
import SpecialMessage from "@/components/memory/story/SpecialMessage";
import StoryNavigation from "@/components/memory/story/StoryNavigation";
import SectionLabel from "@/components/memory/story/SectionLabel";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  const memoryIndex = memories.findIndex((memory) => memory.slug === slug);

  if (memoryIndex === -1) {
    notFound();
  }

  const memory = memories[memoryIndex];

  const previousMemory = memoryIndex > 0 ? memories[memoryIndex - 1] : null;

  const nextMemory =
    memoryIndex < memories.length - 1 ? memories[memoryIndex + 1] : null;

  return (
    <main>
      <PageTransition stages={5} delay={200} initialDelay={100}>
        <StoryUnfoldHero
          title={memory.title}
          date={memory.date}
          image={memory.image}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <SectionLabel>One Moment To Remember</SectionLabel>

          <StoryContent
            story={memory.story}
            date={memory.date}
            contentImage={memory.contentImage}
          />

          <SectionLabel>Every Second Since</SectionLabel>

          <CounterCard date={memory.date} />

          
          <SectionLabel>one little secret</SectionLabel>
          <SpecialMessage
            songTitle="The song that remembers us"
            spotifyUrl={memory.spotifyUrl}
          />

          <StoryNavigation
            prevMemory={previousMemory}
            nextMemory={nextMemory}
          />
        </div>
      </PageTransition>
    </main>
  );
}
