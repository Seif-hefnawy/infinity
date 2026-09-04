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

  return <PinGate memoryId={memoryId} />;
}
