import React from 'react';
import { ArrowLeft, Send, Crown, Award } from 'lucide-react';

interface Step12WelcomeHostProps {
  onBack: () => void;
  onStartHosting?: () => void;
  onLookAround?: () => void;
  onBuyNow?: () => void;
}

export function Step12WelcomeHost({
  onBack,
  onStartHosting,
  onLookAround,
  onBuyNow,
}: Step12WelcomeHostProps) {
  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
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

        {/* You're signed up status */}
        <div className="flex items-center gap-2 mt-5 sm:mt-7">
          <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            You&apos;re signed up
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-2">
          Welcome, Host
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 leading-relaxed">
          One last step to start sending offers.
        </p>

        {/* Pricing / Plan Card */}
        <div className="mt-5 sm:mt-6 bg-[#F5F1E6]/70 border border-[#EADBCA] rounded-[24px] p-5 sm:p-6 max-w-[580px]">
          {/* Card Top Row: Role + Pro Tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#16120F]">
              <span className="text-amber-500 text-sm">👑</span>
              <span>Host</span>
            </div>
            <span className="text-xs text-[#6E6A63] font-normal">Pro</span>
          </div>

          {/* Price */}
          <div className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] mt-2 mb-3.5 tracking-tight">
            $9.99/Mo
          </div>

          {/* Buy Now Button (Warm Amber Gold) */}
          <button
            type="button"
            onClick={onBuyNow || onStartHosting}
            className="w-full bg-[#FCB943] hover:bg-[#E09C2C] text-[#16120F] font-semibold text-xs sm:text-sm py-3 px-6 rounded-full transition-colors shadow-xs active:scale-[0.99]"
          >
            Buy now
          </button>

          {/* Features List */}
          <div className="space-y-2.5 mt-4 text-xs text-[#524D46]">
            <div className="flex items-center gap-2.5">
              <Send className="w-3.5 h-3.5 text-[#FCB943] shrink-0 rotate-45 stroke-[2.2]" />
              <span>Send offers to verified Guests of Honor</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Crown className="w-3.5 h-3.5 text-[#FCB943] shrink-0 stroke-[2.2]" />
              <span>Gold crown on your profile</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-3.5 h-3.5 text-[#FCB943] shrink-0 stroke-[2.2]" />
              <span>A reliability score that builds trust</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#EAE3D6] my-4" />

          {/* Disclaimer */}
          <p className="text-[11px] text-[#6E6A63] font-normal">
            Cancel any time. Guests of honor never pay.
          </p>
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-6 sm:mt-7 max-w-[580px]">
          <button
            type="button"
            onClick={onStartHosting}
            className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 sm:py-3 px-10 rounded-full shadow-sm transition-all active:scale-[0.99] flex items-center justify-center"
          >
            Start hosting
          </button>

          {/* Not now link */}
          <button
            type="button"
            onClick={onLookAround}
            className="mt-3 text-xs sm:text-sm text-center sm:text-left block transition-colors cursor-pointer"
          >
            <span className="font-semibold text-[#16120F]">Not now,</span>{' '}
            <span className="text-[#6E6A63] hover:text-[#16120F]">just look around</span>
          </button>
        </div>

      </div>
    </div>
  );
}
