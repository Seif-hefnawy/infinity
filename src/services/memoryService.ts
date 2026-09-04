import { apiClient } from "./apiClient";
import { ImageItem, MemoryResolution, PublishedMemory, VerifyPinResult } from "@/types/memory";

export const memoryService = {
  // Always returns 200 - check memory_exists, never a 404 status.
  resolveMemory: (memoryId: string) =>
    apiClient.get<MemoryResolution>(`/api/memory/${memoryId}/status`),

  verifyPin: (memoryId: string, pin: string) =>
    apiClient.post<VerifyPinResult>(`/api/memory/${memoryId}/verify-pin`, { pin }),

  // Requires a "view" token from verifyPin - the memory_id alone is never
  // enough to read this, by design.
  getPublishedMemory: (memoryId: string, viewToken: string) =>
    apiClient.get<PublishedMemory>(`/api/memory/${memoryId}`, { token: viewToken }),
};

export type { ImageItem };
