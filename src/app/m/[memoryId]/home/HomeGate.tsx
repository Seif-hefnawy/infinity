"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { memoryService } from "@/services/memoryService";
import { clearMemorySession, getMemoryToken } from "@/services/tokenStorage";
import { ApiClientError } from "@/services/apiClient";
import type { PublishedMemory } from "@/types/memory";
import HomeClient from "./HomeClient";
import InfinityLoader from "@/components/shared/InfinityLoader";

interface HomeGateProps {
  memoryId: string;
}

export default function HomeGate({ memoryId }: HomeGateProps) {
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
        setError(err instanceof ApiClientError ? err.message : "Something went wrong loading your memory.");
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

  return <HomeClient memoryId={memoryId} memory={memory} />;
}
