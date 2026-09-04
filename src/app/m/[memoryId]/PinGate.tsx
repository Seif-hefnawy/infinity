"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PinInput from "@/components/welcome/PinInput";
import NumericKeypad from "@/components/welcome/NumericKeypad";
import PageTransition from "@/components/shared/PageTransition";
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
    return <div className="min-h-[420px]" aria-hidden />;
  }

  return (
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
  );
}
