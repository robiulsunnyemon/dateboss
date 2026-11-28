import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Gamepad2,
  Coffee,
  Footprints,
  Mountain,
  Mic,
  Landmark,
  Film,
  Dice5,
  Mic2,
  Trophy,
  UtensilsCrossed,
  SunMedium,
  Store,
  Sparkles,
  Compass,
  Check,
  X,
} from 'lucide-react';

export interface OfferEventsViewProps {
  onBack: () => void;
  onContinue: (selectedEvents: string[]) => void;
  targetProfileName?: string;
}

interface OutingOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const DEFAULT_OUTINGS: OutingOption[] = [
  {
    id: 'weddings',
    name: 'Weddings',
    icon: (
      <svg
        className="w-5 h-5 text-[#9F1E19]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="13" r="5" />
        <circle cx="15" cy="13" r="5" />
        <path d="M12 7l1.5-2.5h-3L12 7z" />
      </svg>
    ),
  },
  {
    id: 'arcades',
    name: 'Arcades',
    icon: <Gamepad2 className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'walks',
    name: 'Walks',
    icon: (
      <svg
        className="w-5 h-5 text-[#9F1E19]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="4" r="2" />
        <path d="m9 20 3-6 2 3 2 3" />
        <path d="m6 13 4-2 3 2 3-1" />
      </svg>
    ),
  },
  {
    id: 'coffee',
    name: 'Coffee',
    icon: <Coffee className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'hiking',
    name: 'Hiking',
    icon: <Mountain className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'concerts',
    name: 'Concerts',
    icon: <Mic className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'museums',
    name: 'Museums & Galleries',
    icon: <Landmark className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'movies',
    name: 'Movies',
    icon: <Film className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'game-night',
    name: 'Game Night',
    icon: <Dice5 className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'karaoke',
    name: 'Karaoke',
    icon: <Mic2 className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'sports',
    name: 'Sports Games',
    icon: (
      <svg
        className="w-5 h-5 text-[#9F1E19]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M3 12h18" />
        <path d="M4.5 7.5a14 14 0 0 0 15 0" />
        <path d="M4.5 16.5a14 14 0 0 1 15 0" />
      </svg>
    ),
  },
  {
    id: 'cooking',
    name: 'Cooking Class',
    icon: <UtensilsCrossed className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'beach',
    name: 'Beach Day',
    icon: <SunMedium className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'market',
    name: 'Farmers Market',
    icon: <Store className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'festivals',
    name: 'Festivals & Fairs',
    icon: <Sparkles className="w-5 h-5 text-[#9F1E19]" />,
  },
  {
    id: 'day-trips',
    name: 'Day Trips',
    icon: <Compass className="w-5 h-5 text-[#9F1E19]" />,
  },
];

export function OfferEventsView({
  onBack,
  onContinue,
  targetProfileName,
}: OfferEventsViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customEvents, setCustomEvents] = useState<string[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!customEvents.includes(trimmed)) {
      setCustomEvents((prev) => [...prev, trimmed]);
      setSelectedIds((prev) => [...prev, `custom-${trimmed}`]);
    }
    setCustomInput('');
    setShowAddCustom(false);
  };

  const handleContinueClick = () => {
    const selectedNames = DEFAULT_OUTINGS
      .filter((ev) => selectedIds.includes(ev.id))
      .map((ev) => ev.name);

    const selectedCustoms = customEvents.filter((name) =>
      selectedIds.includes(`custom-${name}`)
    );

    const allSelected = [...selectedNames, ...selectedCustoms];
    onContinue(allSelected.length > 0 ? allSelected : ['Dinner & Outing']);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-0 sm:py-10 px-0 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      
      {/* Centered White/Cream Card matching Figma Desktop View & edge-to-edge on mobile */}
      <div className="w-full max-w-[840px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-5 sm:p-9 lg:p-11 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)]">
        
        {/* Top Header: Dark Red Rounded Back Button + thedateboss Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
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
            className="flex items-center gap-2 select-none"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* Eyebrow: — Events */}
        <div className="flex items-center gap-2 mt-6 sm:mt-7">
          <span className="w-4 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Events
          </span>
        </div>

        {/* Headline: Where Should The Date Take Them? */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-1.5">
          Where Should The Date Take Them?
        </h1>

        {/* Subtitle: Pick a kind of outing, or write your own. */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 leading-relaxed">
          Pick a kind of outing, or write your own.
        </p>

        {/* Events Grid: 2 columns on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 sm:mt-7">
          {DEFAULT_OUTINGS.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <div
                key={option.id}
                onClick={() => toggleSelect(option.id)}
                className={`rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[92px] sm:min-h-[102px] cursor-pointer transition-all active:scale-[0.98] select-none ${
                  isSelected
                    ? 'bg-[#F5F1E6] border-[1.5px] border-[#9F1E19] shadow-xs'
                    : 'bg-[#FAF7F2] border border-[#EADBCA] hover:border-[#9F1E19]/40 hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-start">
                  {option.icon}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <h3 className="font-sans font-medium text-xs sm:text-[13px] text-[#16120F] leading-snug">
                    {option.name}
                  </h3>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#9F1E19] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render any added custom events */}
          {customEvents.map((name) => {
            const customId = `custom-${name}`;
            const isSelected = selectedIds.includes(customId);
            return (
              <div
                key={customId}
                onClick={() => toggleSelect(customId)}
                className={`rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[92px] sm:min-h-[102px] cursor-pointer transition-all active:scale-[0.98] select-none ${
                  isSelected
                    ? 'bg-[#F5F1E6] border-[1.5px] border-[#9F1E19] shadow-xs'
                    : 'bg-[#FAF7F2] border border-[#EADBCA] hover:border-[#9F1E19]/40 hover:bg-[#FDFBF7]'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-start">
                  <Sparkles className="w-5 h-5 text-[#9F1E19]" />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <h3 className="font-sans font-medium text-xs sm:text-[13px] text-[#16120F] leading-snug truncate">
                    {name}
                  </h3>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#9F1E19] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom event section */}
        <div className="mt-4 sm:mt-5">
          {showAddCustom ? (
            <form
              onSubmit={handleAddCustom}
              className="bg-[#F5F1E6] border border-[#E8DFD0] rounded-[22px] p-3.5 flex flex-col sm:flex-row items-center gap-2.5 animate-in fade-in duration-150"
            >
              <input
                type="text"
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your custom outing idea..."
                className="w-full bg-[#FAF7F2] border border-[#E5DECF] rounded-full px-4 py-2 text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="submit"
                  className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs px-5 py-2 rounded-full font-medium cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="text-xs text-[#6E6A63] hover:text-[#16120F] px-2 py-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="w-full sm:w-auto border border-dashed border-[#E09094] bg-[#FBEFF0]/40 hover:bg-[#FBEFF0] text-[#9F1E19] rounded-full py-2.5 px-6 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add custom event</span>
            </button>
          )}
        </div>

        {/* Action Button: Continue */}
        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={handleContinueClick}
            className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 px-10 rounded-full shadow-sm transition-all active:scale-[0.99] cursor-pointer inline-flex items-center justify-center"
          >
            Continue
          </button>
        </div>

      </div>

    </div>
  );
}

export default OfferEventsView;
