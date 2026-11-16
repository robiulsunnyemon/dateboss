import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface Step5LifestyleProps {
  onBack: () => void;
  onContinue?: (data: {
    children: 'No' | 'Yes';
    smoke: 'No' | 'Yes' | 'Occasionally';
    drink: 'No' | 'Yes' | 'Occasionally';
  }) => void;
}

export function Step5Lifestyle({ onBack, onContinue }: Step5LifestyleProps) {
  const [children, setChildren] = useState<'No' | 'Yes'>('No');
  const [smoke, setSmoke] = useState<'No' | 'Yes' | 'Occasionally'>('No');
  const [drink, setDrink] = useState<'No' | 'Yes' | 'Occasionally'>('No');

  const handleContinue = () => {
    if (onContinue) {
      onContinue({ children, smoke, drink });
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
          Great!
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6860] text-xs sm:text-sm font-normal mt-2 pb-5 border-b border-[#EAE3D6] leading-relaxed">
          Now we need some details about you
        </p>

        {/* Question Sections */}
        <div className="space-y-6 pt-5">
          {/* Question 1: Do You Have Any Children? */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A1816] mb-3">
              Do You Have Any Children?
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap">
              {(['No', 'Yes'] as const).map((option) => {
                const isSelected = children === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setChildren(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1A1816] text-white shadow-sm'
                        : 'bg-[#FAF7F2] border border-[#E5DECF] text-[#6E6860] hover:border-[#1A1816]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Do You Smoke */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A1816] mb-3">
              Do You Smoke
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap">
              {(['No', 'Yes', 'Occasionally'] as const).map((option) => {
                const isSelected = smoke === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSmoke(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1A1816] text-white shadow-sm'
                        : 'bg-[#FAF7F2] border border-[#E5DECF] text-[#6E6860] hover:border-[#1A1816]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Do You Drink */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A1816] mb-3">
              Do You Drink
            </h2>
            <div className="flex items-center gap-2.5 flex-wrap">
              {(['No', 'Yes', 'Occasionally'] as const).map((option) => {
                const isSelected = drink === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDrink(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1A1816] text-white shadow-sm'
                        : 'bg-[#FAF7F2] border border-[#E5DECF] text-[#6E6860] hover:border-[#1A1816]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions:
            Mobile: Full width Continue button on top, Back text link below.
            Desktop: Back text on left, compact red Continue button on right. */}
        <div className="pt-8 sm:pt-10">
          {/* Desktop Layout: Back + Continue side-by-side */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-[#8E8880] hover:text-[#1A1816] text-sm font-normal px-2 py-2 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#961C23] hover:bg-[#7D141A] text-white font-medium text-xs sm:text-sm py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
          </div>

          {/* Mobile Layout: Full width Continue + Back link */}
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
              onClick={onBack}
              className="text-[#8E8880] hover:text-[#1A1816] text-sm font-normal py-3 text-center transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
