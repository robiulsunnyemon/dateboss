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
} from 'lucide-react';

interface Step2GuestEventsProps {
  onBack: () => void;
  onContinue: (selectedEvents: string[]) => void;
}

interface OutingOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const DEFAULT_EVENTS: OutingOption[] = [
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
        <path d="M12 3l3 3-3 3-3-3 3-3z" />
        <circle cx="12" cy="14" r="7" />
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
    icon: <Footprints className="w-5 h-5 text-[#9F1E19]" />,
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
    icon: <Trophy className="w-5 h-5 text-[#9F1E19]" />,
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

export function Step2GuestEvents({ onBack, onContinue }: Step2GuestEventsProps) {
  const [events, setEvents] = useState<OutingOption[]>(DEFAULT_EVENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customEventName, setCustomEventName] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customEventName.trim();
    if (!trimmed) return;

    const newId = `custom-${Date.now()}`;
    const newOption: OutingOption = {
      id: newId,
      name: trimmed,
      icon: <Sparkles className="w-5 h-5 text-[#9F1E19]" />,
    };

    setEvents((prev) => [...prev, newOption]);
    setSelectedIds((prev) => [...prev, newId]);
    setCustomEventName('');
    setShowAddCustom(false);
  };

  const handleContinue = () => {
    const selectedNames = events
      .filter((ev) => selectedIds.includes(ev.id))
      .map((ev) => ev.name);
    onContinue(selectedNames);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-10 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      {/* Container: Edge-to-edge on mobile, centered card on desktop */}
      <div className="w-full max-w-[840px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-9 lg:p-11 shadow-none sm:shadow-[0_10px_40px_rgba(22,18,15,0.04)] animate-in fade-in duration-200">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95"
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

        {/* Section Badge: Events */}
        <div className="flex items-center gap-2 mt-5 sm:mt-6">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Events
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-1.5">
          Where Should The Offer <br className="hidden sm:inline" />
          Take Them?
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 mb-5 sm:mb-6 leading-relaxed">
          Pick a kind of outing, or write your own.
        </p>

        {/* Events Outing Grid: 2 columns on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {events.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <div
                key={option.id}
                onClick={() => toggleSelect(option.id)}
                className={`rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[90px] sm:min-h-[105px] cursor-pointer transition-all active:scale-[0.98] select-none ${
                  isSelected
                    ? 'bg-[#F5F1E6] border-2 border-[#9F1E19] shadow-xs ring-1 ring-[#9F1E19]/20'
                    : 'bg-[#F5F1E6] border border-[#E8DFD0] hover:border-[#9F1E19]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    {option.icon}
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#9F1E19] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-medium text-xs sm:text-[13px] text-[#16120F] leading-snug mt-2">
                  {option.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Add custom event trigger / form */}
        <div className="mt-4 sm:mt-5">
          {showAddCustom ? (
            <form onSubmit={handleAddCustom} className="flex items-center gap-2 max-w-[340px]">
              <input
                type="text"
                autoFocus
                value={customEventName}
                onChange={(e) => setCustomEventName(e.target.value)}
                placeholder="Enter event name..."
                className="w-full bg-[#F5F1E6] border border-[#9F1E19] rounded-full px-4 py-2 text-xs sm:text-sm text-[#16120F] placeholder:text-[#6E6A63] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs px-4 py-2 rounded-full font-medium shrink-0"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-xs text-[#6E6A63] hover:text-[#16120F] px-1"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="w-full sm:w-auto border border-dashed border-[#E09094] bg-[#FBEFF0]/40 hover:bg-[#FBEFF0] text-[#9F1E19] rounded-full py-2.5 px-5 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add custom event</span>
            </button>
          )}
        </div>

        {/* Action Button: Continue */}
        <div className="pt-6 sm:pt-7">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 sm:py-2.5 px-8 rounded-full shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}
