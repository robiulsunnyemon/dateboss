import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidthMobile?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidthMobile = true,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Variant styles adhering strictly to Brand Guide
  const variantStyles = {
    primary:
      'bg-[#9F1E19] hover:bg-[#851713] text-white shadow-sm disabled:bg-[#9F1E19]/60',
    secondary:
      'bg-[#FCB943] hover:bg-[#E09C2C] text-[#16120F] font-semibold shadow-xs disabled:bg-[#FCB943]/60',
    outline:
      'border border-[#9F1E19] text-[#9F1E19] hover:bg-[#9F1E19]/5 disabled:border-[#9F1E19]/40 disabled:text-[#9F1E19]/40',
    ghost:
      'text-[#6E6A63] hover:text-[#16120F] bg-transparent disabled:text-[#6E6A63]/40',
  };

  const sizeStyles = {
    sm: 'py-2 px-5 text-xs',
    md: 'py-2.5 sm:py-3 px-7 text-xs sm:text-sm',
    lg: 'py-3.5 sm:py-4 px-9 text-sm sm:text-base',
  };

  const widthStyle = fullWidthMobile ? 'w-full sm:w-auto' : 'w-auto';

  return (
    <button
      className={`rounded-full font-medium transition-all active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2 ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
