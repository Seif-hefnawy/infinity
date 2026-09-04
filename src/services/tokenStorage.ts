/**
 * Client-side storage for every token this app uses. There are no httpOnly
 * cookies here - the frontend calls the backend directly from Client
 * Components, so tokens have to live somewhere browser JS can attach them
 * as a Bearer header.
 *
 * Trade-off, explicit: this means a token is readable by any script on the
 * page (XSS risk). Mitigated by every token being short-lived (see the
 * backend's .env.example expiry settings) and, for memory tokens, scoped
 * to a single Memory. If this ever needs to be hardened later, this file
 * is the only place that would change.
 */
"use client";

const ADMIN_TOKEN_KEY = "memory_admin_token";
const MEMORY_SESSION_CHANGED = "memory-session-changed";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// --- Memory-scoped tokens (setup/view/edit), for the public pages ---

export type MemoryTokenKind = "setup" | "view" | "edit";

interface StoredToken {
  token: string;
  expiresAt: number; // epoch ms
}

type MemorySession = Partial<Record<MemoryTokenKind, StoredToken>>;

function storageKey(memoryId: string): string {
  return `memory_session:${memoryId}`;
}

function readSession(memoryId: string): MemorySession {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(storageKey(memoryId));
    return raw ? (JSON.parse(raw) as MemorySession) : {};
  } catch {
    return {};
  }
}

function writeSession(memoryId: string, session: MemorySession): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey(memoryId), JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(MEMORY_SESSION_CHANGED, { detail: memoryId }));
}

export function setMemoryToken(
  memoryId: string,
  kind: MemoryTokenKind,
  token: string,
  expiresInMinutes: number
): void {
  const session = readSession(memoryId);
  session[kind] = { token, expiresAt: Date.now() + expiresInMinutes * 60_000 };
  writeSession(memoryId, session);
}

export function getMemoryToken(memoryId: string, kind: MemoryTokenKind): string | null {
  const entry = readSession(memoryId)[kind];
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) return null;
  return entry.token;
}

export function clearMemorySession(memoryId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(storageKey(memoryId));
  window.dispatchEvent(new CustomEvent(MEMORY_SESSION_CHANGED, { detail: memoryId }));
}

/** Observe the existing view session without storing any published content. */
export function subscribeMemorySession(memoryId: string, onChange: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const checkSession = () => {
    clearTimeout(timer);
    onChange();
    const expiresAt = readSession(memoryId).view?.expiresAt;
    if (expiresAt && expiresAt > Date.now()) {
      // Cap long timeouts at the browser's signed 32-bit timer limit.
      timer = setTimeout(checkSession, Math.min(expiresAt - Date.now() + 1, 2_147_483_647));
    }
  };
  const onSessionChange = (event: Event) => {
    if ((event as CustomEvent<string>).detail === memoryId) checkSession();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === window.sessionStorage &&
        (event.key === null || event.key === storageKey(memoryId))) checkSession();
  };

  window.addEventListener(MEMORY_SESSION_CHANGED, onSessionChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", checkSession);
  window.addEventListener("pageshow", checkSession);
  document.addEventListener("visibilitychange", checkSession);
  checkSession();

  return () => {
    clearTimeout(timer);
    window.removeEventListener(MEMORY_SESSION_CHANGED, onSessionChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", checkSession);
    window.removeEventListener("pageshow", checkSession);
    document.removeEventListener("visibilitychange", checkSession);
  };
}
