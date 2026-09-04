// src/app/page.tsx
//
// There is no single global Memory anymore - each one lives at
// /m/{memoryId} (shared privately with its recipient), and the only other
// audience for the bare domain is whoever manages the memories. Redirect
// there rather than inventing a new public marketing page.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
