import React from 'react';

interface WaxSealLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const WaxSealLogo: React.FC<WaxSealLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Wax Seal SVG */}
      <div className={`relative ${sizeMap[size]} shrink-0 transition-transform hover:scale-105 duration-200`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(138,27,34,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer irregular scalloped wax body */}
          <path
            d="M50 4 
               C57 5 62 10 68 8 
               C75 7 80 13 85 18 
               C90 23 94 28 95 35 
               C96 42 93 47 96 54 
               C98 61 95 67 92 73 
               C89 79 83 83 78 87 
               C72 91 66 92 60 95 
               C53 97 47 95 41 96 
               C34 97 28 93 23 89 
               C17 85 13 80 9 74 
               C5 68 6 62 4 55 
               C3 48 6 42 6 36 
               C7 29 11 24 16 19 
               C21 14 27 10 33 8 
               C40 6 44 4 50 4 Z"
            fill="url(#waxGradient)"
            stroke="#630E14"
            strokeWidth="2"
          />

          {/* Inner embossed rim */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#5A0D12"
            strokeWidth="2.5"
            strokeDasharray="2 2"
            fill="url(#innerWaxGradient)"
            opacity="0.9"
          />

          {/* Inner solid stamp plate */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="#7C141B"
            stroke="#9A222B"
            strokeWidth="1.5"
          />

          {/* Embossed Letter 'd' in elegant serif */}
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="#F6E7D0"
            fontFamily="'Playfair Display', Georgia, serif"
            fontWeight="bold"
            fontSize="32"
            fontStyle="italic"
            style={{
              textShadow: '0 2px 3px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.4))'
            }}
          >
            d
          </text>

          {/* Highlights & Gradients */}
          <defs>
            <linearGradient id="waxGradient" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A8232B" />
              <stop offset="45%" stopColor="#8A1B22" />
              <stop offset="85%" stopColor="#691218" />
              <stop offset="100%" stopColor="#4E0C11" />
            </linearGradient>
            <linearGradient id="innerWaxGradient" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9C2028" />
              <stop offset="100%" stopColor="#6E1117" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className="font-serif-heading font-bold text-xl md:text-2xl tracking-tight text-[#1D1B18]">
          thedate<span className="text-[#8A1B22]">inc</span>
        </span>
      )}
    </div>
  );
};
