'use client';

import dynamic from 'next/dynamic';

const FallingRoses = dynamic(
  () => import('@/components/shared/FallingRoses'), // ← صححنا المسار (شلنا الـ / الزايدة)
  { ssr: false }
);

export default function ClientFallingRoses() {
  return <FallingRoses />;
}