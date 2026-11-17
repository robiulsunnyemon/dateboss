import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  rightElement,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-serif font-bold text-sm text-[#16120F] mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={inputId}
          className={`w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full px-5 py-3.5 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] transition-colors ${
            rightElement ? 'pr-12' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-sans">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#6E6A63] font-sans">{helperText}</p>
      ) : null}
    </div>
  );
}
