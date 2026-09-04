import type { MemoryStatus } from "./memory";

// GET /api/admin/orders - list item shape. Also what POST /api/admin/orders returns.
export interface Order {
  order_id: string;
  shopify_order_id: string;
  customer_name: string;
  customer_email: string;
  memory_id: string;
  nfc_url: string;
  status: MemoryStatus;
  created_at: string;
}

// GET /api/admin/orders/{orderId} - a DIFFERENT, richer shape (order_status
// vs memory_status are two separate concepts). Do NOT alias this to Order.
export interface OrderDetails {
  order_id: string;
  shopify_order_id: string;
  order_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  memory_id: string;
  nfc_url: string;
  memory_status: MemoryStatus;
  created_at: string;
  updated_at: string;
}

// Body for POST /api/admin/orders - registering a customer's order by hand.
export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
}
