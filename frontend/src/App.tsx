import React from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

export function App() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans antialiased selection:bg-[#961C23] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          RIGHT HERO IMAGE WITH PRECISE CONVEX CURVED MASK
          (Starts at top: 0, covers right half of Hero section)
         ========================================================================= */}
      <div className="absolute right-0 top-0 h-[820px] xl:h-[880px] w-[50%] xl:w-[48%] z-10 pointer-events-none hidden lg:block overflow-hidden">
        
        {/* SVG ClipPath Definition for the exact curved arc */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroRightArc" clipPathUnits="objectBoundingBox">
              <path d="M 0.14, 0 
                       C 0.06, 0.22, 0.01, 0.42, 0.01, 0.55 
                       C 0.01, 0.70, 0.06, 0.86, 0.16, 1 
                       L 1, 1 
                       L 1, 0 
                       Z" />
            </clipPath>
          </defs>
        </svg>

        {/* The Couple Dining Image */}
        <div
          className="w-full h-full relative"
          style={{ clipPath: 'url(#heroRightArc)' }}
        >
          <img
            src="/assets/hero-couple.jpg"
            alt="Romantic couple dining with wine glasses at restaurant table"
            className="w-full h-full object-cover object-[center_right] pointer-events-auto"
          />
          {/* Subtle warm depth vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          1. HEADER / NAVIGATION BAR
         ========================================================================= */}
      <header className="w-full relative z-30 pt-6 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* Left: Wax Seal Logo + "thedateboss" */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_5px_rgba(150,28,35,0.35)]">
                <path
                  d="M50 4 
                     C57 5 62 10 68 8 
                     C75 7 80 13 85 18 
                     C90 23 94 28 95 35 
                     C96 42 93 47 96 54 
                     C98 61 95 67 92 73 
                     C89 79 83 83 78 87 
                     C72 91 66 92 60 95 
                     C53 97 47 95 41 96 
                     C34 97 28 93 23 89 
                     C17 85 13 80 9 74 
                     C5 68 6 62 4 55 
                     C3 48 6 42 6 36 
                     C7 29 11 24 16 19 
                     C21 14 27 10 33 8 
                     C40 6 44 4 50 4 Z"
                  fill="#961C23"
                />
                <circle cx="50" cy="50" r="32" stroke="#681016" strokeWidth="2" strokeDasharray="3 3" fill="#84171E" />
                <text
                  x="50"
                  y="61"
                  textAnchor="middle"
                  fill="#F7EADB"
                  fontFamily="'Playfair Display', Georgia, serif"
                  fontWeight="bold"
                  fontSize="36"
                  fontStyle="italic"
                >
                  d
                </text>
              </svg>
            </div>

            <span className="font-serif font-bold text-2xl tracking-tight text-[#1E1C1A]">
              thedateboss
            </span>
          </div>

          {/* Center-Left Nav Capsule + Right Join Button */}
          <div className="flex items-center justify-end flex-1">
            <nav className="bg-[#EFE9DF]/85 backdrop-blur-md border border-[#E5DECF]/80 rounded-full px-7 py-2.5 hidden sm:flex items-center gap-8 text-xs font-medium text-[#5F5B54] shadow-sm mr-8 md:mr-16 lg:mr-28 xl:mr-40">
              <a href="#how-it-works" className="hover:text-[#961C23] transition-colors">How it works</a>
              <a href="#roles" className="hover:text-[#961C23] transition-colors">Roles</a>
              <a href="#safety" className="hover:text-[#961C23] transition-colors">Safety</a>
              <a href="#faq" className="hover:text-[#961C23] transition-colors">FAQ</a>
            </nav>

            <button className="bg-[#961C23] hover:bg-[#7D141A] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow shrink-0">
              Join now
            </button>
          </div>

        </div>
      </header>


      {/* =========================================================================
          2. HERO SECTION
         ========================================================================= */}
      <section className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14 pt-8 lg:pt-14 pb-12 lg:pb-24 min-h-[720px] flex flex-col justify-center">
        
        <div className="w-full lg:w-[54%] xl:w-[52%] space-y-7 pr-2 sm:pr-4">
          
          {/* Label: Gifted dating */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              Gifted dating
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-[68px] leading-[1.08] tracking-tight text-[#1A1816]">
            THE DATE STARTS <br />
            WITH AN <span className="text-[#961C23] font-serif">OFFER.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#656059] text-sm sm:text-base leading-relaxed max-w-lg font-normal">
            Skip the 'hey'. Propose a real lunch, dinner or event, and let them say yes. Fewer ghosts, more tables for two.
          </p>

          {/* Two Action Cards Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-xl">
            
            {/* Card 1: Host */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px] hover:border-[#F3A83B] transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                  <span className="text-[#F3A83B] text-sm leading-none">👑</span>
                  <span className="font-medium">Host</span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                  You Send The Offers. Pick The Place And The Time.
                </h3>
              </div>

              <button className="w-full bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm">
                Join as a Host
              </button>
            </div>

            {/* Card 2: Guest of Honor */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[22px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[195px] hover:border-[#961C23] transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                  <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                  <span className="font-medium">Guest of Honor</span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
                  You Receive The Offers. Say Yes, Counter Or Pass.
                </h3>
              </div>

              <button className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3 px-4 rounded-full transition-colors mt-4 text-center shadow-sm">
                Join as a Guest of Honor
              </button>
            </div>

          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6D6760] font-normal pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8E8880]" /> ID-verified members
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8E8880]" /> Public venues only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8E8880]" /> Offers expire in 48h
            </span>
          </div>

        </div>

        {/* Mobile/Tablet fallback view of the image (placed below cards on < lg screens) */}
        <div className="block lg:hidden mt-10 w-full rounded-2xl overflow-hidden shadow-lg border border-[#E8E1D3] max-h-[380px]">
          <img
            src="/assets/hero-couple.jpg"
            alt="Romantic couple dining"
            className="w-full h-full object-cover object-center"
          />
        </div>

      </section>


      {/* =========================================================================
          3. "LESS CHAT. MORE CHEMISTRY." (HOW IT WORKS)
         ========================================================================= */}
      <section id="how-it-works" className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14 pb-14 sm:pb-20">
        
        {/* Large Rounded Container Card */}
        <div className="bg-[#F4EFE6] border border-[#E8DFD0] rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              How it works
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] leading-[1.12] tracking-tight mb-4">
            Less Chat. <br />
            More Chemistry.
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6860] text-sm sm:text-base leading-relaxed max-w-2xl font-normal mb-8 sm:mb-10">
            A direct, graceful rhythm for meeting someone — with enough information to say yes, no, or perhaps another time.
          </p>

          {/* The 3 Steps with Horizontal Dividers */}
          <div className="space-y-5 mb-8">
            
            {/* Step 01 */}
            <div className="border-b border-[#E3D9C8]/80 pb-4">
              <span className="text-xs font-semibold text-[#961C23]">01</span>
              <h3 className="font-serif font-bold text-lg text-[#1A1816] mt-0.5">
                Set The Scene
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                Choose the venue, the time and the gesture. Every place is public and thoughtfully selected.
              </p>
            </div>

            {/* Step 02 */}
            <div className="border-b border-[#E3D9C8]/80 pb-4">
              <span className="text-xs font-semibold text-[#961C23]">02</span>
              <h3 className="font-serif font-bold text-lg text-[#1A1816] mt-0.5">
                Get An Answer
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                They have 48 hours to accept, decline, or suggest another time. No hanging conversations.
              </p>
            </div>

            {/* Step 03 */}
            <div className="pb-1">
              <span className="text-xs font-semibold text-[#961C23]">03</span>
              <h3 className="font-serif font-bold text-lg text-[#1A1816] mt-0.5">
                Connect Before You Meet
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                Once accepted, private chat opens. A check-in before the date keeps plans on track.
              </p>
            </div>

          </div>

          {/* Nested Invitation Card (An offer for you) */}
          <div className="bg-[#FAF7F2] border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
            
            <div className="mb-4">
              <span className="text-xs text-[#8E8880] font-normal block">
                An offer for you
              </span>
              <h4 className="font-serif font-bold text-2xl text-[#1A1816] mt-1">
                Dinner For Two
              </h4>
            </div>

            {/* Details Table */}
            <div className="divide-y divide-[#EBE3D3] text-xs mb-6">
              
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#8E8880] font-normal">When</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Thu, Nov 9, 8:00 PM</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#8E8880] font-normal">Where</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Osteria Verde, Downtown</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#8E8880] font-normal">The gift</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Dinner is on Alex</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="text-[#8E8880] font-normal">Expires in</span>
                <span className="font-bold text-[#961C23] text-xs sm:text-sm">47h 12min</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="bg-[#961C23] hover:bg-[#7D141A] text-white font-semibold text-xs px-6 py-2 rounded-full shadow-sm transition-colors">
                Accept
              </button>

              <button className="bg-white hover:bg-stone-50 border border-[#D5CEC2] text-[#1E1C1A] font-semibold text-xs px-6 py-2 rounded-full transition-colors">
                Counter
              </button>

              <button className="text-[#7A756D] hover:text-[#1E1C1A] text-xs font-medium px-4 py-2 transition-colors">
                Pass
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          4. "WHAT MAKES THEDATEBOSS DIFFERENT?" (THE THEDATEBOSS ADVANTAGE)
         ========================================================================= */}
      <section id="why-us" className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14 pb-14 sm:pb-20">
        
        {/* Large Rounded Container Card */}
        <div className="bg-[#F4EFE6] border border-[#E8DFD0] rounded-[32px] p-8 sm:p-12 lg:p-16 text-center shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              The Thedateboss Advantage
            </span>
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] tracking-tight mb-4">
            What Makes Thedateboss Different?
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6860] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal mb-12 lg:mb-16">
            Thedateboss is like a fast lane for dating. Ditch endless messaging. Get noticed and get to the good stuff — real dates — way quicker. Check out these impressive numbers:
          </p>

          {/* Two Visual Graphic Metric Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto items-start">
            
            {/* Column 1: $99 with Red Envelope */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src="/assets/envelope-percent.png"
                  alt="Red envelope with percentage symbol"
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-serif font-bold text-4xl sm:text-5xl text-[#1A1816]">
                $99
              </h3>

              <p className="text-[#6E6860] text-xs sm:text-sm leading-relaxed max-w-xs">
                With an average offer of approximately $99, members demonstrate a genuine interest in turning online connections into real-life dates.
              </p>
            </div>

            {/* Column 2: 25% with Red Lock Heart */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src="/assets/lock-heart.png"
                  alt="Red lock with heart speech bubble"
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-serif font-bold text-4xl sm:text-5xl text-[#1A1816]">
                25%
              </h3>

              <p className="text-[#6E6860] text-xs sm:text-sm leading-relaxed max-w-xs">
                And the best part? Nearly 25% of all offers sent on thedateboss end with a resounding yes.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          5. "WHAT OUR USERS ARE SAYING" (TESTIMONIALS)
         ========================================================================= */}
      <section id="reviews" className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14 pb-20">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              Testimonials
            </span>
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          </div>

          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1A1816] tracking-tight">
            What Our Users Are Saying
          </h2>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Farhan Ahmed */}
          <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
            <p className="text-[#6E6860] text-xs sm:text-[13px] leading-relaxed mb-6 font-normal">
              "I had the best experience with a date! We tried paddle boarding! It was so windy that we got blown backwards and we laughed the whole time as I struggled! We saw seals in the harbor and it was something I always wanted to do! It was a fun, exciting, great first date, and we are still seeing each other!"
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
              <img
                src="/assets/avatar-1.png"
                alt="Farhan Ahmed"
                className="w-10 h-10 rounded-full object-cover border border-[#961C23]/30"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1A1816]">Farhan Ahmed</h4>
                <p className="text-[10px] text-[#8E8880]">Host</p>
              </div>
            </div>
          </div>

          {/* Card 2: Farhana Ahmed */}
          <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
            <p className="text-[#6E6860] text-xs sm:text-[13px] leading-relaxed mb-6 font-normal">
              "An exceptional, easy-to-navigate platform that makes meeting generous and established local men completely stress-free. Backed by top-tier safety and verified profiles, I was reviewing tailored offers and arranging memorable dates within days. It delivers an effortless, premium dating experience from the very first step."
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                alt="Farhana Ahmed"
                className="w-10 h-10 rounded-full object-cover border border-[#961C23]/30"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1A1816]">Farhana Ahmed</h4>
                <p className="text-[10px] text-[#8E8880]">Guest of honor</p>
              </div>
            </div>
          </div>

          {/* Card 3: Aissatou Balde */}
          <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
            <p className="text-[#6E6860] text-xs sm:text-[13px] leading-relaxed mb-6 font-normal">
              "The standout experience on thedateboss has been the prompt, dedicated support team. Whenever I had an inquiry, it was handled swiftly with genuine care and clear guidance. The platform truly honors its promise of fostering meaningful, high-caliber connections between like-minded individuals."
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Aissatou Balde"
                className="w-10 h-10 rounded-full object-cover border border-[#961C23]/30"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1A1816]">Aissatou Balde</h4>
                <p className="text-[10px] text-[#8E8880]">Host</p>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            aria-label="Previous review"
            className="w-9 h-9 rounded-full bg-white border border-[#D5CEC2] flex items-center justify-center text-[#6E6860] hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next review"
            className="w-9 h-9 rounded-full bg-[#961C23] text-white flex items-center justify-center hover:bg-[#7D141A] transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>


      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer className="w-full border-t border-[#ECE3D4] py-8 bg-[#FAF7F2]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-serif font-bold text-sm text-[#1E1C1A]">thedateboss</span>
            <span>• © {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#5F5B54]">
            <a href="#how-it-works" className="hover:text-[#961C23]">How it works</a>
            <a href="#roles" className="hover:text-[#961C23]">Roles</a>
            <a href="#safety" className="hover:text-[#961C23]">Safety</a>
            <a href="#faq" className="hover:text-[#961C23]">FAQ</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
