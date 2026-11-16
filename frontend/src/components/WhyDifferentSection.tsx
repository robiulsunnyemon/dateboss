import React, { useState } from 'react';

export const WhyDifferentSection: React.FC<{ isMobileFrame?: boolean }> = ({ isMobileFrame = false }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const cards = [
    {
      id: 'card-1',
      title: '$10',
      description: 'Average cost of endless drinks without intention. An offer cuts straight to real dates with verified intent.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#8A1B22]" fill="currentColor">
          {/* Stylized Red Envelope with % symbol */}
          <path d="M10 25 L50 55 L90 25 Z" fill="#A8232B" opacity="0.9" />
          <path d="M8 28 L50 60 L92 28 L92 78 C92 82 88 86 84 86 L16 86 C12 86 8 82 8 78 Z" fill="#8A1B22" />
          {/* White Percentage symbol on envelope */}
          <circle cx="38" cy="48" r="4.5" fill="#FFFFFF" />
          <circle cx="62" cy="66" r="4.5" fill="#FFFFFF" />
          <path d="M64 46 L36 68" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'card-2',
      title: '24h - 48h',
      description: 'No weeks of ghosting. Every offer has an expiration clock for decisive answers and real chemistry.',
      icon: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#8A1B22]" fill="currentColor">
          {/* Stylized Padlock with Heart */}
          <path d="M35 45 L35 30 C35 22 42 15 50 15 C58 15 65 22 65 30 L65 45" fill="none" stroke="#8A1B22" strokeWidth="9" strokeLinecap="round" />
          <rect x="22" y="42" width="56" height="46" rx="12" fill="#8A1B22" />
          {/* Heart shaped keyhole */}
          <path d="M50 58 C46 54 40 56 40 61 C40 66 50 72 50 72 C50 72 60 66 60 61 C60 56 54 54 50 58 Z" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  return (
    <section id="why-different" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-14 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
              Why Choose Thedateinc
            </span>
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
          </div>

          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight">
            What Makes Thedateinc Different?
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Traditional dating apps keep you swiping. We make dating real by giving every match clear intent and zero ghosting. 
            Only real dates, real people, real vibes.
          </p>
        </div>

        {/* Feature Cards Grid (Desktop: 2 side by side, Mobile: Swipe/Tab carousel or Stack) */}
        {isMobileFrame ? (
          <div className="space-y-6">
            <div className="bg-[#FAF6EE] border border-[#EBE3D3] rounded-3xl p-8 flex flex-col items-center shadow-sm">
              <div className="mb-6 drop-shadow-md">
                {cards[activeSlide].icon}
              </div>
              <h3 className="font-serif-heading font-extrabold text-3xl text-stone-900 mb-3">
                {cards[activeSlide].title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-sm">
                {cards[activeSlide].description}
              </p>
            </div>

            {/* Mobile Carousel Indicator Dots */}
            <div className="flex justify-center items-center gap-2">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeSlide === idx ? 'w-6 bg-[#8A1B22]' : 'bg-stone-300'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#FAF6EE] border border-[#EBE3D3] rounded-3xl p-8 lg:p-12 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-[#8A1B22]/40 transition-all group"
              >
                <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="font-serif-heading font-extrabold text-3xl md:text-4xl text-stone-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
