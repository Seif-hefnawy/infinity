export interface AdminLoginPayload {
  email: string;
  password: string;
}

// POST /api/admin/auth/login response - no user profile is returned, only a token.
export interface AdminSession {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

// GET /api/admin/memories/{memoryId} - admin-safe summary (counts, not full content)
export interface AdminMemoryDetail {
  memory_id: string;
  nfc_url: string;
  status: string;
  title: string | null;
  image_count: number;
  story_count: number;
  has_special_message: boolean;
  has_music: boolean;
  customer_name: string;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
}
