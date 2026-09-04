"use client";

import { useEffect, useState } from "react";
import { setupService } from "@/services/setupService";
import { getMemoryToken, setMemoryToken } from "@/services/tokenStorage";
import { ApiClientError } from "@/services/apiClient";
import SetupWizard from "@/components/setup/SetupWizard";
import InfinityLoader from "@/components/shared/InfinityLoader";

interface SetupGateProps {
  memoryId: string;
}

export default function SetupGate({ memoryId }: SetupGateProps) {
  const [checkingResume, setCheckingResume] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume an in-progress setup if a valid token is already cached (e.g.
  // the customer refreshed the page or came back within the token's
  // ~60-minute window).
  useEffect(() => {
    const existing = getMemoryToken(memoryId, "setup");
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with sessionStorage on mount, no async work needed
      setToken(existing);
    }
    setCheckingResume(false);
  }, [memoryId]);

  const handleVerifyEmail = async () => {
    setError("");
    if (!email.trim()) {
      setError("Enter the email you used for your order.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await setupService.startSetup(memoryId, email.trim());
      setMemoryToken(memoryId, "setup", result.setup_token, result.expires_in_minutes);
      setToken(result.setup_token);
    } catch (err) {
      setError(
        err instanceof ApiClientError && err.status === 403
          ? "That email doesn't match the order for this Memory."
          : err instanceof ApiClientError
          ? err.message
          : "Something went wrong, please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl">
      {checkingResume ? (
        <InfinityLoader label="Opening your setup..." />
      ) : token ? (
        <SetupWizard memoryId={memoryId} token={token} />
      ) : (
        <div className="space-y-5">
          <div>
            <h2 className="font-heading text-ruby text-lg">Verify it&apos;s you</h2>
            <p className="text-xs text-ruby/50 mt-1">
              Enter the email address used on your order. This confirms you&apos;re the
              one setting up this Memory - not just anyone who found the link.
            </p>
          </div>

          <div>
            <label className="block text-xs font-heading text-ruby/70 mb-1">Order email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-ruby/20 bg-white/60 text-ruby text-sm focus:outline-none focus:border-ruby/50"
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            onClick={handleVerifyEmail}
            disabled={isSubmitting}
            className="w-full py-3 rounded-full ruby-gradient text-white font-heading text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
