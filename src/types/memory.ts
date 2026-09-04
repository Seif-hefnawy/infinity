// Types mirroring the FastAPI backend's actual response/request shapes -
// see API_CONTRACT.md in the backend repo for the source of truth.

export type MemoryStatus = "NOT_SETUP" | "PUBLISHED";

// GET /api/memory/{memoryId}/status - ALWAYS returns 200; memory_exists
// tells you whether the ID is real. There is no 404 case to catch here.
export interface MemoryResolution {
  memory_exists: boolean;
  memory_id: string | null;
  status: MemoryStatus | null;
}

export interface ImageItem {
  id: string;
  file_url: string;
  caption: string | null;
  sort_order: number;
}

export interface StoryItem {
  id: string;
  title: string | null;
  content: string | null;
  image_url: string | null; // cover image - shown in the carousel and as the story's hero image
  content_images: string[]; // up to 3 additional in-story images
  spotify_url: string | null; // this story's own song
  caption: string | null;
  date: string | null;
  sort_order: number;
}

export interface MusicItem {
  id: string;
  music_url: string;
}

// GET /api/memory/{memoryId} - the PIN-gated published view
export interface PublishedMemory {
  memory_id: string;
  status: MemoryStatus;
  title: string | null;
  images: ImageItem[];
  stories: StoryItem[];
  special_message: string | null;
  music: MusicItem | null;
  created_at: string;
}

// GET/PUT /api/memory/{memoryId}/setup
export interface SetupData {
  memory_id: string;
  status: string;
  title: string | null;
  images: ImageItem[];
  stories: StoryItem[];
  special_message: string | null;
  music: MusicItem | null;
}

// Sent to PUT /api/memory/{memoryId}/setup - only send fields you want to
// change. NOTE: `stories` REPLACES the entire stories array each call -
// always send the complete, current list of stories, not a partial patch.
export interface StoryInput {
  title?: string;
  content?: string;
  image_url?: string;
  content_images?: string[];
  spotify_url?: string;
  caption?: string;
  date?: string;
  sort_order?: number;
}

export interface SetupSavePayload {
  title?: string;
  stories?: StoryInput[];
  special_message?: string;
  music_url?: string;
}

export interface VerifyPinResult {
  verified: boolean;
  edit_token: string | null;
  view_token: string | null;
  edit_token_expires_in_minutes: number | null;
  view_token_expires_in_minutes: number | null;
  error: "invalid_pin" | "locked" | "not_published" | null;
}
