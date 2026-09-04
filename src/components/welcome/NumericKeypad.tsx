'use client';

import { BackspaceIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NumericKeypadProps {
  onPress: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClear: () => void;
}

export default function NumericKeypad({
  onPress,
  onDelete,
  onSubmit,
  onClear,
}: NumericKeypadProps) {
  const numbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '', '0', '',
  ];

  return (
     
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xs mx-auto justify-items-center">
      {numbers.map((num, index) => {
        if (num === '') {
          if (index === 9) {
            return (
              <button
                key={index}
                onClick={onClear}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 text-ruby/50 hover:text-ruby transition-all duration-300 flex items-center justify-center text-sm border border-white/20 hover:border-ruby/30"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            );
          }
          if (index === 11) {
            return (
              <button
                key={index}
                onClick={onSubmit}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-r from-ruby to-ruby text-white  transition-all duration-300 flex items-center justify-center text-sm hover:scale-105 active:scale-95"
              >
                OK
              </button>
            );
          }
          return <div key={index} className="w-14 h-14 md:w-16 md:h-16" />;
        }

        return (
          <button
            key={index}
            onClick={() => onPress(num)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 text-ruby hover:text-ruby hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md text-2xl md:text-3xl border border-white/30 hover:border-ruby flex items-center justify-center"
          >
            {num}
          </button>
        );
      })}

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="col-span-3 w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-ruby/60 hover:text-ruby transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-white/20 hover:border-ruby/30"
      >
        <BackspaceIcon className="w-5 h-5" />
        Delete
      </button>
    </div>
  );
}