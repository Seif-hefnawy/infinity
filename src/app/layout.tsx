
import type { Metadata } from 'next';
import { Cormorant_Garamond, Luxurious_Roman } from 'next/font/google';
import './globals.css';

const CormorantGaramond = Cormorant_Garamond({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

const luxuriousRoman = Luxurious_Roman({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
});

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
      lang="ar"
      className={`${CormorantGaramond.variable} ${luxuriousRoman.variable}`}
    >
      <body>{children}</body>
    </html>
  );
};
