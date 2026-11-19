import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { InterestCategory } from '../../types/onboarding';

interface Step2InterestsProps {
  onBack: () => void;
  onContinue?: (selected: string[]) => void;
}

export function Step2Interests({ onBack, onContinue }: Step2InterestsProps) {
  // Pre-select the exact 6 items from the Figma screenshot
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Wine bars',
    'Brunch',
    'Live music',
    'Galleries',
    'Travel',
    'Dogs',
  ]);

  const [submitted, setSubmitted] = useState(false);

  const categories: InterestCategory[] = [
    {
      title: 'Food & Drink',
      items: ['Wine bars', 'Sushi', 'Brunch', 'Coffee', 'Cooking'],
    },
    {
      title: 'Out & About',
      items: ['Live music', 'Galleries', 'Hiking', 'Travel', 'Theatre'],
    },
    {
      title: 'Chill & Create',
      items: ['Movies', 'Books', 'Dancing', 'Dogs', 'Fitness'],
    },
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedInterests);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      
      {/* Container: Edge-to-edge on mobile, elegant centered card on desktop */}
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
          <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Step 2 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#16120F] tracking-tight leading-tight mt-2">
          What Are You Into?
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-2 leading-relaxed">
          Pick at least 5. They show on your profile and help plan offers you'll love.
        </p>

        {/* Dynamic Chosen Counter */}
        <div className="text-[#9F1E19] text-xs font-semibold mt-4 mb-1">
          {selectedInterests.length} chosen
        </div>

        {/* Interest Categories List */}
        <div className="space-y-5 sm:space-y-6 mt-3">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mb-2.5">
                {category.title}
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {category.items.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`text-xs sm:text-sm font-medium py-2.5 px-4 sm:px-5 rounded-full inline-flex items-center gap-1.5 transition-all select-none ${
                        isSelected
                          ? 'bg-[#16120F] text-white shadow-xs'
                          : 'bg-transparent border border-[#E5DECF] text-[#5F5B54] hover:border-[#16120F]'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button & Note */}
        <div className="mt-8 pt-2">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-[#EDE5D6] border border-[#DDD3C2] text-xs text-[#16120F] space-y-1 animate-in fade-in">
              <p className="font-bold">Step 2 complete! ({selectedInterests.length} interests saved)</p>
              <p className="text-[#6E6A63]">
                Proceeding to Step 3: Profile verification & final setup.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs py-4 sm:py-3.5 px-10 rounded-full transition-colors shadow-sm text-center"
            >
              Continue
            </button>
          )}

          <p className="text-xs text-[#6E6A63] mt-3 font-normal text-center sm:text-left">
            You can add more later in your profile
          </p>
        </div>

      </div>

    </div>
  );
}

export default Step2Interests;
