interface PinInputProps {
  pin: string;
  error?: boolean;
}

export default function PinInput({ pin, error }: PinInputProps) {
  const maxLength = 4;

  return (
    <div className="flex gap-4 md:gap-6">
      
      {Array.from({ length: maxLength }).map((_, index) => {
        const isFilled = index < pin.length;
        const isActive = index === pin.length;

        return (
          <div
            key={index}
            className={`
              w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-heading text-ruby transition-all duration-300  ${error ? 'animate-shake border-2 border-error' : ''}${isFilled ? 'glass-strong border border-ruby/30 shadow-glow' : 'glass border border-ruby/20'} ${isActive && !error ? 'border-2 border-ruby/50 shadow-soft' : ''} `}
          >
            {isFilled ? pin[index] : ''}
          </div>
        );
      })}
    </div>
  );
}