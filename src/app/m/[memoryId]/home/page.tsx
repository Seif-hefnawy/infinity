// src/app/m/[memoryId]/home/page.tsx
//
// The published content is PIN-gated behind a "view" token the backend
// only ever hands to the browser after PinGate's /verify-pin succeeds - a
// Server Component has no access to that token (it lives in
// sessionStorage), so this is a thin shell handing off to a Client
// Component that does the authenticated fetch.
import HomeGate from "./HomeGate";

interface PageProps {
  params: Promise<{ memoryId: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { memoryId } = await params;
  return <HomeGate memoryId={memoryId} />;
}
