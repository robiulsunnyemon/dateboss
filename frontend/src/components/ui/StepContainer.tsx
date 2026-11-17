import React from 'react';
import { BrandHeader } from './BrandHeader';

export interface StepContainerProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  cardClassName?: string;
}

const MAX_WIDTH_MAP = {
  sm: 'max-w-[620px]',
  md: 'max-w-[760px]',
  lg: 'max-w-[840px]',
  xl: 'max-w-[1020px]',
};

export function StepContainer({
  children,
  onBack,
  showBack = true,
  maxWidth = 'md',
  className = '',
  cardClassName = '',
}: StepContainerProps) {
  const maxWidthClass = MAX_WIDTH_MAP[maxWidth];

  return (
    <div
      className={`min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-10 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F] ${className}`}
    >
      <div
        className={`w-full ${maxWidthClass} bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-9 lg:p-11 shadow-none sm:shadow-[0_10px_40px_rgba(22,18,15,0.04)] animate-in fade-in duration-200 ${cardClassName}`}
      >
        {onBack && <BrandHeader onBack={onBack} showBack={showBack} />}
        {children}
      </div>
    </div>
  );
}
