import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

// 12-petals transitioning from Brand Red (#9F1E19) to soft blush
const PETAL_COLORS = [
  '#9F1E19', // 12 o'clock (brand primary)
  '#AB2C27',
  '#B93C37',
  '#C64E49',
  '#D3625E',
  '#DF7975',
  '#EA918E',
  '#F2AAA8',
  '#F8C3C2',
  '#FCDCDC',
  '#FDF0F0',
  '#FFF8F8', // 11 o'clock (lightest)
];

const SIZE_MAP = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  lg: 'w-32 h-32 sm:w-36 sm:h-36',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
  label,
}: LoadingSpinnerProps) {
  const sizeClass = SIZE_MAP[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClass}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-[spin_1.2s_linear_infinite]"
        >
          {PETAL_COLORS.map((color, idx) => {
            const angle = idx * 30;
            return (
              <rect
                key={angle}
                x="46.5"
                y="10"
                width="7"
                height="19"
                rx="3.5"
                fill={color}
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
        </svg>
      </div>

      {label && (
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-5 tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
}
