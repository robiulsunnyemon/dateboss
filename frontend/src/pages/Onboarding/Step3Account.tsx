import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

interface Step3AccountProps {
  onBack: () => void;
  onComplete?: (method: 'google' | 'apple' | 'email') => void;
  onSignIn?: () => void;
}

export function Step3Account({
  onBack,
  onComplete,
  onSignIn,
}: Step3AccountProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleSelect = (method: 'google' | 'apple' | 'email') => {
    setSelectedMethod(method);
    if (onComplete) {
      onComplete(method);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#1E1C1A]">
      
      {/* Container: Edge-to-edge on mobile, elegant centered card on desktop matching Figma */}
      <div className="w-full max-w-[760px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
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

          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-5 sm:mt-7">
          <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          <span className="text-xs font-semibold text-[#961C23] tracking-wide">
            Step 3 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A1816] tracking-tight leading-tight mt-2">
          Great!
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 mb-6 sm:mb-8 leading-relaxed">
          Let's get your account ready!
        </p>

        {/* Auth Provider Buttons: Stacked on mobile, 3-column row on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-3.5 my-4">
          
          {/* Button 1: Continue with Google (Rich dark red background matching screenshot) */}
          <button
            type="button"
            onClick={() => handleSelect('google')}
            className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99]"
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
            </span>
            <span className="truncate">Continue with Google</span>
          </button>

          {/* Button 2: Continue with Apple */}
          <button
            type="button"
            onClick={() => handleSelect('apple')}
            className="w-full bg-transparent border border-[#E5DECF] hover:border-[#1A1816] text-[#1E1C1A] font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0 fill-current text-[#1E1C1A]" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.83-11.88-14.24-5.77-8.87-10.25-18.77-13.43-29.72-3.18-10.94-4.77-21.5-4.77-31.68 0-14.88 3.86-26.68 11.58-35.39 7.72-8.71 17.2-13.19 28.44-13.43 4.8.12 10.09 1.34 15.86 3.67 5.77 2.32 9.53 3.53 11.28 3.63 2.12-.22 5.99-1.47 11.61-3.77 5.62-2.3 10.59-3.37 14.92-3.23 8.15.35 15.54 2.87 22.18 7.56 6.64 4.69 11.52 10.88 14.64 18.57-7.84 4.74-11.69 11.39-11.55 19.95.14 8.56 4.34 15.48 12.61 20.76 2.13 1.41 4.41 2.54 6.84 3.38-1.8 5.76-3.87 11.43-6.22 17.02zM119.22 33.15c0-7.37 2.65-14.28 7.96-20.74 5.3-6.46 11.89-10.6 19.75-12.41.22 1.45.33 2.82.33 4.12 0 7.37-2.73 14.39-8.19 21.05-5.46 6.67-12.13 10.74-20.02 12.22-.22-1.33-.33-2.75-.33-4.24z"/>
            </svg>
            <span className="truncate">Continue with Apple</span>
          </button>

          {/* Button 3: Continue with Email */}
          <button
            type="button"
            onClick={() => handleSelect('email')}
            className="w-full bg-transparent border border-[#E5DECF] hover:border-[#1A1816] text-[#1E1C1A] font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <Mail className="w-4 h-4 shrink-0 text-[#1E1C1A]" />
            <span className="truncate">Continue with Email</span>
          </button>

        </div>

        {/* Confirmation banner if clicked */}
        {selectedMethod && (
          <div className="mt-4 p-3 rounded-2xl bg-[#EDE5D6] border border-[#DDD3C2] text-xs text-[#1A1816] animate-in fade-in">
            <span className="font-semibold capitalize">{selectedMethod} authentication</span> selected. Connecting secure credentials...
          </div>
        )}

        {/* Bottom text: Already a member? Sign in */}
        <div className="mt-6 sm:mt-8 pt-2 text-center sm:text-left text-xs text-[#6E6860] leading-relaxed">
          <p>Already a member?</p>
          <p className="mt-0.5">
            <button
              type="button"
              onClick={onSignIn || onBack}
              className="font-bold text-[#961C23] hover:underline"
            >
              Sign in
            </button>{' '}
            to your account and pick up where you left off.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Step3Account;
