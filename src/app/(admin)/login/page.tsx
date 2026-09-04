"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { adminService } from "@/services/adminService";
import { ApiClientError } from "@/services/apiClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await adminService.login({ email, password });
      login(session.access_token, email);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-roseIvory relative overflow-hidden">
      <div className="absolute inset-0 romantic-linear opacity-30" />
      <div className="absolute inset-0 glass" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl md:rounded-4xl p-8 md:p-10 shadow-2xl border border-white/30">
          <h1 className="font-heading text-ruby text-2xl md:text-3xl text-center font-bold">
            Dashboard
          </h1>
          <p className="font-body text-ruby/60 text-center mt-2 text-xs md:text-sm">
            Sign in to manage your memories.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-heading text-ruby/70 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-ruby/20 bg-white/60 text-ruby text-sm focus:outline-none focus:border-ruby/50"
              />
            </div>
            <div>
              <label className="block text-xs font-heading text-ruby/70 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-ruby/20 bg-white/60 text-ruby text-sm focus:outline-none focus:border-ruby/50"
              />
            </div>

            {error && <p className="text-error text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full ruby-gradient text-white font-heading text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
