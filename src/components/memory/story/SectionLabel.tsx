interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({
  children,
}: SectionLabelProps) {
  return (
    <div className="py-10 text-center sm:py-8">
      <div className="relative inline-block">
        <div key="icon" className="mb-6 text-2xl text-[#9c4b67]">✦</div>
        <div className="absolute inset-0 rounded-full bg-ruby/5 blur-xl" />

        <p className="text-[12px] uppercase tracking-[0.4em] text-[#8b1235]/45">
          {children}
        </p>

        <div className="absolute -bottom-2 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-ruby/20" />
      </div>
    </div>
  );
}