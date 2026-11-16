import React from 'react';
import {
  Check,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquare,
  Hourglass,
  CalendarCheck,
  ShieldCheck,
  Star
} from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1E1C19] font-sans antialiased selection:bg-[#8A1B22] selection:text-white">
      
      {/* =========================================================================
          1. HEADER / NAVBAR
         ========================================================================= */}
      <header className="w-full bg-[#FBF8F3] border-b border-[#EFE8DC]/80 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Wax Seal */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(138,27,34,0.3)]">
                <path
                  d="M50 4 C57 5 62 10 68 8 C75 7 80 13 85 18 C90 23 94 28 95 35 C96 42 93 47 96 54 C98 61 95 67 92 73 C89 79 83 83 78 87 C72 91 66 92 60 95 C53 97 47 95 41 96 C34 97 28 93 23 89 C17 85 13 80 9 74 C5 68 6 62 4 55 C3 48 6 42 6 36 C7 29 11 24 16 19 C21 14 27 10 33 8 C40 6 44 4 50 4 Z"
                  fill="#8A1B22"
                />
                <circle cx="50" cy="50" r="32" stroke="#661016" strokeWidth="2" strokeDasharray="3 3" fill="#75141B" />
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  fill="#F8EADB"
                  fontFamily="'Playfair Display', Georgia, serif"
                  fontWeight="bold"
                  fontSize="34"
                  fontStyle="italic"
                >
                  d
                </text>
              </svg>
            </div>
            <span className="font-serif-heading font-bold text-2xl tracking-tight text-[#1E1C19]">
              thedate<span className="text-[#8A1B22]">inc</span>
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <a href="#how-it-works" className="hover:text-[#8A1B22] transition-colors">How It Works</a>
            <a href="#why-us" className="hover:text-[#8A1B22] transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-[#8A1B22] transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-[#8A1B22] transition-colors">FAQ</a>
          </nav>

          {/* Sign In CTA */}
          <div>
            <button className="bg-[#8A1B22] hover:bg-[#721319] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow">
              Sign In
            </button>
          </div>

        </div>
      </header>


      {/* =========================================================================
          2. HERO SECTION
         ========================================================================= */}
      <section className="pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Action Cards */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              
              {/* Category Tag */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                  The Revolution
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-[#191715]">
                THE DATE STARTS <br />
                WITH AN <span className="text-[#8A1B22] italic font-serif">OFFER.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                Start the real conversations with a clear offer. Stop endless swiping. 
                Start meeting real people with real intentions on your terms.
              </p>

              {/* Two Action Cards Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Card 1: Amber / Gold Accent */}
                <div className="bg-[#FAF6EE] border border-[#E9DFCE] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FCECD0] text-amber-700 flex items-center justify-center text-xs">
                        🍸
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Step 01
                      </span>
                    </div>
                    <h3 className="font-serif-heading font-bold text-stone-900 text-base leading-snug">
                      You Send The Offer: Pick You, Them, And The Time
                    </h3>
                  </div>

                  <button className="w-full bg-[#E8A738] hover:bg-[#D69424] text-stone-950 font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                    <span>Send An Offer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2: Burgundy Accent */}
                <div className="bg-[#FAF6EE] border border-[#E9DFCE] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#F5DFE1] text-[#8A1B22] flex items-center justify-center text-xs">
                        ✨
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8A1B22]">
                        Step 02
                      </span>
                    </div>
                    <h3 className="font-serif-heading font-bold text-stone-900 text-base leading-snug">
                      You Receive The Offer: Say Yes, Counter, Or Pass
                    </h3>
                  </div>

                  <button className="w-full bg-[#8A1B22] hover:bg-[#721319] text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                    <span>Receive Offers Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Trust Checkmarks */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-stone-700">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#8A1B22]" /> 100% Verified Profiles
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#8A1B22]" /> No Endless Small Talk
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#8A1B22]" /> Real Chemistry First
                </span>
              </div>

            </div>

            {/* Right Column: Romantic Arch Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Arched image container */}
                <div className="overflow-hidden rounded-t-[220px] rounded-b-3xl border-4 border-[#EFE7D8] shadow-2xl bg-[#EBE2D0] aspect-[4/5] max-h-[580px]">
                  <img
                    src="/assets/hero-couple.jpg"
                    alt="Couple dining by candlelight"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          3. "LESS CHAT, MORE CHEMISTRY." (HOW IT WORKS)
         ========================================================================= */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#F7F2E8]/60 border-y border-[#ECE3D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                How It Works
              </span>
            </div>
            <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight">
              Less Chat. More Chemistry.
            </h2>
            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              A direct approach that turns hours of texting into real-world meetings. 
              When an offer is sent, expectations are clear from minute one.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Steps List */}
            <div className="lg:col-span-6 space-y-8">
              
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                    Set the Scene
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Choose the place, time, budget & who covers what.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                    Get An Answer
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    They have 48 hours to accept, decline, or suggest another time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#8A1B22]/10 text-[#8A1B22] flex items-center justify-center font-bold text-sm border border-[#8A1B22]/20">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-heading font-bold text-lg text-stone-900">
                    Connect Before You Meet
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    A dedicated chat unlocks so you can coordinate before your date.
                  </p>
                </div>
              </div>

            </div>

            {/* Static Date Offer Preview Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#FAF6EE] rounded-3xl p-6 md:p-8 border-2 border-[#E5DCCB] shadow-lg">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-4 mb-5">
                  <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                    Invitation Preview
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#8A1B22] bg-[#F7E2E4] px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>42h Left</span>
                  </div>
                </div>

                {/* Offer Title */}
                <h4 className="font-serif-heading font-bold text-2xl text-stone-900 mb-5">
                  Dinner For Two
                </h4>

                {/* Offer Details */}
                <div className="space-y-3 mb-6 text-xs text-stone-700">
                  <div className="flex items-center justify-between py-2 border-b border-stone-200/60">
                    <span className="text-stone-500">When</span>
                    <span className="font-semibold text-stone-900">Friday, Nov 10 • 7:30 PM</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-stone-200/60">
                    <span className="text-stone-500">Where</span>
                    <span className="font-semibold text-stone-900">The River Café, Brooklyn</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-stone-200/60">
                    <span className="text-stone-500">Terms</span>
                    <span className="font-semibold text-stone-900">You cover the bill</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500">Budget</span>
                    <span className="font-bold text-[#8A1B22] text-sm">$150 - $200</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-[#8A1B22] text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-[#721319] transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 bg-white text-stone-800 font-semibold py-2.5 px-4 rounded-xl text-xs border border-stone-300 hover:bg-stone-50 transition-colors">
                    Counter
                  </button>
                  <button className="text-stone-500 font-medium py-2.5 px-3 text-xs hover:text-stone-800 transition-colors">
                    Pass
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          4. "WHAT MAKES THEDATEINC DIFFERENT?"
         ========================================================================= */}
      <section id="why-us" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-14 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                Why Thedateinc
              </span>
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            </div>

            <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight">
              What Makes Thedateinc Different?
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Traditional dating apps keep you swiping. We make dating real by giving every match clear intent and zero ghosting. Only real dates, real people, real vibes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Card 1: Envelope Icon */}
            <div className="bg-[#FAF6EE] border border-[#EBE2D2] rounded-3xl p-8 lg:p-12 flex flex-col items-center shadow-sm">
              <div className="w-28 h-28 mb-6 flex items-center justify-center">
                <img
                  src="/assets/envelope-percent.png"
                  alt="Red envelope"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-serif-heading font-extrabold text-3xl md:text-4xl text-stone-900 mb-3">
                $10
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-sm">
                Average cost of endless drinks without intention. An offer cuts straight to real dates with verified intent.
              </p>
            </div>

            {/* Card 2: Lock Heart Icon */}
            <div className="bg-[#FAF6EE] border border-[#EBE2D2] rounded-3xl p-8 lg:p-12 flex flex-col items-center shadow-sm">
              <div className="w-28 h-28 mb-6 flex items-center justify-center">
                <img
                  src="/assets/lock-heart.png"
                  alt="Padlock with heart"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-serif-heading font-extrabold text-3xl md:text-4xl text-stone-900 mb-3">
                24h - 48h
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed max-w-sm">
                No weeks of ghosting. Every offer has an expiration clock for decisive answers.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          5. "WHAT OUR USERS ARE SAYING" (REVIEWS)
         ========================================================================= */}
      <section id="reviews" className="py-16 md:py-24 bg-[#F7F2E8]/50 border-t border-[#ECE3D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                Reviews
              </span>
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            </div>

            <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-stone-900">
              What Our Users Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Review 1 */}
            <div className="bg-[#FAF6EE] border border-[#E9DFCE] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "Instead of texting 'hey' back and forth for three weeks, Jordan sent an offer for tapas on Wednesday night. We met, hit it off instantly, and have been dating for 6 months now."
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-200/70">
                <img
                  src="/assets/avatar-1.png"
                  alt="Jordan Reed"
                  className="w-10 h-10 rounded-full object-cover border border-[#8A1B22]/30"
                />
                <div>
                  <h4 className="font-serif-heading font-bold text-sm text-stone-900">Jordan Reed</h4>
                  <p className="text-[11px] text-stone-500">New York, NY</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FAF6EE] border border-[#E9DFCE] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "The 48-hour expiration rule is a lifesaver. No more dead matches cluttering my inbox. People here are actually serious about meeting in the real world rather than collecting pen pals."
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-200/70">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Sarah Jenkins"
                  className="w-10 h-10 rounded-full object-cover border border-[#8A1B22]/30"
                />
                <div>
                  <h4 className="font-serif-heading font-bold text-sm text-stone-900">Sarah Jenkins</h4>
                  <p className="text-[11px] text-stone-500">Austin, TX</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#FAF6EE] border border-[#E9DFCE] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "Knowing exactly who is paying or splitting beforehand eliminated the weird bill-dance at dinner. Everything was transparent, respectful, and the venue was incredible."
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-200/70">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Marcus Sterling"
                  className="w-10 h-10 rounded-full object-cover border border-[#8A1B22]/30"
                />
                <div>
                  <h4 className="font-serif-heading font-bold text-sm text-stone-900">Marcus Sterling</h4>
                  <p className="text-[11px] text-stone-500">Chicago, IL</p>
                </div>
              </div>
            </div>

          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-3 pt-8">
            <button className="w-9 h-9 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#8A1B22] text-white flex items-center justify-center hover:bg-[#721319] transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* =========================================================================
          6. "BUILT AGAINST GHOSTING" (DARK SECTION)
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#141414] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#E63946]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E63946]">
                Anti-Ghosting
              </span>
            </div>

            <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
              Built Against Ghosting.
            </h2>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Dating app ghosting happens because there is zero accountability. 
              We replaced vague texting with structured date proposals, mutual confirmations, and real-time safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-[#1C1B1A] border border-stone-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A1B22]/20 border border-[#8A1B22]/40 flex items-center justify-center text-[#E63946]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading font-bold text-base text-white">
                Chat Opens After Yes
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                No endless texting without commitment. Chat only unlocks after an offer is agreed upon.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#1C1B1A] border border-stone-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A1B22]/20 border border-[#8A1B22]/40 flex items-center justify-center text-[#E63946]">
                <Hourglass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading font-bold text-base text-white">
                Offers Expire In 48 Hours
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Real-time decisions. No hanging conversations or forgotten matches.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#1C1B1A] border border-stone-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A1B22]/20 border border-[#8A1B22]/40 flex items-center justify-center text-[#E63946]">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading font-bold text-base text-white">
                Confirm The Day Before
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Both sides re-confirm 24 hours prior to prevent no-shows.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#1C1B1A] border border-stone-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A1B22]/20 border border-[#8A1B22]/40 flex items-center justify-center text-[#E63946]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading font-bold text-base text-white">
                Verified Public Venues
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Dates happen at approved, verified locations for safety and confidence.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          7. "FREQUENTLY ASKED QUESTIONS"
         ========================================================================= */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8A1B22]">
                FAQ
              </span>
              <span className="w-6 h-[2px] bg-[#8A1B22]"></span>
            </div>

            <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200">
            
            <div className="py-5">
              <div className="flex items-center justify-between">
                <span className="font-serif-heading font-bold text-base sm:text-lg text-stone-900">
                  1. What happens if I decline an offer?
                </span>
                <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
              <p className="pt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
                Declining an offer is simple and respectful. You can pass with one tap, or use the "Counter" button to suggest an alternative time, date, or venue.
              </p>
            </div>

            <div className="py-5">
              <div className="flex items-center justify-between">
                <span className="font-serif-heading font-bold text-base sm:text-lg text-stone-900">
                  2. Is this an escort or paid companionship service?
                </span>
                <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="py-5">
              <div className="flex items-center justify-between">
                <span className="font-serif-heading font-bold text-base sm:text-lg text-stone-900">
                  3. What happens if someone doesn't show up?
                </span>
                <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="py-5">
              <div className="flex items-center justify-between">
                <span className="font-serif-heading font-bold text-base sm:text-lg text-stone-900">
                  4. Can I switch between Send and Receive Offers?
                </span>
                <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          8. CALL TO ACTION BANNER (MAKE THE FIRST MOVE WORTH ANSWERING)
         ========================================================================= */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-[#F7F2E8] border border-[#E7DECC] rounded-3xl p-8 sm:p-14 text-center shadow-md">
          
          <div className="flex flex-col items-center max-w-xl mx-auto space-y-5">
            
            {/* Wax Seal Stamp Icon */}
            <div className="w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(138,27,34,0.35)]">
                <path
                  d="M50 4 C57 5 62 10 68 8 C75 7 80 13 85 18 C90 23 94 28 95 35 C96 42 93 47 96 54 C98 61 95 67 92 73 C89 79 83 83 78 87 C72 91 66 92 60 95 C53 97 47 95 41 96 C34 97 28 93 23 89 C17 85 13 80 9 74 C5 68 6 62 4 55 C3 48 6 42 6 36 C7 29 11 24 16 19 C21 14 27 10 33 8 C40 6 44 4 50 4 Z"
                  fill="#8A1B22"
                />
                <circle cx="50" cy="50" r="32" stroke="#661016" strokeWidth="2" strokeDasharray="3 3" fill="#75141B" />
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  fill="#F8EADB"
                  fontFamily="'Playfair Display', Georgia, serif"
                  fontWeight="bold"
                  fontSize="34"
                  fontStyle="italic"
                >
                  d
                </text>
              </svg>
            </div>

            {/* Headline */}
            <h2 className="font-serif-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight">
              MAKE THE FIRST MOVE <br />
              <span className="text-[#8A1B22] italic font-serif">WORTH ANSWERING.</span>
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
              <button className="w-full sm:w-auto bg-[#E8A738] hover:bg-[#D69424] text-stone-950 font-bold py-3 px-8 rounded-full text-xs transition-colors shadow">
                Send An Offer
              </button>
              <button className="w-full sm:w-auto bg-[#8A1B22] hover:bg-[#721319] text-white font-bold py-3 px-8 rounded-full text-xs transition-colors shadow">
                Receive Offers Now
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          9. FOOTER
         ========================================================================= */}
      <footer className="w-full border-t border-[#ECE3D4] py-8 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#8A1B22" />
                  <text
                    x="50"
                    y="60"
                    textAnchor="middle"
                    fill="#F8EADB"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontWeight="bold"
                    fontSize="36"
                    fontStyle="italic"
                  >
                    d
                  </text>
                </svg>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                © {new Date().getFullYear()} The Date Inc. All rights reserved.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-600">
              <a href="#terms" className="hover:text-[#8A1B22]">Terms of Service</a>
              <a href="#privacy" className="hover:text-[#8A1B22]">Privacy Policy</a>
              <a href="#safety" className="hover:text-[#8A1B22]">Safety Tips</a>
              <a href="#contact" className="hover:text-[#8A1B22]">Contact Support</a>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
