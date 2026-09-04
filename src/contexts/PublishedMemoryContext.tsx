"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { ApiClientError } from "@/services/apiClient";
import { memoryService } from "@/services/memoryService";
import {
  clearMemorySession,
  getMemoryToken,
  subscribeMemorySession,
} from "@/services/tokenStorage";
import type { PublishedMemory } from "@/types/memory";

interface PublishedMemoryState {
  memoryId: string;
  memory: PublishedMemory | null;
  error: unknown;
}

const PublishedMemoryContext = createContext<PublishedMemoryState | null>(null);
const getServerToken = () => null;

/** One RAM-only cache for this memory and this exact view token. */
function MemorySession({
  memoryId,
  token,
  children,
}: {
  memoryId: string;
  token: string | null;
  children: ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const [memory, setMemory] = useState<PublishedMemory | null>(null);
  const [error, setError] = useState<unknown>(null);
  // Retain both the in-flight request and its successful result across routes.
  // This also deduplicates React Strict Mode's effect replay.
  const request = useRef<Promise<PublishedMemory> | null>(null);

  useEffect(() => {
    // Entry/PIN and Setup keep their own existing flows; neither needs this GET.
    if (segment !== "home" && segment !== "inf") return;
    if (!token) {
      router.replace(`/m/${memoryId}`);
      return;
    }

    let cancelled = false;
    request.current ??= memoryService.getPublishedMemory(memoryId, token);
    request.current
      .then((data) => {
        if (cancelled || getMemoryToken(memoryId, "view") !== token) return;
        setMemory(data);
        setError(null);
      })
      .catch((err: unknown) => {
        // A late response from an old session must never affect a new one.
        if (cancelled || getMemoryToken(memoryId, "view") !== token) return;
        request.current = null;
        if (err instanceof ApiClientError && err.status === 401) {
          // The subscription drops this cache immediately; the no-token branch
          // above redirects the protected route back to its existing PIN gate.
          clearMemorySession(memoryId);
          return;
        }
        setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [memoryId, token, segment, router]);

  return (
    <PublishedMemoryContext.Provider value={{ memoryId, memory, error }}>
      {children}
    </PublishedMemoryContext.Provider>
  );
}

export function PublishedMemoryProvider({
  memoryId,
  children,
}: {
  memoryId: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const subscribe = useCallback(
    (onChange: () => void) => subscribeMemorySession(memoryId, onChange),
    [memoryId],
  );
  // Re-read storage on every navigation too, including Story -> Story. This
  // catches expiry or external storage changes before rendering cached content.
  const getSnapshot = useCallback(
    () => getMemoryToken(memoryId, "view"),
    // pathname is intentionally a dependency even though the token is ID-scoped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [memoryId, pathname],
  );
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerToken);

  return (
    <MemorySession key={JSON.stringify([memoryId, token])} memoryId={memoryId} token={token}>
      {children}
    </MemorySession>
  );
}

export function usePublishedMemory(memoryId: string): PublishedMemoryState {
  const context = useContext(PublishedMemoryContext);
  if (!context || context.memoryId !== memoryId) {
    throw new Error("usePublishedMemory requires the matching memory layout");
  }
  return context;
}
