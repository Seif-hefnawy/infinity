// src/components/shared/FallingRoses.tsx
'use client';

import { useEffect, useState } from 'react';

export default function FallingRoses() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rose 1 */}
      <div className="absolute -top-20 left-[10%] animate-fall-1">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/20"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Rose 2 */}
      <div className="absolute -top-20 left-[45%] animate-fall-2">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/15"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Rose 3 */}
      <div className="absolute -top-20 right-[10%] animate-fall-3">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/10"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Rose 4 */}
      <div className="absolute -top-20 left-[25%] animate-fall-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/12"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Rose 5 */}
      <div className="absolute -top-20 right-[30%] animate-fall-5">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/10"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Rose 6 */}
      <div className="absolute -top-20 left-[5%] animate-fall-6">
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/8"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Rose 7 */}
      <div className="absolute -top-20 right-[5%] animate-fall-7">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-ruby/15"
        >
          <path
            d="M12 22C12 22 4 16 4 10C4 6 7 4 9 4C11 4 12 5.5 12 5.5C12 5.5 13 4 15 4C17 4 20 6 20 10C20 16 12 22 12 22Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}