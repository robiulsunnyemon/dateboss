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
} from 'lucide-react';

interface Step2GuestEventsProps {
  onBack: () => void;
  onContinue: (data: {
    selectedEvents: string[];
    customIdeas: Array<{ title: string; description: string }>;
  }) => void;
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
  // Start with empty selection so no cards are selected initially (0 chosen)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [customIdeas, setCustomIdeas] = useState<
    Array<{ title: string; description: string }>
  >([
    {
      title: 'Rooftop Sunset Picnic',
      description:
        'Blankets, good snacks and a view of the city as the lights come on.',
    },
  ]);

  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = customTitle.trim();
    if (!trimmedTitle) return;

    setCustomIdeas((prev) => [
      ...prev,
      {
        title: trimmedTitle,
        description:
          customDesc.trim() || 'A personalized custom date experience.',
      },
    ]);
    setCustomTitle('');
    setCustomDesc('');
    setShowAddCustom(false);
  };

  const handleContinue = () => {
    const selectedNames = DEFAULT_EVENTS.filter((ev) =>
      selectedIds.includes(ev.id)
    ).map((ev) => ev.name);

    onContinue({
      selectedEvents: selectedNames,
      customIdeas,
    });
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
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
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

        {/* Step Badge: Step 2 of 3 */}
        <div className="flex items-center gap-2 mt-5 sm:mt-6">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Step 2 of 3
          </span>
        </div>

        {/* Headline: Invite Me To... */}
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] tracking-tight leading-tight mt-1.5">
          Invite Me To...
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-1 leading-relaxed max-w-[580px]">
          Choose the outings you&apos;d love to be asked on. Hosts see these on your profile and can send an invitation for any of them.
        </p>

        {/* Dynamic Chosen Counter */}
        <div className="text-[#9F1E19] text-xs font-semibold my-2.5">
          {selectedIds.length} chosen
        </div>

        {/* Events Outing Grid: 2 columns on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {DEFAULT_EVENTS.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <div
                key={option.id}
                onClick={() => toggleSelect(option.id)}
                className={`rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between min-h-[90px] sm:min-h-[105px] cursor-pointer transition-all active:scale-[0.98] select-none ${
                  isSelected
                    ? 'bg-[#F5F1E6] border-[1.5px] border-[#9F1E19] shadow-xs'
                    : 'bg-[#F5F1E6] border border-[#E8DFD0] hover:border-[#9F1E19]/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-start">
                  {option.icon}
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
            <form
              onSubmit={handleAddCustomIdea}
              className="bg-[#FAF7F2] border border-[#E8DFD0] rounded-[22px] p-4 space-y-3 max-w-[540px]"
            >
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">
                  Idea Title
                </label>
                <input
                  type="text"
                  autoFocus
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Vintage Bookstore & Jazz Lounge"
                  className="w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full px-4 py-2 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#16120F] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="e.g. Browsing old classics and listening to vinyl over tea."
                  className="w-full bg-[#F5F1E6] border border-[#E5DECF] rounded-full px-4 py-2 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs px-5 py-2 rounded-full font-medium"
                >
                  Save idea
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="text-xs text-[#6E6A63] hover:text-[#16120F] px-2 py-2"
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

        {/* My Own Ideas Section */}
        <div className="mt-5 sm:mt-6">
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#16120F] mb-2.5">
            My Own Ideas
          </h4>
          <div className="space-y-2.5">
            {customIdeas.map((idea, index) => (
              <div
                key={index}
                className="bg-[#F5F1E6] border border-[#E8DFD0] rounded-[20px] p-4 sm:p-5 text-left"
              >
                <h5 className="font-serif font-bold text-xs sm:text-sm text-[#16120F]">
                  {idea.title}
                </h5>
                <p className="text-xs text-[#6E6A63] mt-1 leading-relaxed">
                  {idea.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Continue & Footer note */}
        <div className="pt-6 sm:pt-7">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 sm:py-2.5 px-10 rounded-full shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            Continue
          </button>

          <p className="text-xs text-[#6E6A63] mt-3 font-normal text-center sm:text-left">
            You can change it any time
          </p>
        </div>

      </div>
    </div>
  );
}
