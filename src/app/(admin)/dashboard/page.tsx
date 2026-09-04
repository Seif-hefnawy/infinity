"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { adminService } from "@/services/adminService";
import { ApiClientError } from "@/services/apiClient";
import type { Order } from "@/types/order";
import InfinityLoader from "@/components/shared/InfinityLoader";

// How often to re-poll the backend for newly arrived Shopify orders.
// There's no push/websocket channel from the backend, so this is a simple
// poll - the list refreshes on its own without the admin doing anything.
const AUTO_REFRESH_MS = 15_000;

export default function DashboardPage() {
  const router = useRouter();
  const {
    token,
    email,
    isLoading: isAuthLoading,
    isAuthenticated,
    logout,
  } = useAdminAuth();

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [showWebhookInfo, setShowWebhookInfo] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminService.listOrders(token);
      setOrders(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Failed to load orders.",
      );
    }
  }, [token]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the initial async load once auth state is known; loadOrders itself is stable via useCallback
    loadOrders();
  }, [isAuthLoading, isAuthenticated, router, loadOrders]);

  // Auto-refresh: orders arrive on their own the moment Shopify sends the
  // webhook - nothing to click, they just appear here shortly after.
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(loadOrders, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadOrders]);

  const handleCopyLink = async (memoryId: string) => {
    const url = `${window.location.origin}/m/${memoryId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard API unavailable - not critical, the link is shown on screen too
    }
  };
  const handleResetMemory = async (memoryId: string, customerName: string) => {
    if (!token) return;
    if (
      !confirm(
        `Are you sure you want to reset "${customerName}"'s memory? All stories, photos, and setup data will be permanently deleted. This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await adminService.resetMemory(memoryId, token);
      // تحديث اللستة بعد المسح
      await loadOrders();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Failed to reset memory.",
      );
    }
  };

  const handleCopyWebhookUrl = async () => {
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhooks/shopify/orders-create`;
    try {
      await navigator.clipboard.writeText(webhookUrl);
    } catch {
      // not critical, shown on screen too
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-roseIvory">
        <InfinityLoader />
      </div>
    );
  }

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webhooks/shopify/orders-create`;

  return (
    <div className="min-h-screen bg-roseIvory relative overflow-hidden px-4 py-10 md:py-16">
      <div className="absolute inset-0 bg-linear-to-br from-roseIvory via-ruby/5 to-roseIvory" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-ruby text-3xl md:text-4xl font-bold">
              Orders
            </h1>
            <p className="font-body text-ruby/40 text-xs mt-1">
              Synced automatically from Shopify - no action needed here.
            </p>
            {email && (
              <p className="font-body text-ruby/50 text-xs mt-1">{email}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="text-ruby/60 hover:text-ruby text-sm font-heading underline underline-offset-2"
          >
            Sign out
          </button>
        </div>

        {/* One-time Shopify webhook setup - not per-order, just done once in Shopify's own settings */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/30 mb-8 overflow-hidden">
          <button
            onClick={() => setShowWebhookInfo((v) => !v)}
            className="w-full px-5 py-3 flex items-center justify-between text-left"
          >
            <span className="font-heading text-ruby/70 text-sm">
              Not seeing new orders? Check your Shopify webhook setup
            </span>
            <span className="text-ruby/40 text-xs">
              {showWebhookInfo ? "Hide" : "Show"}
            </span>
          </button>
          {showWebhookInfo && (
            <div className="px-5 pb-5 space-y-2">
              <p className="text-ruby/50 text-xs">
                In Shopify Admin: Settings → Notifications → Webhooks → Create
                webhook, event{" "}
                <code className="text-ruby">orders/creation</code>, format JSON,
                URL:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-ruby/5 text-ruby text-xs break-all">
                  {webhookUrl}
                </code>
                <button
                  onClick={handleCopyWebhookUrl}
                  className="shrink-0 px-3 py-2 rounded-full border border-ruby/20 text-ruby/70 text-xs font-heading hover:bg-ruby/5 transition-all"
                >
                  Copy
                </button>
              </div>
              <p className="text-ruby/40 text-[11px]">
                Once configured, every new Shopify order shows up in the list
                below within a few seconds - automatically, with no manual
                entry.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-error text-sm font-body mb-4">{error}</p>}

        {!orders ? (
          <div className="flex justify-center py-12">
            <InfinityLoader />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center font-body text-ruby/50 text-sm py-12">
            No orders yet - they&apos;ll appear here automatically as soon as
            Shopify sends one.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-ruby text-lg truncate">
                      {order.customer_name}
                    </h2>
                    <span
                      className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-heading ${
                        order.status === "PUBLISHED"
                          ? "bg-ruby/10 text-ruby"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status === "PUBLISHED"
                        ? "Set Up"
                        : "Awaiting Customer"}
                    </span>
                  </div>
                  <p className="font-body text-ruby/40 text-xs mt-1 truncate">
                    {order.customer_email}
                  </p>
                  <p className="font-body text-ruby/30 text-[11px] mt-0.5 truncate">
                    Shopify order #{order.shopify_order_id}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      handleResetMemory(order.memory_id, order.customer_name)
                    }
                    className="px-3 py-2 rounded-full border border-error/30 text-error/70 text-xs font-heading hover:bg-error/5 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleCopyLink(order.memory_id)}
                    className="px-3 py-2 rounded-full border border-ruby/20 text-ruby/70 text-xs font-heading hover:bg-ruby/5 transition-all"
                  >
                    Copy Link
                  </button>
                  {order.status === "PUBLISHED" && (
                    <a
                      href={`/m/${order.memory_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-full ruby-gradient text-white text-xs font-heading shadow-md hover:shadow-lg transition-all"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
