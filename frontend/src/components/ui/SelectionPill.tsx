import React from 'react';
import { Check } from 'lucide-react';

export interface SelectionPillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SelectionPill({
  label,
  selected = false,
  onClick,
  icon,
  className = '',
  disabled = false,
}: SelectionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-98 cursor-pointer ${
        selected
          ? 'bg-[#16120F] text-white shadow-sm'
          : 'bg-[#F5F1E6] border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      {!selected && icon}
      <span>{label}</span>
    </button>
  );
}
