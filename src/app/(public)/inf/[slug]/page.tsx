import { notFound } from "next/navigation";
import Link from "next/link";

import { memories } from "@/data/memories";

import StoryUnfoldHero from "@/components/memory/story/StoryUnfoldHero";
import SpecialMessage from "@/components/memory/story/SpecialMessage";
import StoryNavigation from "@/components/memory/story/StoryNavigation";

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
      {/* =========================
          HERO
      ========================== */}

      <StoryUnfoldHero
        title={memory.title}
        date={memory.date}
        image={memory.image}
      />

      {/* =========================
          SECRET MESSAGE
      ========================== */}

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        <SpecialMessage message={memory.specialMessage} />

        <StoryNavigation prevMemory={previousMemory} nextMemory={nextMemory} />
      </section>

      {/* =========================
          FOOTER NAVIGATION
      ========================== */}
    </main>
  );
}
