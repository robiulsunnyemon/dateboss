import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'step' | 'status' | 'primary' | 'pro' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'status',
  className = '',
  icon,
}: BadgeProps) {
  if (variant === 'step') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
        <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
          {children}
        </span>
      </div>
    );
  }

  if (variant === 'primary') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-[#9F1E19] text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-xs ${className}`}
      >
        {icon}
        <span>{children}</span>
      </span>
    );
  }

  if (variant === 'pro') {
    return (
      <span
        className={`inline-flex items-center text-xs text-[#6E6A63] font-normal ${className}`}
      >
        {children}
      </span>
    );
  }

  // Default status badge with subtle red line
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
      <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
        {children}
      </span>
    </div>
  );
}
