import { apiClient } from "./apiClient";
import { AdminLoginPayload, AdminMemoryDetail, AdminSession } from "@/types/admin";
import { CreateOrderPayload, Order, OrderDetails } from "@/types/order";

export const adminService = {
  login: (payload: AdminLoginPayload) =>
    apiClient.post<AdminSession>("/api/admin/auth/login", payload),

  // The Dashboard's main data source: every order that arrived
  // automatically via the Shopify webhook (see the backend's
  // /api/webhooks/shopify/orders-create) - the Dashboard just displays
  // these, it never creates them.
  listOrders: (adminToken: string) =>
    apiClient.get<Order[]>("/api/admin/orders", { token: adminToken }),

  getOrderDetail: (orderId: string, adminToken: string) =>
    apiClient.get<OrderDetails>(`/api/admin/orders/${orderId}`, { token: adminToken }),

  // NOT used by the Dashboard UI - that always relies on the automatic
  // Shopify sync above. Kept available as a documented fallback for
  // registering an order by hand (e.g. Shopify is temporarily
  // unreachable, or a one-off order placed outside Shopify) - if you wire
  // this up to a UI, make clear it's the exception, not the normal path.
  createOrder: (adminToken: string, payload: CreateOrderPayload) =>
    apiClient.post<Order>("/api/admin/orders", payload, { token: adminToken }),

  getMemoryDetail: (memoryId: string, adminToken: string) =>
    apiClient.get<AdminMemoryDetail>(`/api/admin/memories/${memoryId}`, { token: adminToken }),

 resetMemory: (memoryId: string, token: string) =>
    apiClient.delete(`/api/admin/memories/${memoryId}/reset`, { token }),
};
