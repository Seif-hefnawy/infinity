"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import PinInput from "@/components/welcome/PinInput";
import NumericKeypad from "@/components/welcome/NumericKeypad";
import PageTransition from "@/components/shared/PageTransition";
import InfinityLoader from "@/components/shared/InfinityLoader";
import { memoryService } from "@/services/memoryService";
import { getMemoryToken, setMemoryToken } from "@/services/tokenStorage";
import { ApiClientError } from "@/services/apiClient";

interface PinGateProps {
  memoryId: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_pin: "PIN incorrect, please try again",
  locked: "Too many attempts - please wait a few minutes and try again",
  not_published: "This memory isn't ready to view yet",
};

export default function PinGate({ memoryId }: PinGateProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  // Returning visitor with a still-valid session skips straight to /home -
  // no flash of the PIN pad.
  useEffect(() => {
    const existingViewToken = getMemoryToken(memoryId, "view");
    if (existingViewToken) {
      router.replace(`/m/${memoryId}/home`);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with sessionStorage on mount, no async work needed for this branch
    setChecking(false);
  }, [memoryId, router]);

  const handlePinChange = (value: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + value);
      setError("");
      setShowError(false);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Please enter complete PIN");
      setShowError(true);
      return;
    }

    try {
      const result = await memoryService.verifyPin(memoryId, pin);

      if (result.verified && result.view_token) {
        setMemoryToken(memoryId, "view", result.view_token, result.view_token_expires_in_minutes ?? 1440);
        if (result.edit_token) {
          setMemoryToken(memoryId, "edit", result.edit_token, result.edit_token_expires_in_minutes ?? 30);
        }
        setError("");
        setShowError(false);
        router.push(`/m/${memoryId}/home`);
        return;
      }

      const message = (result.error && ERROR_MESSAGES[result.error]) || "PIN incorrect, please try again";
      setError(message);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setPin("");
        setError("");
      }, 1500);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong, please try again");
      setShowError(true);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError("");
    setShowError(false);
  };

  const handleClear = () => {
    setPin("");
    setError("");
    setShowError(false);
  };

  if (checking) {
    return <InfinityLoader variant="page" />;
  }

  return (
    <PinPageFrame>
      <div className="relative z-10 flex flex-col items-center">
        <PageTransition stages={4} delay={200} initialDelay={100}>
          <h1 className="font-heading text-ruby text-3xl md:text-4xl text-center font-bold leading-tight">
            A Special Memory Is Waiting For You
          </h1>

          <p className="font-body text-ruby/70 text-center mt-3 text-xs md:text-sm">
            Enter your secret PIN to unlock your memories.
          </p>

          <div className="mt-8 w-full flex justify-center">
            <PinInput pin={pin} error={showError} />
          </div>

          <div className="mt-8 w-full max-w-xs mx-auto flex justify-center">
            <NumericKeypad
              onPress={handlePinChange}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          </div>
        </PageTransition>

        {error && (
          <p className="text-error text-sm font-body mt-4 animate-shake text-center">
            {error}
          </p>
        )}
      </div>
    </PinPageFrame>
  );
}

// Mount the PIN page decoration only after the session check requires the form.
function PinPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-roseIvory relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 romantic-linear opacity-30" />
      <div className="absolute inset-0 glass" />

      {/* 3D White Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-linear-to-br from-ruby/30 via-roseIvory to-ruby/20 rounded-3xl blur-sm" />

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl md:rounded-4xl p-8 md:p-10 shadow-2xl border border-white/30 relative overflow-hidden transform-gpu perspective-1000 rotate-x-2">
          {/* 3D Depth Effects */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-ruby/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-ruby/5 rounded-full blur-2xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

          {/* Subtle Linear Gradients */}
          <div className="absolute inset-0 bg-linear-to-b from-ruby/5 via-transparent to-ruby/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-ruby/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-linear-to-l from-ruby/5 to-transparent pointer-events-none" />

          {/* Flower Decoration - Top Right */}
          <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 z-20">
            <span className="text-5xl md:text-6xl text-ruby/20 rotate-99 inline-block">
              🌹
            </span>
          </div>

          {/* Flower Decoration - Bottom Left (mirrored) */}
          <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-20">
            <span className="text-4xl md:text-5xl text-ruby/15 -rotate-12 inline-block scale-x-[-1]">
              🌹
            </span>
          </div>

          {/* MemoryEntryPage has already checked that this memory is published. */}
          {children}
        </div>
      </div>
    </div>
  );
}
