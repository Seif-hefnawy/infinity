// src/app/m/[memoryId]/setup/page.tsx
//
// Where a customer builds their own memory the first time they open their
// link. Server Component: one direct, unauthenticated status check - if
// it's already published, setup is done, send them to the PIN gate
// instead of showing the wizard again. The wizard itself is a Client
// Component since every step after email verification needs a
// browser-held token.
import { notFound, redirect } from "next/navigation";
import { memoryService } from "@/services/memoryService";
import SetupGate from "./SetupGate";

interface PageProps {
  params: Promise<{ memoryId: string }>;
}

export default async function SetupPage({ params }: PageProps) {
  const { memoryId } = await params;
  const resolution = await memoryService.resolveMemory(memoryId);

  if (!resolution.memory_exists) {
    notFound();
  }

  if (resolution.status === "PUBLISHED") {
    redirect(`/m/${memoryId}`);
  }

  return (
    <div className="min-h-screen bg-roseIvory relative overflow-hidden px-4 py-10 md:py-16">
      <div className="absolute inset-0 bg-linear-to-br from-roseIvory via-ruby/5 to-roseIvory" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-ruby text-3xl md:text-4xl font-bold">
            Set Up Your Memory
          </h1>
          <p className="font-body text-ruby/60 text-xs md:text-sm mt-2">
            Let&apos;s verify it&apos;s you, then build something beautiful.
          </p>
        </div>

        <SetupGate memoryId={memoryId} />
      </div>
    </div>
  );
}
