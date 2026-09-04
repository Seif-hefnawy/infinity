"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { setupService } from "@/services/setupService";
import { ApiClientError } from "@/services/apiClient";

import { MAX_CONTENT_IMAGES_PER_STORY, type StoryDraft } from "./types";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/mpo",
];

const ACCEPTED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".mpo",
];

const isAcceptedImage = (file: File) => {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  return (
    ACCEPTED_TYPES.includes(file.type.toLowerCase()) ||
    ACCEPTED_EXTENSIONS.includes(extension)
  );
};

interface StoryDataStepProps {
  memoryId: string;
  token: string;
  stories: StoryDraft[];
  onChange: (stories: StoryDraft[]) => void;
  onBack: () => void;
  onNext: () => void;
  isSaving: boolean;
}

function toStoryInputs(stories: StoryDraft[]) {
  return stories.map((story, index) => ({
    title: story.title,
    content: story.content,

    image_url: story.image_url || undefined,

    content_images: story.content_images,

    spotify_url: story.spotify_url || undefined,

    date: story.date || undefined,

    sort_order: index,
  }));
}

// ============================================================
// STORY CONTENT IMAGES
// ============================================================

function MemoryImagesUpload({
  memoryId,
  token,
  images,
  onChange,
}: {
  memoryId: string;
  token: string;
  images: string[];

  onChange: (images: string[]) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState("");

  // ========================================================
  // ADD IMAGE
  // ========================================================

  const handleFile = async (file: File | null) => {
    if (!file) return;

    if (images.length >= MAX_CONTENT_IMAGES_PER_STORY) {
      return;
    }

    if (!isAcceptedImage(file)) {
      setError("Use a JPEG, PNG, WEBP, HEIC, or HEIF image , or MPO image.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      // 1) Upload image to S3.
      const uploaded = await setupService.uploadImage(memoryId, token, file);

      // 2) Immediately save its URL inside
      // this Story's content_images array.
      await onChange([...images, uploaded.file_url]);

      // Allow selecting the same file again later.
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  // ========================================================
  // REMOVE IMAGE
  // ========================================================

  const handleRemove = async (indexToRemove: number) => {
    if (busy) return;

    setError("");
    setBusy(true);

    try {
      const updatedImages = images.filter(
        (_, index) => index !== indexToRemove,
      );

      /*
       * Backend flow:
       *
       * 1. Receives Story without this URL.
       * 2. Saves MongoDB successfully.
       * 3. Compares old URLs with new URLs.
       * 4. Detects that this URL disappeared.
       * 5. Deletes the old file from S3.
       */
      await onChange(updatedImages);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Couldn't remove the image.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-heading text-ruby/70">
        Memory images ({images.length}/{MAX_CONTENT_IMAGES_PER_STORY})
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* Existing images */}
        {images.map((url, index) => (
          <div
            key={url}
            className="relative w-14 h-14 rounded-xl overflow-hidden border border-ruby/10 group"
          >
            <Image
              src={url}
              alt={`Memory image ${index + 1}`}
              fill
              className="object-cover"
              sizes="56px"
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={busy}
              className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              aria-label="Remove image"
            >
              {busy ? "..." : "✕"}
            </button>
          </div>
        ))}

        {/* Add new image */}
        {images.length < MAX_CONTENT_IMAGES_PER_STORY && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={[...ACCEPTED_TYPES, ...ACCEPTED_EXTENSIONS].join(",")}
              hidden
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="w-14 h-14 rounded-xl border-2 border-dashed border-ruby/30 text-ruby/50 flex items-center justify-center text-xs hover:bg-ruby/5 transition-all disabled:opacity-50"
            >
              {busy ? "..." : "+ Add"}
            </button>
          </>
        )}
      </div>

      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}

// ============================================================
// STORY DATA STEP
// ============================================================

export default function StoryDataStep({
  memoryId,
  token,
  stories,
  onChange,
  onBack,
  onNext,
  isSaving,
}: StoryDataStepProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [error, setError] = useState("");

  const [isSavingImage, setIsSavingImage] = useState(false);

  // ========================================================
  // NORMAL STATE UPDATE
  // ========================================================

  const updateStory = (localId: string, patch: Partial<StoryDraft>) => {
    onChange(
      stories.map((story) =>
        story.localId === localId
          ? {
              ...story,
              ...patch,
            }
          : story,
      ),
    );
  };

  // ========================================================
  // UPDATE STORY + SAVE IMMEDIATELY
  //
  // Used for content image add/remove so S3 and Mongo
  // remain synchronized.
  // ========================================================

  const updateAndSaveStory = async (
    localId: string,
    patch: Partial<StoryDraft>,
  ) => {
    setIsSavingImage(true);

    try {
      const updatedStories = stories.map((story) =>
        story.localId === localId
          ? {
              ...story,
              ...patch,
            }
          : story,
      );

      // Save to backend first.
      await setupService.saveSetup(memoryId, token, {
        stories: toStoryInputs(updatedStories),
      });

      // Only update frontend state
      // after backend save succeeds.
      onChange(updatedStories);
    } finally {
      setIsSavingImage(false);
    }
  };

  const activeStory = stories[activeIndex];

  // ========================================================
  // NEXT
  // ========================================================

  const handleNext = () => {
    const incomplete = stories.some((story) => !story.content.trim());

    if (incomplete) {
      setError("Every story needs a message/description.");
      return;
    }

    setError("");

    onNext();
  };

  if (!activeStory) {
    return null;
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-heading text-ruby text-xl font-bold">
          Step 2 - Story Data
        </h2>

        <p className="text-ruby/50 text-xs mt-1">
          Fill in the details for each story.
        </p>
      </div>

      {/* Story tabs */}
      <div className="flex flex-wrap gap-2">
        {stories.map((story, index) => (
          <button
            key={story.localId}
            type="button"
            onClick={() => setActiveIndex(index)}
            disabled={isSavingImage}
            className={`px-3 py-1.5 rounded-full text-xs font-heading transition-all disabled:opacity-50 ${
              index === activeIndex
                ? "ruby-gradient text-white shadow-md"
                : "border border-ruby/20 text-ruby/60 hover:bg-ruby/5"
            }`}
          >
            {story.title || `Story ${index + 1}`}

            {story.content.trim() && index !== activeIndex ? " ✓" : ""}
          </button>
        ))}
      </div>

      {/* Active Story */}
      <div className="bg-white/60 rounded-2xl p-5 border border-ruby/10 space-y-4">
        {/* Story message */}
        <textarea
          placeholder="Story message/description"
          rows={4}
          value={activeStory.content}
          onChange={(e) =>
            updateStory(activeStory.localId, {
              content: e.target.value,
            })
          }
          className="w-full px-3 py-2 rounded-lg border border-ruby/20 bg-white/70 text-ruby/90 text-sm focus:outline-none focus:border-ruby/50"
        />

        {/* Up to 3 Story images */}
        <MemoryImagesUpload
          memoryId={memoryId}
          token={token}
          images={activeStory.content_images}
          onChange={async (images) => {
            await updateAndSaveStory(activeStory.localId, {
              content_images: images,
            });
          }}
        />

        {/* Spotify */}
        <div>
          <label className="block text-xs font-heading text-ruby/70 mb-1">
            Spotify song (optional)
          </label>

          <input
            type="text"
            placeholder="https://open.spotify.com/embed/track/..."
            value={activeStory.spotify_url}
            onChange={(e) =>
              updateStory(activeStory.localId, {
                spotify_url: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-ruby/20 bg-white/70 text-ruby text-sm focus:outline-none focus:border-ruby/50"
          />
        </div>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving || isSavingImage}
          className="flex-1 py-3 rounded-full border border-ruby/20 text-ruby/70 font-heading text-sm hover:bg-ruby/5 transition-all disabled:opacity-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving || isSavingImage}
          className="flex-1 py-3 rounded-full ruby-gradient text-white font-heading text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isSaving || isSavingImage ? "Saving..." : "Continue to PIN"}
        </button>
      </div>
    </div>
  );
}
