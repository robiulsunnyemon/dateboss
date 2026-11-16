import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Step7PromptsProps {
  onBack: () => void;
  onSkip?: () => void;
  onContinue?: (data: {
    bio: string;
    idealFirstDate: string;
  }) => void;
}

export function Step7Prompts({ onBack, onSkip, onContinue }: Step7PromptsProps) {
  const [bio, setBio] = useState('');
  const [idealFirstDate, setIdealFirstDate] = useState('');

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        bio: bio.trim(),
        idealFirstDate: idealFirstDate.trim(),
      });
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else if (onContinue) {
      onContinue({ bio: '', idealFirstDate: '' });
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

        {/* Main Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#1A1816] tracking-tight leading-tight mt-6 sm:mt-7">
          Perfect!
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 mb-6 sm:mb-8 leading-relaxed">
          Answer a few more questions to help others understand what you&apos;re looking for.
        </p>

        {/* Form Fields: Two Prompt Textareas */}
        <div className="space-y-6">
          {/* Prompt 1: Introduce Yourself To The Community */}
          <div>
            <label
              htmlFor="bio-input"
              className="block font-serif font-bold text-sm sm:text-base text-[#1A1816] mb-2.5"
            >
              Introduce Yourself To The Community
            </label>
            <textarea
              id="bio-input"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your passions, lifestyle, and what intrigues you. Give your potential matches the perfect way to start a conversation."
              className="w-full bg-[#FAF7F2] border border-[#E5DECF] rounded-[22px] p-4 sm:p-5 text-xs sm:text-sm text-[#1A1816] placeholder:text-[#8E8880] focus:outline-none focus:border-[#961C23] focus:ring-1 focus:ring-[#961C23] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Prompt 2: Envision Your Ideal First Date */}
          <div>
            <label
              htmlFor="date-input"
              className="block font-serif font-bold text-sm sm:text-base text-[#1A1816] mb-2.5"
            >
              Envision Your Ideal First Date
            </label>
            <textarea
              id="date-input"
              rows={3}
              value={idealFirstDate}
              onChange={(e) => setIdealFirstDate(e.target.value)}
              placeholder="Fine dining, curated drinks, or a scenic walk under the city lights? Share what sets the right mood for you."
              className="w-full bg-[#FAF7F2] border border-[#E5DECF] rounded-[22px] p-4 sm:p-5 text-xs sm:text-sm text-[#1A1816] placeholder:text-[#8E8880] focus:outline-none focus:border-[#961C23] focus:ring-1 focus:ring-[#961C23] transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions:
            Mobile: Full width Continue on top, Back | Skip below.
            Desktop: Back | Skip on left, compact red Continue button on right. */}
        <div className="pt-8 sm:pt-10">
          {/* Desktop Layout: Back | Skip + Continue side-by-side */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={onBack}
                className="text-[#8E8880] hover:text-[#1A1816] font-normal transition-colors cursor-pointer"
              >
                Back
              </button>
              <span className="text-[#C8BEAE] font-light">|</span>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[#8E8880] hover:text-[#1A1816] font-normal transition-colors cursor-pointer"
              >
                Skip
              </button>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99] ml-2"
            >
              Continue
            </button>
          </div>

          {/* Mobile Layout: Full width Continue + Back | Skip */}
          <div className="flex flex-col sm:hidden">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
            <div className="flex items-center justify-center gap-3 pt-3.5 text-sm">
              <button
                type="button"
                onClick={onBack}
                className="text-[#8E8880] hover:text-[#1A1816] font-normal transition-colors cursor-pointer"
              >
                Back
              </button>
              <span className="text-[#C8BEAE] font-light">|</span>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[#8E8880] hover:text-[#1A1816] font-normal transition-colors cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
