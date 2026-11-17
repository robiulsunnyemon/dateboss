import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface Step6CareerProps {
  onBack: () => void;
  onContinue?: (data: {
    education: string;
    occupation: string;
    annualIncome: string;
    netWorth: string;
  }) => void;
}

const EDUCATION_OPTIONS = [
  'High school',
  'Some college',
  'Associate deg',
  'Bachelors Deg',
  'Graduate Deg',
  'Post-Doctoral',
];

const FINANCIAL_BRACKETS = [
  '< US $50,000',
  'US $50,000',
  'US $100,000',
  'US $125,000',
  'US $150,000',
  'US $175,000',
  'US $200,000',
  'US $250,000',
  'US $300,000',
  'US $400,000',
  'US $500,000',
  'US $1,000,000',
  'US $1,000,000+',
];

export function Step6Career({ onBack, onContinue }: Step6CareerProps) {
  const [education, setEducation] = useState<string>('High school');
  const [occupation, setOccupation] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState<string>('< US $50,000');
  const [netWorth, setNetWorth] = useState<string>('< US $50,000');

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        education,
        occupation: occupation.trim() || 'Professional',
        annualIncome,
        netWorth,
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      {/* Container: Edge-to-edge on mobile, centered card on desktop matching Figma */}
      <div className="w-full max-w-[820px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        
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

        {/* Main Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#16120F] tracking-tight leading-tight mt-6 sm:mt-7">
          Great!
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-2 pb-5 border-b border-[#EAE3D6] leading-relaxed">
          Now we need some details about you
        </p>

        {/* Form Sections */}
        <div className="space-y-6 pt-5">
          {/* Section 1: Education */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
              Education
            </h2>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {EDUCATION_OPTIONS.map((option) => {
                const isSelected = education === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setEducation(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-sm'
                        : 'bg-[#F5F1E6] border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Occupation */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-2.5">
              Occupation
            </h2>
            <div className="w-full max-w-[480px]">
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Type your occupation here..."
                className="w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#9F1E19] focus:ring-1 focus:ring-[#9F1E19] transition-colors"
              />
            </div>
          </div>

          {/* Section 3: Annual Income */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
              Annual Income
            </h2>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {FINANCIAL_BRACKETS.map((bracket) => {
                const isSelected = annualIncome === bracket;
                return (
                  <button
                    key={bracket}
                    type="button"
                    onClick={() => setAnnualIncome(bracket)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-sm'
                        : 'bg-[#F5F1E6] border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{bracket}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Net Worth */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
              Net Worth
            </h2>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {FINANCIAL_BRACKETS.map((bracket) => {
                const isSelected = netWorth === bracket;
                return (
                  <button
                    key={bracket}
                    type="button"
                    onClick={() => setNetWorth(bracket)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#16120F] text-white shadow-sm'
                        : 'bg-[#F5F1E6] border border-[#E5DECF] text-[#6E6A63] hover:border-[#16120F]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{bracket}</span>
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
              className="text-[#6E6A63] hover:text-[#16120F] text-sm font-normal px-2 py-2 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
          </div>

          {/* Mobile Layout: Full width Continue + Back link */}
          <div className="flex flex-col sm:hidden">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 rounded-full shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
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
