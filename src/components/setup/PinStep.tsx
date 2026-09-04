"use client";

import { useState } from "react";

interface PinStepProps {
  onBack: () => void;
  onSubmit: (pin: string) => void;
  isSubmitting: boolean;
  error?: string;
}

export default function PinStep({ onBack, onSubmit, isSubmitting, error }: PinStepProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = () => {
    if (!/^\d{4}$/.test(pin)) {
      setLocalError("PIN must be exactly 4 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setLocalError("PINs don't match.");
      return;
    }
    setLocalError("");
    onSubmit(pin);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-ruby text-xl font-bold">Step 3 - PIN</h2>
        <p className="text-ruby/50 text-xs mt-1">
          Choose the PIN your recipient will enter to unlock this memory.
        </p>
      </div>

      <div>
        <label className="block text-xs font-heading text-ruby/70 mb-1">Create PIN</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="4-digit PIN"
          className="w-full px-4 py-3 rounded-xl border border-ruby/20 bg-white/60 text-ruby text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-ruby/50"
        />
      </div>

      <div>
        <label className="block text-xs font-heading text-ruby/70 mb-1">Confirm PIN</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
          placeholder="Confirm PIN"
          className="w-full px-4 py-3 rounded-xl border border-ruby/20 bg-white/60 text-ruby text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-ruby/50"
        />
      </div>

      {(localError || error) && <p className="text-error text-sm">{localError || error}</p>}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-full border border-ruby/20 text-ruby/70 font-heading text-sm hover:bg-ruby/5 transition-all disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-full ruby-gradient text-white font-heading text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Memory"}
        </button>
      </div>
    </div>
  );
}
