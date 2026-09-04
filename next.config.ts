import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Uploaded photos live in whatever storage bucket the backend is
    // configured with (AWS S3, Supabase Storage, etc). The exact bucket
    // hostname isn't known at build time, so this is intentionally
    // permissive for any https image host. Once your bucket domain is
    // final, you can lock this down to e.g.
    // { protocol: "https", hostname: "your-bucket.s3.amazonaws.com" }.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
