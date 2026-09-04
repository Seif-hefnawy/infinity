"use client";

import { ApiClientError } from "@/services/apiClient";
import { usePublishedMemory } from "@/contexts/PublishedMemoryContext";
import HomeClient from "./HomeClient";
import InfinityLoader from "@/components/shared/InfinityLoader";

interface HomeGateProps {
  memoryId: string;
}

export default function HomeGate({ memoryId }: HomeGateProps) {
  const { memory, error } = usePublishedMemory(memoryId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-roseIvory px-6 text-center">
        <p className="font-body text-ruby/70 text-sm">
          {error instanceof ApiClientError ? error.message : "Something went wrong loading your memory."}
        </p>
      </div>
    );
  }

  if (!memory) {
    return <InfinityLoader variant="page" />;
  }

  return <HomeClient memoryId={memoryId} memory={memory} />;
}
