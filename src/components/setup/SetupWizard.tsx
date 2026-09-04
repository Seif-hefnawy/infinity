"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { setupService } from "@/services/setupService";
import { ApiClientError } from "@/services/apiClient";

import StoriesStep from "./StoriesStep";
import StoryDataStep from "./StoryDataStep";
import PinStep from "./PinStep";

import type { StoryDraft } from "./types";

import InfinityLoader from "@/components/shared/InfinityLoader";


type WizardStep = "stories" | "storyData" | "pin";


interface SetupWizardProps {
  memoryId: string;
  token: string;
}


function toStoryDrafts(
  stories: {
    id: string;
    title: string | null;
    date: string | null;
    image_url: string | null;
    content: string | null;
    content_images: string[];
    spotify_url: string | null;
  }[]
): StoryDraft[] {
  return stories.map((s) => ({
    localId: s.id,
    title: s.title ?? "",
    date: s.date ?? "",
    image_url: s.image_url ?? "",
    content: s.content ?? "",
    content_images: s.content_images,
    spotify_url: s.spotify_url ?? "",
  }));
}


function toStoryInputs(stories: StoryDraft[]) {
  return stories.map((s, idx) => ({
    title: s.title,
    content: s.content,
    image_url: s.image_url || undefined,
    content_images: s.content_images,
    spotify_url: s.spotify_url || undefined,
    date: s.date || undefined,
    sort_order: idx,
  }));
}


export default function SetupWizard({
  memoryId,
  token,
}: SetupWizardProps) {
  const router = useRouter();

  const [step, setStep] =
    useState<WizardStep>("stories");

  const [loading, setLoading] =
    useState(true);

  const [stories, setStories] =
    useState<StoryDraft[]>([]);

  const [isSavingProgress, setIsSavingProgress] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const [isSubmittingPin, setIsSubmittingPin] =
    useState(false);

  const [pinError, setPinError] =
    useState("");


  // ---------------------------------------------------------
  // LOAD EXISTING SETUP DATA
  // ---------------------------------------------------------

  useEffect(() => {
    setupService
      .getSetupData(memoryId, token)
      .then((data) => {
        if (data.stories.length > 0) {
          setStories(
            toStoryDrafts(data.stories)
          );
        } else {
          setStories([
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
        }
      })
      .catch(() => {
        setStories([
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [memoryId, token]);


  // ---------------------------------------------------------
  // SAVE PROGRESS + NEXT STEP
  // ---------------------------------------------------------

  const saveProgressAndAdvance = async (
    nextStep: WizardStep
  ) => {
    setSaveError("");
    setIsSavingProgress(true);

    try {
      await setupService.saveSetup(
        memoryId,
        token,
        {
          stories: toStoryInputs(stories),
        }
      );

      setStep(nextStep);
    } catch (err) {
      setSaveError(
        err instanceof ApiClientError
          ? `Couldn't save your progress: ${err.message}`
          : "Couldn't save your progress - please check your connection and try again."
      );
    } finally {
      setIsSavingProgress(false);
    }
  };


  // ---------------------------------------------------------
  // PUBLISH MEMORY
  // ---------------------------------------------------------

  const handlePublish = async (
    pin: string
  ) => {
    setIsSubmittingPin(true);
    setPinError("");

    try {
      // Save latest Story data first.
      await setupService.saveSetup(
        memoryId,
        token,
        {
          stories: toStoryInputs(stories),
        }
      );

      // Publish Memory + save PIN.
      await setupService.completeSetup(
        memoryId,
        token,
        pin
      );

      // Memory is now PUBLISHED.
      // Go directly to the public NFC URL.
      // The public flow will show the PIN screen.
      router.replace(`/m/${memoryId}`);
    } catch (err) {
      setPinError(
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong, please try again."
      );
    } finally {
      setIsSubmittingPin(false);
    }
  };


  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return <InfinityLoader label="Loading your setup..." />;
  }


  // ---------------------------------------------------------
  // WIZARD
  // ---------------------------------------------------------

  return (
    <>
      {saveError && (
        <p className="text-error text-sm mb-4 text-center">
          {saveError}
        </p>
      )}

      {step === "stories" && (
        <StoriesStep
          memoryId={memoryId}
          token={token}
          stories={stories}
          onChange={setStories}
          onNext={() =>
            saveProgressAndAdvance("storyData")
          }
          isSaving={isSavingProgress}
        />
      )}

      {step === "storyData" && (
        <StoryDataStep
          memoryId={memoryId}
          token={token}
          stories={stories}
          onChange={setStories}
          onBack={() =>
            setStep("stories")
          }
          onNext={() =>
            saveProgressAndAdvance("pin")
          }
          isSaving={isSavingProgress}
        />
      )}

      {step === "pin" && (
        <PinStep
          onBack={() =>
            setStep("storyData")
          }
          onSubmit={handlePublish}
          isSubmitting={isSubmittingPin}
          error={pinError}
        />
      )}
    </>
  );
}
