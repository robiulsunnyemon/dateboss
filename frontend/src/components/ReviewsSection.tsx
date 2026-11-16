import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const ReviewsSection: React.FC<{ isMobileFrame?: boolean }> = ({ isMobileFrame = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      quote: "Instead of texting 'hey' back and forth for three weeks, Liam sent an offer for tapas on Wednesday night. We met, hit it off instantly, and have been dating for 6 months now. It removes all the awkward guessing games.",
      author: "Sarah Jenkins",
      role: "User • New York, NY",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 2,
      quote: "The 48-hour expiration rule is a lifesaver. No more dead matches cluttering my inbox. People here are actually serious about meeting in the real world rather than collecting pen pals.",
      author: "Michael Chen",
      role: "User • Austin, TX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 3,
      quote: "Knowing exactly who is paying or splitting beforehand eliminated the weird bill-dance at dinner. Everything was transparent, respectful, and the venue was incredible.",
      author: "Emma & Liam",
      role: "Coupled • Chicago, IL",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#F7F2E9]/50 border-t border-[#ECE4D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
              Reviews
            </span>
            <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
          </div>

          <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-stone-900">
            What Our Users Are Saying
          </h2>
        </div>

        {/* Reviews Display */}
        {isMobileFrame ? (
          /* Mobile Single Card */
          <div className="space-y-6">
            <div className="bg-[#FAF6EE] border border-[#E9E1D2] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[260px]">
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-stone-700 text-sm leading-relaxed italic mb-6">
                "{reviews[currentIndex].quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-200/70">
                <img
                  src={reviews[currentIndex].avatar}
                  alt={reviews[currentIndex].author}
                  className="w-10 h-10 rounded-full object-cover border border-[#8A1B22]/30"
                />
                <div>
                  <h4 className="font-serif-heading font-bold text-sm text-stone-900">
                    {reviews[currentIndex].author}
                  </h4>
                  <p className="text-[11px] text-stone-500">{reviews[currentIndex].role}</p>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-50"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-[#8A1B22] text-white flex items-center justify-center hover:bg-[#6E1118]"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Grid with 3 Cards */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF6EE] border border-[#E9E1D2] rounded-3xl p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 text-amber-500 mb-4">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed italic mb-6">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-200/70">
                    <img
                      src={item.avatar}
                      alt={item.author}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#8A1B22]/20"
                    />
                    <div>
                      <h4 className="font-serif-heading font-bold text-sm text-stone-900">
                        {item.author}
                      </h4>
                      <p className="text-xs text-stone-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-[#8A1B22] text-white flex items-center justify-center hover:bg-[#6E1118] transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
