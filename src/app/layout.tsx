import type { Metadata } from 'next';
// Self-hosted (bundled at build time via @fontsource) rather than
// next/font/google, which fetches from Google Fonts' CDN at build time -
// that fetch fails in any environment without outbound access to
// fonts.googleapis.com (offline CI, restricted/firewalled build servers,
// etc). Self-hosting removes that dependency entirely while rendering
// pixel-identically - same font files, same font-family names.
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/luxurious-roman/400.css';
import './globals.css';

import ClientFallingRoses from "@/components/shared/ClientFallingRoses";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Infinity - Memories',
  description: 'A special memory is waiting for you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (
    <html
    data-scroll-behavior="smooth"
      lang="ar"
      style={{
        // Inline style guarantees these win over globals.css's :root
        // fallback values regardless of stylesheet load order - matching
        // exactly what next/font/google's .variable className previously
        // guaranteed, just without the network dependency.
        "--font-heading": "'Cormorant Garamond', serif",
        "--font-body": "'Luxurious Roman', serif",
      } as React.CSSProperties} className={cn("font-sans", geist.variable)}
    >
      <body>
      
        
        {/* الورود (هنضبط z-index عشان تظهر فوق الكل) */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <ClientFallingRoses />
        </div>

        {children}
      </body>
    </html>
  );
};
