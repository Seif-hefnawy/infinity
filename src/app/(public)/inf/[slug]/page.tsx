import { notFound } from "next/navigation";
import { memories } from "@/data/memories";
import PageTransition from "@/components/shared/PageTransition";
import StoryUnfoldHero from "@/components/memory/story/StoryUnfoldHero";
import SpecialMessage from "@/components/memory/story/SpecialMessage";
import StoryNavigation from "@/components/memory/story/StoryNavigation";
import CounterCard from "@/components/memory/story/CounterCard";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  const memoryIndex = memories.findIndex((memory) => memory.slug === slug);

  if (memoryIndex === -1) {
    notFound();
  }

  const memory = memories[memoryIndex];
  const previousMemory = memoryIndex > 0 ? memories[memoryIndex - 1] : null;
  const nextMemory = memoryIndex < memories.length - 1 ? memories[memoryIndex + 1] : null;

  return (
    <main>
      <PageTransition stages={4} delay={200} initialDelay={100}>

        {/* ===== SECTION 1 – HERO ===== */}
        <StoryUnfoldHero
          title={memory.title}
          date={memory.date}
          image={memory.image}
        />

        {/* ===== SECTION 2 – COUNTER ===== */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 xl:max-w-3xl">
          <CounterCard />
        </section>

        {/* ===== SECTION 3 – SPECIAL MESSAGE ===== */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 xl:max-w-3xl">
          <SpecialMessage
            message={memory.specialMessage}
            songTitle="The song that remembers us"
            spotifyUrl={memory.spotifyUrl}
          />
        </section>

        {/* ===== SECTION 4 – NAVIGATION ===== */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 pb-20 sm:pb-28 xl:max-w-3xl">
          <StoryNavigation
            prevMemory={previousMemory}
            nextMemory={nextMemory}
          />
        </section>

      </PageTransition>
    </main>
  );
}