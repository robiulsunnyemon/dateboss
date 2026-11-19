import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface Step5LifestyleProps {
  onBack: () => void;
  onContinue?: (data: {
    children: 'No' | 'Yes';
    smoke: 'No' | 'Yes' | 'Occasionally';
    drink: 'No' | 'Yes' | 'Occasionally';
    heightInches: number;
    bodyType: string;
    lookingFor: string[];
  }) => void;
}

const BODY_TYPES = [
  'Slender',
  'Athletic',
  'Average',
  'Curvy',
  'Muscular',
  'Full-figured',
  'A few extra pounds',
];

const LOOKING_FOR_OPTIONS = [
  'Dating',
  'Long-term',
  'Casual',
  'Friendship',
  'Discreet affair',
  'Mentorship',
];

function formatHeight(inches: number): string {
  const feet = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${feet}'${String(rem).padStart(2, '0')}"`;
}

export function Step5Lifestyle({ onBack, onContinue }: Step5LifestyleProps) {
  const [children, setChildren] = useState<'No' | 'Yes'>('No');
  const [smoke, setSmoke] = useState<'No' | 'Yes' | 'Occasionally'>('No');
  const [drink, setDrink] = useState<'No' | 'Yes' | 'Occasionally'>('Occasionally');
  const [heightInches, setHeightInches] = useState<number>(68);
  const [bodyType, setBodyType] = useState<string>('Athletic');
  const [lookingFor, setLookingFor] = useState<string[]>(['Dating', 'Long-term']);

  const toggleLookingFor = (item: string) => {
    setLookingFor((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        children,
        smoke,
        drink,
        heightInches,
        bodyType,
        lookingFor: lookingFor.length > 0 ? lookingFor : ['Dating'],
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
        {/* Top Header */}
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

        {/* Question Sections */}
        <div className="space-y-6 pt-5">
          {/* Question 1: Do You Have Any Children? */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
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

          {/* Question 2: Do You Smoke */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
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

          {/* Question 3: Do You Drink */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
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

          {/* Question 4: Height */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F]">
                Your Height
              </h2>
              <span className="font-serif font-bold text-sm text-[#9F1E19]">
                {formatHeight(heightInches)}
              </span>
            </div>
            <input
              type="range"
              min="58"
              max="80"
              value={heightInches}
              onChange={(e) => setHeightInches(Number(e.target.value))}
              className="w-full accent-[#9F1E19] h-1.5 bg-[#E5DECF] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#6E6A63] mt-1">
              <span>4&apos;10&quot;</span>
              <span>5&apos;08&quot;</span>
              <span>6&apos;08&quot;</span>
            </div>
          </div>

          {/* Question 5: Body Type */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
              Body Type
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {BODY_TYPES.map((option) => {
                const isSelected = bodyType === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBodyType(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
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

          {/* Question 6: What Are You Looking For? */}
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-3">
              What Are You Looking For?
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {LOOKING_FOR_OPTIONS.map((option) => {
                const isSelected = lookingFor.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleLookingFor(option)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
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
        </div>

        {/* Footer Actions */}
        <div className="pt-8 sm:pt-10">
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
