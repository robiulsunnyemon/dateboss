import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crosshair, Check, ShieldCheck, Camera } from 'lucide-react';

export interface SearchPreferenceFilters {
  location: string;
  isIdVerified: boolean;
  isSelfieVerified: boolean;
  lookingFor: string[];
  minAge: number;
  maxAge: number;
  heightMin: string;
  heightMax: string;
  heightMinInches?: number;
  heightMaxInches?: number;
  smoking: 'No' | 'Yes' | 'Occasionally' | null;
  drinking: 'No' | 'Yes' | 'Occasionally' | null;
  children: 'No' | 'Yes' | null;
  bodyTypes: string[];
  education: string[];
  keywords: string;
}

interface SearchPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SearchPreferenceFilters) => void;
  onReset: () => void;
  initialFilters?: Partial<SearchPreferenceFilters>;
}

function formatInches(inches: number): string {
  const feet = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${feet}'${String(rem).padStart(2, '0')}"`;
}

export function SearchPreferenceModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
}: SearchPreferenceModalProps) {
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [isIdVerified, setIsIdVerified] = useState(initialFilters?.isIdVerified || false);
  const [isSelfieVerified, setIsSelfieVerified] = useState(initialFilters?.isSelfieVerified || false);

  const [lookingFor, setLookingFor] = useState<string[]>(initialFilters?.lookingFor || []);

  const [minAge, setMinAge] = useState(initialFilters?.minAge ?? 18);
  const [maxAge, setMaxAge] = useState(initialFilters?.maxAge ?? 50);

  const [heightMinInches, setHeightMinInches] = useState(initialFilters?.heightMinInches ?? 58);
  const [heightMaxInches, setHeightMaxInches] = useState(initialFilters?.heightMaxInches ?? 80);

  const [smoking, setSmoking] = useState<'No' | 'Yes' | 'Occasionally' | null>(
    initialFilters?.smoking || null
  );
  const [drinking, setDrinking] = useState<'No' | 'Yes' | 'Occasionally' | null>(
    initialFilters?.drinking || null
  );
  const [children, setChildren] = useState<'No' | 'Yes' | null>(
    initialFilters?.children || null
  );

  const [bodyTypes, setBodyTypes] = useState<string[]>(initialFilters?.bodyTypes || []);
  const [education, setEducation] = useState<string[]>(initialFilters?.education || []);
  const [keywords, setKeywords] = useState(initialFilters?.keywords || '');

  useEffect(() => {
    if (!isOpen) return;
    setLocation(initialFilters?.location || '');
    setIsIdVerified(Boolean(initialFilters?.isIdVerified));
    setIsSelfieVerified(Boolean(initialFilters?.isSelfieVerified));
    setLookingFor(initialFilters?.lookingFor || []);
    setMinAge(initialFilters?.minAge ?? 18);
    setMaxAge(initialFilters?.maxAge ?? 50);
    setHeightMinInches(initialFilters?.heightMinInches ?? 58);
    setHeightMaxInches(initialFilters?.heightMaxInches ?? 80);
    setSmoking(initialFilters?.smoking || null);
    setDrinking(initialFilters?.drinking || null);
    setChildren(initialFilters?.children || null);
    setBodyTypes(initialFilters?.bodyTypes || []);
    setEducation(initialFilters?.education || []);
    setKeywords(initialFilters?.keywords || '');
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const heightMin = formatInches(heightMinInches);
  const heightMax = formatInches(heightMaxInches);

  const toggleLookingFor = (item: string) => {
    setLookingFor((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleBodyType = (item: string) => {
    setBodyTypes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleEducation = (item: string) => {
    setEducation((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleApply = () => {
    onApply({
      location,
      isIdVerified,
      isSelfieVerified,
      lookingFor,
      minAge: Math.min(minAge, maxAge),
      maxAge: Math.max(minAge, maxAge),
      heightMin,
      heightMax,
      heightMinInches: Math.min(heightMinInches, heightMaxInches),
      heightMaxInches: Math.max(heightMinInches, heightMaxInches),
      smoking,
      drinking,
      children,
      bodyTypes,
      education,
      keywords,
    });
    onClose();
  };

  const handleReset = () => {
    setLocation('');
    setIsIdVerified(false);
    setIsSelfieVerified(false);
    setLookingFor([]);
    setMinAge(18);
    setMaxAge(50);
    setHeightMinInches(58);
    setHeightMaxInches(80);
    setSmoking(null);
    setDrinking(null);
    setChildren(null);
    setBodyTypes([]);
    setEducation([]);
    setKeywords('');
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16120F]/95 backdrop-blur-md text-[#FAF7F2] font-sans antialiased animate-in fade-in duration-200">
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Top Header */}
        <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Back to discover"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#FAF7F2] tracking-tight">
            Search Preference
          </h1>
        </div>

        {/* DESKTOP & MOBILE RESPONSIVE GRID */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-7">
          {/* COLUMN 1: LOCATION, VERIFICATION SWITCHES, SMOKING/DRINKING/CHILDREN */}
          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Type your location here..."
                  className="w-full bg-[#FAF7F2] text-[#16120F] placeholder-[#6E6A63] rounded-full px-5 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9F1E19]"
                />
                <button
                  type="button"
                  onClick={() => setLocation('New York')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6A63] hover:text-[#16120F] transition-colors p-1"
                  title="Detect location"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ID verified switch */}
            <div className="bg-[#FAF7F2] rounded-full px-5 py-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#16120F]">
                <ShieldCheck className="w-4 h-4 text-[#9F1E19]" />
                <span>ID verified</span>
              </div>
              <button
                type="button"
                onClick={() => setIsIdVerified(!isIdVerified)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isIdVerified ? 'bg-[#9F1E19]' : 'bg-[#DCD5C8]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isIdVerified ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Selfie verified switch */}
            <div className="bg-[#FAF7F2] rounded-full px-5 py-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#16120F]">
                <Camera className="w-4 h-4 text-[#9F1E19]" />
                <span>Selfie verified</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSelfieVerified(!isSelfieVerified)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  isSelfieVerified ? 'bg-[#9F1E19]' : 'bg-[#DCD5C8]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isSelfieVerified ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Smoking Radio Group (click active option again to clear) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Smoking
              </label>
              <div className="bg-[#FAF7F2] rounded-full p-1 flex items-center justify-between text-xs font-medium text-[#16120F]">
                {(['No', 'Yes', 'Occasionally'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSmoking(smoking === opt ? null : opt)}
                    className={`flex-1 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      smoking === opt
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'text-[#6E6A63] hover:text-[#16120F]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        smoking === opt ? 'border-white' : 'border-[#A39D93]'
                      }`}
                    >
                      {smoking === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drinking Radio Group */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Drinking
              </label>
              <div className="bg-[#FAF7F2] rounded-full p-1 flex items-center justify-between text-xs font-medium text-[#16120F]">
                {(['No', 'Yes', 'Occasionally'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDrinking(drinking === opt ? null : opt)}
                    className={`flex-1 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      drinking === opt
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'text-[#6E6A63] hover:text-[#16120F]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        drinking === opt ? 'border-white' : 'border-[#A39D93]'
                      }`}
                    >
                      {drinking === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Children Radio Group */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Children
              </label>
              <div className="bg-[#FAF7F2] rounded-full p-1 flex items-center justify-between text-xs font-medium text-[#16120F]">
                {(['No', 'Yes'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setChildren(children === opt ? null : opt)}
                    className={`flex-1 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      children === opt
                        ? 'bg-[#16120F] text-white shadow-xs'
                        : 'text-[#6E6A63] hover:text-[#16120F]'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        children === opt ? 'border-white' : 'border-[#A39D93]'
                      }`}
                    >
                      {children === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: LOOKING FOR, BODY TYPES, EDUCATION */}
          <div className="space-y-5 sm:space-y-6">
            {/* Looking For Checkbox Card */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Looking For
              </label>
              <div className="bg-[#FAF7F2] rounded-[22px] p-4 text-[#16120F] shadow-xs">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    'Dating',
                    'Discreet affair',
                    'Friendship',
                    'Casual',
                    'Long-term',
                    'Mentorship',
                  ].map((item) => {
                    const isChecked = lookingFor.includes(item);
                    return (
                      <label
                        key={item}
                        onClick={() => toggleLookingFor(item)}
                        className="flex items-center gap-2.5 text-xs font-medium cursor-pointer select-none"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#9F1E19] border-[#9F1E19] text-white'
                              : 'border-[#A39D93] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Body Types Checkbox Card */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Body Types
              </label>
              <div className="bg-[#FAF7F2] rounded-[22px] p-4 text-[#16120F] shadow-xs">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    'A few extra pounds',
                    'Full-figured',
                    'Curvy',
                    'Average',
                    'Slender',
                    'Muscular',
                    'Athletic',
                  ].map((item) => {
                    const isChecked = bodyTypes.includes(item);
                    return (
                      <label
                        key={item}
                        onClick={() => toggleBodyType(item)}
                        className="flex items-center gap-2.5 text-xs font-medium cursor-pointer select-none"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#9F1E19] border-[#9F1E19] text-white'
                              : 'border-[#A39D93] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Education Checkbox Card */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                Education
              </label>
              <div className="bg-[#FAF7F2] rounded-[22px] p-4 text-[#16120F] shadow-xs">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    'High school',
                    'Graduate degree',
                    "Bachelor's degree",
                    "Associate's degree",
                    'Some college',
                    'Post-doctoral degree',
                  ].map((item) => {
                    const isChecked = education.includes(item);
                    return (
                      <label
                        key={item}
                        onClick={() => toggleEducation(item)}
                        className="flex items-center gap-2.5 text-xs font-medium cursor-pointer select-none"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#9F1E19] border-[#9F1E19] text-white'
                              : 'border-[#A39D93] bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: AGE, HEIGHT, PROFILE KEYWORDS, ACTIONS */}
          <div className="space-y-5 sm:space-y-6 flex flex-col justify-between">
            <div className="space-y-5 sm:space-y-6">
              {/* Age Range (Min & Max Sliders) */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-2">
                  <span>Age</span>
                  <span className="text-[#FCB943] font-serif text-sm">
                    {minAge} - {maxAge}
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#A39D93] w-7">Min</span>
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={minAge}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMinAge(Math.min(v, maxAge));
                      }}
                      className="w-full accent-[#9F1E19] h-1.5 bg-[#4A453E] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#A39D93] w-7">Max</span>
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={maxAge}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMaxAge(Math.max(v, minAge));
                      }}
                      className="w-full accent-[#9F1E19] h-1.5 bg-[#4A453E] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#A39D93] pl-9">
                    <span>18</span>
                    <span>35</span>
                    <span>60+</span>
                  </div>
                </div>
              </div>

              {/* Height Range (Min & Max Sliders) */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-2">
                  <span>Height</span>
                  <span className="text-[#FCB943] font-serif text-sm">
                    {heightMin} - {heightMax}
                  </span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#A39D93] w-7">Min</span>
                    <input
                      type="range"
                      min="58"
                      max="80"
                      value={heightMinInches}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setHeightMinInches(Math.min(v, heightMaxInches));
                      }}
                      className="w-full accent-[#9F1E19] h-1.5 bg-[#4A453E] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#A39D93] w-7">Max</span>
                    <input
                      type="range"
                      min="58"
                      max="80"
                      value={heightMaxInches}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setHeightMaxInches(Math.max(v, heightMinInches));
                      }}
                      className="w-full accent-[#9F1E19] h-1.5 bg-[#4A453E] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#A39D93] pl-9">
                    <span>4'10"</span>
                    <span>5'08"</span>
                    <span>6'08"+</span>
                  </div>
                </div>
              </div>

              {/* Profile Keywords Input */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#FAF7F2] mb-1.5">
                  Profile Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Type profile keywords here..."
                  className="w-full bg-[#FAF7F2] text-[#16120F] placeholder-[#6E6A63] rounded-full px-5 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9F1E19]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={handleApply}
                className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs sm:text-sm py-4 rounded-full transition-all shadow-md active:scale-[0.99] cursor-pointer text-center"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-[#FAF7F2] hover:bg-[#EFE7DA] text-[#16120F] font-bold text-xs sm:text-sm py-3.5 rounded-full transition-colors shadow-xs active:scale-[0.99] cursor-pointer text-center"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPreferenceModal;
