// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-roseIvory flex items-center justify-center px-4 relative overflow-hidden">
      {/* خلفية متحركة (نفس خلفية الهوم) */}
      <div className="absolute inset-0 bg-linear-to-br from-roseIvory via-ruby/5 to-roseIvory animate-gradient" />

      {/* Glow Orbs خفيفة */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-ruby/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-ruby/5 rounded-full blur-3xl" />

      {/* Card زجاجي في النص */}
      <div className="relative z-10 max-w-md w-full text-center error-glass rounded-3xl p-10 md:p-12 shadow-2xl">
        {/* أيقونة أو زخرفة */}
        <div className="text-6xl mb-4 text-ruby/40">✦</div>

        {/* الرقم */}
        <h1 className="font-heading text-ruby text-7xl md:text-8xl font-bold drop-shadow-lg">
          404
        </h1>

        {/* النص الرئيسي */}
        <p className="font-body text-ruby/80 text-lg md:text-xl mt-3">
          Oops! This page doesn&apos;t exist.
        </p>

        {/* النص الفرعي */}
        <p className="font-body text-ruby/50 text-sm mt-2">
          The memory you&apos;re looking for might have been moved or never existed.
        </p>

        {/* فاصل زخرفي */}
        <div className="w-16 h-px bg-ruby/15 mx-auto my-6" />

        {/* زر العودة للصفحة الرئيسية */}
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full ruby-gradient text-white font-heading text-sm tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
        >
          Go Home ✦
        </Link>

        {/* لمسة صغيرة تحت الزر */}
        <p className="font-body text-ruby/30 text-xs mt-4">
          Every story has a beginning.
        </p>
      </div>
    </div>
  );
}