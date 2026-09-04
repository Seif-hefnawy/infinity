import type { ReactNode } from "react";
import { PublishedMemoryProvider } from "@/contexts/PublishedMemoryContext";

export default async function MemoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ memoryId: string }>;
}) {
  const { memoryId } = await params;
  return (
    <PublishedMemoryProvider key={memoryId} memoryId={memoryId}>
      {children}
    </PublishedMemoryProvider>
  );
}
