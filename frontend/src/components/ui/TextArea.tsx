import React from 'react';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextArea({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  id,
  ...props
}: TextAreaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-serif font-bold text-sm sm:text-base text-[#16120F] mb-2.5"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-[22px] p-4 sm:p-5 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] transition-colors resize-none leading-relaxed ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-sans">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#6E6A63] font-sans">{helperText}</p>
      ) : null}
    </div>
  );
}
