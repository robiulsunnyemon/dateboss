import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Step10FaceCenterStageProps {
  onBack: () => void;
  onStartVideoCheck?: () => void;
}

export function Step10FaceCenterStage({
  onBack,
  onStartVideoCheck,
}: Step10FaceCenterStageProps) {
  const handleStart = () => {
    if (onStartVideoCheck) {
      onStartVideoCheck();
    }
  };

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

        {/* Top Description Note */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-5 sm:mt-6 leading-relaxed max-w-[580px]">
          Build a safer community by verifying that your profile photos genuinely represent you. Help others feel confident connecting and meeting in person.
        </p>

        {/* Center Stage Avatar & Headline */}
        <div className="flex flex-col items-center justify-center my-8 sm:my-10">
          <div className="relative">
            <img
              src="/assets/face-center-stage.png"
              alt="Put Your Face Center Stage"
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-full shadow-xs"
            />
          </div>

          <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#16120F] tracking-tight text-center mt-5 sm:mt-6">
            Put Your Face Center Stage
          </h1>
        </div>

        {/* Footer Actions:
            Mobile: Full width Start Video Check on top, Back below.
            Desktop: Back on left, compact red Start Video Check on right. */}
        <div className="pt-6 sm:pt-8">
          {/* Desktop Layout: Back + Start Video Check side-by-side */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-[#6E6A63] hover:text-[#16120F] text-sm font-normal px-2 py-2 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Start Video Check
            </button>
          </div>

          {/* Mobile Layout: Full width Start Video Check + Back */}
          <div className="flex flex-col sm:hidden">
            <button
              type="button"
              onClick={handleStart}
              className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Start Video Check
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-[#6E6A63] hover:text-[#16120F] text-sm font-normal py-3 text-center transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
