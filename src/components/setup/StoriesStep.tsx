"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { setupService } from "@/services/setupService";
import { ApiClientError } from "@/services/apiClient";
import { MAX_STORIES, type StoryDraft } from "./types";

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

interface StoriesStepProps {
  memoryId: string;
  token: string;
  stories: StoryDraft[];
  onChange: (stories: StoryDraft[]) => void;
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

function StoryCoverUpload({
  memoryId,
  token,
  imageUrl,
  onUploaded,
  onRemove,
}: {
  memoryId: string;
  token: string;
  imageUrl?: string;

  onUploaded: (url: string) => Promise<void>;

  onRemove: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState("");

  // ========================================================
  // UPLOAD / REPLACE COVER
  // ========================================================

  const handleFile = async (file: File | null) => {
    if (!file) return;

    if (!isAcceptedImage(file)) {
      setError("Use a JPEG, PNG, WEBP, HEIC, or HEIF image , or MPO image.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      // 1) Upload the new image to S3.
      const uploaded = await setupService.uploadImage(memoryId, token, file);

      // 2) Save the new URL to MongoDB.
      //
      // The backend compares old/new Story image URLs.
      // If this is a Replace, the old S3 image is removed
      // only AFTER the MongoDB save succeeds.
      await onUploaded(uploaded.file_url);

      // Allows choosing the same file again later.
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
  // REMOVE COVER
  // ========================================================

  const handleRemove = async () => {
    if (!imageUrl) return;

    setError("");
    setBusy(true);

    try {
      // Save Story without the cover URL.
      //
      // Backend:
      // 1. Saves MongoDB first
      // 2. Detects old URL was removed
      // 3. Deletes old image from S3
      await onRemove();
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
      <input
        ref={inputRef}
        type="file"
        accept={[...ACCEPTED_TYPES, ...ACCEPTED_EXTENSIONS].join(",")}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div className="flex items-center gap-3 flex-wrap">
        {/* Cover preview */}
        {imageUrl && (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-ruby/10 shrink-0">
            <Image
              src={imageUrl}
              alt="Story cover"
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {/* Choose / Replace */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="px-4 py-2 rounded-lg border border-ruby/20 bg-white/60 text-ruby/70 text-sm hover:bg-ruby/5 transition-all disabled:opacity-50"
          >
            {busy
              ? "Please wait..."
              : imageUrl
                ? "Replace cover image"
                : "Choose cover image"}
          </button>

          {/* Remove */}
          {imageUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-red-200 bg-white/60 text-red-500 text-sm hover:bg-red-50 transition-all disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
}

export default function StoriesStep({
  memoryId,
  token,
  stories,
  onChange,
  onNext,
  isSaving,
}: StoriesStepProps) {
  const [error, setError] = useState("");

  const [removingStoryId, setRemovingStoryId] = useState<string | null>(null);

  // ========================================================
  // SAVE STORIES
  // ========================================================

  const saveStories = async (updatedStories: StoryDraft[]) => {
    await setupService.saveSetup(memoryId, token, {
      stories: toStoryInputs(updatedStories),
    });

    onChange(updatedStories);
  };

  // ========================================================
  // UPDATE NORMAL STORY STATE
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
  // UPDATE + SAVE STORY
  // Used for image Replace / Remove
  // ========================================================

  const updateAndSaveStory = async (
    localId: string,
    patch: Partial<StoryDraft>,
  ) => {
    const updatedStories = stories.map((story) =>
      story.localId === localId
        ? {
            ...story,
            ...patch,
          }
        : story,
    );

    await saveStories(updatedStories);
  };

  // ========================================================
  // ADD STORY
  // ========================================================

  const addStory = () => {
    if (stories.length >= MAX_STORIES) {
      return;
    }

    onChange([
      ...stories,
      {
        localId: crypto.randomUUID(),

        title: "",
        date: "",

        image_url: "",

        content: "",
        content_images: [],

        spotify_url: "",
      },
    ]);
  };

  // ========================================================
  // REMOVE ENTIRE STORY
  // ========================================================

  const removeStory = async (localId: string) => {
    setError("");
    setRemovingStoryId(localId);

    try {
      const updatedStories = stories.filter(
        (story) => story.localId !== localId,
      );

      // Saving the reduced Story array makes the backend
      // detect every image that belonged to the removed Story.
      //
      // MongoDB is saved first, then those S3 images
      // are cleaned up.
      await saveStories(updatedStories);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Couldn't remove the story.",
      );
    } finally {
      setRemovingStoryId(null);
    }
  };

  // ========================================================
  // NEXT
  // ========================================================

  const handleNext = () => {
    if (stories.length === 0) {
      setError("Add at least one story.");
      return;
    }

    const incomplete = stories.some(
      (story) => !story.title.trim() || !story.date.trim() || !story.image_url,
    );

    if (incomplete) {
      setError("Every story needs a name, a date, and a cover image.");
      return;
    }

    setError("");

    onNext();
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-ruby text-xl font-bold">
          Step 1 - Stories
        </h2>

        <p className="text-ruby/50 text-xs mt-1">
          Add up to {MAX_STORIES} stories ({stories.length}/{MAX_STORIES}). Each
          carousel image represents one story.
        </p>
      </div>

      {stories.map((story, index) => (
        <div
          key={story.localId}
          className="bg-white/60 rounded-2xl p-5 border border-ruby/10 space-y-3"
        >
          {/* Story Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-ruby text-sm">
              Story {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeStory(story.localId)}
              disabled={removingStoryId === story.localId || isSaving}
              className="text-xs text-ruby/50 hover:text-ruby underline disabled:opacity-50"
            >
              {removingStoryId === story.localId ? "Removing..." : "Remove"}
            </button>
          </div>

          {/* Story Name */}
          <input
            type="text"
            placeholder="Story name"
            value={story.title}
            onChange={(e) =>
              updateStory(story.localId, {
                title: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-ruby/20 bg-white/70 text-ruby text-sm focus:outline-none focus:border-ruby/50"
          />

          {/* Story Date */}
          <input
            type="date"
            value={story.date}
            onChange={(e) =>
              updateStory(story.localId, {
                date: e.target.value,
              })
            }
            className="w-full h-10 px-3 rounded-lg border border-ruby/20 bg-white/70 text-ruby text-sm focus:outline-none focus:border-ruby/50 appearance-none"
          />

          {/* Cover */}
          <StoryCoverUpload
            memoryId={memoryId}
            token={token}
            imageUrl={story.image_url}
            onUploaded={async (url) => {
              await updateAndSaveStory(story.localId, {
                image_url: url,
              });
            }}
            onRemove={async () => {
              await updateAndSaveStory(story.localId, {
                image_url: "",
              });
            }}
          />
        </div>
      ))}

      {/* Add Story */}
      {stories.length < MAX_STORIES && (
        <button
          type="button"
          onClick={addStory}
          className="w-full py-3 rounded-2xl border border-dashed border-ruby/30 text-ruby/70 font-heading text-sm hover:bg-ruby/5 transition-all"
        >
          + Add a story
        </button>
      )}

      {error && <p className="text-error text-sm">{error}</p>}

      {/* Continue */}
      <button
        type="button"
        onClick={handleNext}
        disabled={isSaving || removingStoryId !== null}
        className="w-full py-3 rounded-full ruby-gradient text-white font-heading text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Continue to Story Data"}
      </button>
    </div>
  );
}
