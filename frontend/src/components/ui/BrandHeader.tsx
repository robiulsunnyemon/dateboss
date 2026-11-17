import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface BrandHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
  rightSlot?: React.ReactNode;
}

export function BrandHeader({
  onBack,
  showBack = true,
  className = '',
  rightSlot,
}: BrandHeaderProps) {
  return (
    <div className={`flex items-center justify-between pt-1 sm:pt-0 ${className}`}>
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <a
          href="#"
          onClick={(e) => {
            if (onBack) {
              e.preventDefault();
              onBack();
            }
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

      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
}
