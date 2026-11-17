import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface Step9SelfieVerificationProps {
  onBack: () => void;
  onSkip?: () => void;
  onContinue?: () => void;
}

export function Step9SelfieVerification({
  onBack,
  onSkip,
  onContinue,
}: Step9SelfieVerificationProps) {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#1E1C1A]">
      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
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

        {/* Centered Hand + Smartphone Selfie Verification Illustration */}
        <div className="flex justify-center my-4 sm:my-5">
          <img
            src="/assets/selfie-illustration.png"
            alt="Verify identity with selfie"
            className="h-28 sm:h-36 w-auto object-contain"
          />
        </div>

        {/* Title & Instructions */}
        <div className="text-left">
          <h1 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-[#1A1816] tracking-tight leading-tight">
            Verify Your Identity With A Selfie
          </h1>

          <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 leading-relaxed">
            Take a quick selfie to confirm you&apos;re real. Your selfie stays private and will never appear on your profile.
          </p>

          <p className="text-[#961C23] text-[11px] sm:text-xs font-normal mt-3 leading-relaxed">
            To complete verification, make sure your photo gallery includes at least one clear picture of your face. You can keep this photo private.
          </p>
        </div>

        {/* Safety Info Card */}
        <div className="mt-5 sm:mt-6 bg-[#FAF4EB] border border-[#EADFCF] rounded-[20px] p-4 sm:p-5 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1816] shrink-0" />
            <h2 className="font-semibold text-xs sm:text-sm text-[#1A1816]">
              Help Keep Thedateboos Safe
            </h2>
          </div>
          <p className="text-[#7A7369] text-[11px] sm:text-xs font-normal mt-1.5 leading-relaxed">
            Build a safer community by verifying that your profile photos genuinely represent you. Help others feel confident connecting and meeting in person.
          </p>
        </div>

        {/* Footer Actions:
            Mobile: Full width Continue on top, Skip for now below.
            Desktop: Skip for now on left, compact red Continue button on right. */}
        <div className="pt-8 sm:pt-10">
          {/* Desktop Layout: Skip for now + Continue side-by-side */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[#8E8880] hover:text-[#1A1816] text-sm font-normal px-2 py-2 transition-colors cursor-pointer"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
          </div>

          {/* Mobile Layout: Full width Continue + Skip for now */}
          <div className="flex flex-col sm:hidden">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="text-[#8E8880] hover:text-[#1A1816] text-sm font-normal py-3 text-center transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
