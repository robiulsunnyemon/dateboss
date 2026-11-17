import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Step11VideoCheckingProps {
  onBack: () => void;
  onComplete?: () => void;
}

// 12 petals with shades transitioning from deep brand red to soft blush
const PETAL_COLORS = [
  '#8B171E', // 12 o'clock (darkest)
  '#9C1C24',
  '#AE252D',
  '#BE343B',
  '#CC484F',
  '#D96167',
  '#E47D82',
  '#ED9B9F',
  '#F3B6B9',
  '#F8CDCF',
  '#FCE1E3',
  '#FDF1F2', // 11 o'clock (lightest)
];

export function Step11VideoChecking({
  onBack,
  onComplete,
}: Step11VideoCheckingProps) {
  // Automatically advance to Step 12 when loading completes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#1E1C1A]">
      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
      <div className="w-full max-w-[760px] min-h-[440px] sm:min-h-[380px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200 flex flex-col justify-between">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#961C23] hover:bg-[#7D141A] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Center Loading Spinner & Checking Status */}
        <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16">
          {/* Animated 12-petal Radial Spinner matching Figma design */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
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

          {/* Checking Label */}
          <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-5 tracking-wide">
            Checking...
          </p>
        </div>

        {/* Bottom Spacer for balanced card centering */}
        <div className="h-6 sm:h-8" />

      </div>
    </div>
  );
}
