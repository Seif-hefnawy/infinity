// src/app/m/[memoryId]/inf/[storyId]/page.tsx
//
// Individual story detail. Fully gated behind the client-held view token
// (same reasoning as /home) - thin Server Component shell handing off to
// a Client Component.
import StoryGate from "./StoryGate";

interface PageProps {
  params: Promise<{ memoryId: string; storyId: string }>;
}

export default async function StoryPage({ params }: PageProps) {
  const { memoryId, storyId } = await params;
  return <StoryGate memoryId={memoryId} storyId={storyId} />;
}
