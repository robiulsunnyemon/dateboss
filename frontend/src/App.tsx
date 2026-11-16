import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Clock,
  CalendarCheck,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

export function App() {
  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile navigation style: 'card' (Image 1 - Light Card Dropdown) | 'overlay' (Image 2 - Dark Fullscreen Backdrop)
  const [mobileMenuStyle, setMobileMenuStyle] = useState<'card' | 'overlay'>('card');

  // Carousel state for mobile metrics ($99 and 25%)
  const [activeMetricSlide, setActiveMetricSlide] = useState(0);

  // Carousel state for mobile testimonials
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const metrics = [
    {
      id: 1,
      image: '/assets/envelope-percent.png',
      alt: 'Red envelope with percentage symbol',
      value: '$99',
      desc: 'With an average offer of approximately $99, members demonstrate a genuine interest in turning online connections into real-life dates.',
    },
    {
      id: 2,
      image: '/assets/lock-heart.png',
      alt: 'Red lock with heart speech bubble',
      value: '25%',
      desc: 'And the best part? Nearly 25% of all offers sent on thedateboss end with a resounding yes.',
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        '"I had the best experience with a date! We tried paddle boarding! It was so windy that we got blown backwards and we laughed the whole time as I struggled! We saw seals in the harbor and it was something I always wanted to do! It was a fun, exciting, great first date, and we are still seeing each other!"',
      name: 'Farhan Ahmed',
      role: 'Host',
      avatar: '/assets/avatar-1.png',
    },
    {
      id: 2,
      quote:
        '"An exceptional, easy-to-navigate platform that makes meeting generous and established local men completely stress-free. Backed by top-tier safety and verified profiles, I was reviewing tailored offers and arranging memorable dates within days. It delivers an effortless, premium dating experience from the very first step."',
      name: 'Farhana Ahmed',
      role: 'Guest of honor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      quote:
        '"The standout experience on thedateboss has been the prompt, dedicated support team. Whenever I had an inquiry, it was handled swiftly with genuine care and clear guidance. The platform truly honors its promise of fostering meaningful, high-caliber connections between like-minded individuals."',
      name: 'Aissatou Balde',
      role: 'Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const handlePrevReview = () => {
    setActiveReviewSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setActiveReviewSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const features = [
    {
      title: 'Chat Opens After Yes',
      description: 'No inbox to drown in. Messages unlock only once an offer is accepted.',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      title: 'Offers Expire In 48 Hours',
      description: 'Every offer has a clock. Answer, counter or let it go — nothing lingers.',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      title: 'Confirm The Day Before',
      description: 'A 24-hour check-in backed by a small refundable hold. Interest where you both arrive.',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      title: 'Verified, Public, Reliable',
      description: 'ID-verified members, public venues only, and a reliability score after every date.',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  const faqs = [
    {
      question: '1. Do Guests Of Honor Ever Pay?',
      answer:
        'Never. No plan, no card, no catch. Hosts carry a $9.99 monthly membership that keeps the community serious.',
    },
    {
      question: '2. Is This An Escort Or Paid-Companionship Service?',
      answer:
        'No, absolutely not. Thedateboss is strictly a premium dating platform designed for genuine romantic connections and intentional dates. Compensated dating or escorting is strictly prohibited and immediately banned.',
    },
    {
      question: "3. What Happens If Someone Doesn't Show?",
      answer:
        'We enforce a strict Anti-Ghosting protocol. Both members confirm 24 hours prior. Unexcused no-shows trigger reliability penalties and temporary or permanent account suspension.',
    },
    {
      question: '4. Can I Switch Between Host And Guest Of Honor?',
      answer:
        'Yes! Every member has full versatility. You can switch between initiating date offers as a Host and receiving curated date proposals as a Guest of Honor whenever you like.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans antialiased selection:bg-[#961C23] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          HERO SECTION WRAPPER
          - Desktop: Header + Left Content + Right Sweeping Curved Couple Photo
          - Mobile: Clean header with hamburger menu, stacked cards, photo hidden
         ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] overflow-hidden min-h-0 lg:h-[730px] xl:h-[770px] flex flex-col justify-between">
        
        {/* SVG ClipPath Definition matching the exact user-drawn sweeping arc */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroUserDrawnArc" clipPathUnits="objectBoundingBox">
              <path d="M 0.44, 0 
                       C 0.28, 0.16, 0.12, 0.34, 0.04, 0.52 
                       C -0.01, 0.68, 0.01, 0.84, 0.04, 1 
                       L 1, 1 
                       L 1, 0 
                       Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Right Photo: Visible strictly on desktop (hidden on mobile/tablet) */}
        <div className="absolute right-0 top-0 bottom-0 w-[50%] h-full z-10 pointer-events-none hidden lg:block overflow-hidden">
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'url(#heroUserDrawnArc)' }}
          >
            <img
              src="/assets/hero-couple.jpg"
              alt="Romantic couple dining with wine glasses at restaurant table"
              className="w-full h-full object-cover object-[center_right] pointer-events-auto"
            />
            {/* Subtle warm lighting vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          </div>
        </div>

        {/* 1. HEADER / NAVIGATION BAR */}
        <header className="w-full relative z-30 pt-4 sm:pt-6 px-4 sm:px-10 lg:px-14">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Mobile Hamburger Menu Button (visible on mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 -ml-1 text-[#1E1C1A] hover:text-[#961C23] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Left/Center: Wax Seal Logo + "thedateboss" */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative shrink-0">
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

              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#1E1C1A]">
                thedateboss
              </span>
            </div>

            {/* Center Desktop: Nav Capsule on clean cream background */}
            <nav className="bg-[#EFE9DF]/85 backdrop-blur-md border border-[#E5DECF] rounded-full px-7 py-2.5 hidden md:flex items-center gap-7 text-xs font-medium text-[#5F5B54] shadow-sm">
              <a href="#how-it-works" className="hover:text-[#961C23] transition-colors">How it works</a>
              <a href="#roles" className="hover:text-[#961C23] transition-colors">Roles</a>
              <a href="#safety" className="hover:text-[#961C23] transition-colors">Safety</a>
              <a href="#faq" className="hover:text-[#961C23] transition-colors">FAQ</a>
            </nav>

            {/* Right: Join now Button */}
            <button className="bg-[#961C23] hover:bg-[#7D141A] text-white text-xs font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all shadow-sm hover:shadow shrink-0">
              Join now
            </button>

          </div>

          {/* Mobile Navigation Dropdown Menu: Image 1 (Light Card Dropdown) */}
          {mobileMenuOpen && mobileMenuStyle === 'card' && (
            <div className="md:hidden mt-3 bg-[#FAF7F2] border border-[#E8DFD0] rounded-[24px] px-6 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-top-2 duration-200">
              <nav className="divide-y divide-[#EAE3D5]/90 text-[#5F5B54]">
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3.5 text-base font-normal hover:text-[#961C23] transition-colors"
                >
                  How it works
                </a>
                <a
                  href="#roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3.5 text-base font-normal hover:text-[#961C23] transition-colors"
                >
                  Roles
                </a>
                <a
                  href="#safety"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3.5 text-base font-normal hover:text-[#961C23] transition-colors"
                >
                  Safety
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3.5 text-base font-normal hover:text-[#961C23] transition-colors"
                >
                  FAQ
                </a>
              </nav>

              {/* Style Switcher Pill */}
              <div className="mt-2 pt-3 border-t border-[#EAE3D5]/60 flex items-center justify-between text-[11px] text-[#8E8880]">
                <span>Menu Style:</span>
                <div className="inline-flex rounded-full bg-[#EFE9DF] p-0.5 border border-[#E5DECF]">
                  <button
                    type="button"
                    onClick={() => setMobileMenuStyle('card')}
                    className="px-2.5 py-0.5 rounded-full font-medium transition-all bg-[#961C23] text-white shadow-xs"
                  >
                    Card (Image 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuStyle('overlay')}
                    className="px-2.5 py-0.5 rounded-full font-medium transition-all text-[#6E6861] hover:text-[#1E1C1A]"
                  >
                    Dark Overlay (Image 2)
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Mobile Navigation Fullscreen Backdrop Overlay: Image 2 */}
        {mobileMenuOpen && mobileMenuStyle === 'overlay' && (
          <div className="md:hidden fixed inset-0 z-50 bg-[#141414]/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between animate-in fade-in duration-200">
            
            {/* Top row: Close button on top-right */}
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-[#961C23] hover:bg-[#7D141A] text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Close navigation overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links on top-left (Serif typography matching Image 2) */}
            <div className="flex-1 flex flex-col justify-start pt-6 space-y-6">
              <nav className="flex flex-col space-y-5">
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-white hover:text-[#F3A83B] text-2xl tracking-wide transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-white hover:text-[#F3A83B] text-2xl tracking-wide transition-colors"
                >
                  Roles
                </a>
                <a
                  href="#safety"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-white hover:text-[#F3A83B] text-2xl tracking-wide transition-colors"
                >
                  Safety
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-white hover:text-[#F3A83B] text-2xl tracking-wide transition-colors"
                >
                  FAQ
                </a>
              </nav>
            </div>

            {/* Bottom Action & Style Switcher */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3.5 rounded-full transition-colors shadow-sm"
              >
                Join now
              </button>

              <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
                <span>Menu Style:</span>
                <div className="inline-flex rounded-full bg-white/10 p-0.5 border border-white/15">
                  <button
                    type="button"
                    onClick={() => setMobileMenuStyle('card')}
                    className="px-2.5 py-0.5 rounded-full font-medium transition-all text-white/70 hover:text-white"
                  >
                    Card (Image 1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileMenuStyle('overlay')}
                    className="px-2.5 py-0.5 rounded-full font-medium transition-all bg-[#961C23] text-white"
                  >
                    Dark Overlay (Image 2)
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. HERO CONTENT */}
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-4 sm:px-10 lg:px-14 py-6 sm:py-8 flex-1 flex flex-col justify-center">
          
          <div className="w-full lg:w-[50%] xl:w-[48%] space-y-5 sm:space-y-7 pr-0 sm:pr-4">
            
            {/* Label: Gifted dating */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
              <span className="text-xs font-semibold text-[#961C23] tracking-wide">
                Gifted dating
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl xl:text-[68px] leading-[1.12] sm:leading-[1.08] tracking-tight text-[#1A1816]">
              THE DATE STARTS <br />
              WITH AN <span className="text-[#961C23] font-serif">OFFER.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#656059] text-xs sm:text-base leading-relaxed max-w-lg font-normal">
              Skip the 'hey'. Propose a real lunch, dinner or event, and let them say yes. Fewer ghosts, more tables for two.
            </p>

            {/* Two Action Cards (Stacked vertically on mobile, side-by-side on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 max-w-xl">
              
              {/* Card 1: Host */}
              <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[175px] sm:min-h-[195px] hover:border-[#F3A83B] transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                    <span className="text-[#F3A83B] text-sm leading-none">👑</span>
                    <span className="font-medium">Host</span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                    You Send The Offers. Pick The Place And The Time.
                  </h3>
                </div>

                <button className="w-full bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs py-3 px-4 rounded-full transition-colors mt-3 sm:mt-4 text-center shadow-sm">
                  Join as a Host
                </button>
              </div>

              {/* Card 2: Guest of Honor */}
              <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[175px] sm:min-h-[195px] hover:border-[#961C23] transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6861]">
                    <span className="text-[#8E8A83] text-sm leading-none">👑</span>
                    <span className="font-medium">Guest of Honor</span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                    You Receive The Offers. Say Yes, Counter Or Pass.
                  </h3>
                </div>

                <button className="w-full bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs py-3 px-4 rounded-full transition-colors mt-3 sm:mt-4 text-center shadow-sm">
                  Join as a Guest of Honor
                </button>
              </div>

            </div>

            {/* Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6D6760] font-normal pt-1">
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

        </div>

        {/* Bottom spacing */}
        <div className="h-4 sm:h-6 w-full" />
      </section>


      {/* =========================================================================
          3. "LESS CHAT. MORE CHEMISTRY." (SECTION 2)
          - Container Card with rounded corners
         ========================================================================= */}
      <section id="how-it-works" className="w-full max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 py-8 sm:py-12 lg:py-16">
        
        {/* Large Rounded Container Card */}
        <div className="bg-[#F4EFE6] border border-[#E8DFD0] rounded-[24px] sm:rounded-[32px] p-5 sm:p-12 lg:p-16 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              How it works
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#1A1816] leading-[1.15] sm:leading-[1.12] tracking-tight mb-3 sm:mb-4">
            Less Chat. <br />
            More Chemistry.
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6860] text-xs sm:text-base leading-relaxed max-w-2xl font-normal mb-6 sm:mb-10">
            A direct, graceful rhythm for meeting someone — with enough information to say yes, no, or perhaps another time.
          </p>

          {/* The 3 Steps with Horizontal Dividers */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            
            {/* Step 01 */}
            <div className="border-b border-[#E3D9C8]/80 pb-3 sm:pb-4">
              <span className="text-xs font-semibold text-[#961C23]">01</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] mt-0.5">
                Set The Scene
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                Choose the venue, the time and the gesture. Every place is public and thoughtfully selected.
              </p>
            </div>

            {/* Step 02 */}
            <div className="border-b border-[#E3D9C8]/80 pb-3 sm:pb-4">
              <span className="text-xs font-semibold text-[#961C23]">02</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] mt-0.5">
                Get An Answer
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                They have 48 hours to accept, decline, or suggest another time. No hanging conversations.
              </p>
            </div>

            {/* Step 03 */}
            <div className="pb-1">
              <span className="text-xs font-semibold text-[#961C23]">03</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A1816] mt-0.5">
                Connect Before You Meet
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6860] mt-1 leading-relaxed">
                Once accepted, private chat opens. A check-in before the date keeps plans on track.
              </p>
            </div>

          </div>

          {/* Nested Invitation Card (An offer for you) */}
          <div className="bg-[#EDE5D6] border border-[#DDD3C2] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
            
            <div className="mb-3 sm:mb-4">
              <span className="text-xs text-[#8E8880] font-normal block">
                An offer for you
              </span>
              <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1816] mt-0.5 sm:mt-1">
                Dinner For Two
              </h4>
            </div>

            {/* Details Table */}
            <div className="divide-y divide-[#D8CDBC] text-xs mb-5 sm:mb-6">
              
              <div className="flex items-center justify-between py-2 sm:py-2.5">
                <span className="text-[#8E8880] font-normal">When</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Thu, Nov 9, 8:00 PM</span>
              </div>

              <div className="flex items-center justify-between py-2 sm:py-2.5">
                <span className="text-[#8E8880] font-normal">Where</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Osteria Verde, Downtown</span>
              </div>

              <div className="flex items-center justify-between py-2 sm:py-2.5">
                <span className="text-[#8E8880] font-normal">The gift</span>
                <span className="font-medium text-[#1A1816] text-xs sm:text-sm">Dinner is on Alex</span>
              </div>

              <div className="flex items-center justify-between py-2 sm:py-2.5">
                <span className="text-[#8E8880] font-normal">Expires in</span>
                <span className="font-bold text-[#961C23] text-xs sm:text-sm">47h 12min</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button className="bg-[#961C23] hover:bg-[#7D141A] text-white font-semibold text-xs px-5 sm:px-6 py-2 rounded-full shadow-sm transition-colors">
                Accept
              </button>

              <button className="bg-white hover:bg-stone-50 border border-[#D5CEC2] text-[#1E1C1A] font-semibold text-xs px-5 sm:px-6 py-2 rounded-full transition-colors">
                Counter
              </button>

              <button className="text-[#7A756D] hover:text-[#1E1C1A] text-xs font-medium px-3 sm:px-4 py-2 transition-colors">
                Pass
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          4. "WHAT MAKES THEDATEBOSS DIFFERENT?" (SECTION 3)
          - Mobile: Single card slider with pagination dots
          - Desktop: 2-column grid side-by-side
         ========================================================================= */}
      <section id="why-us" className="w-full max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 pb-10 sm:pb-20">
        
        {/* Large Rounded Container Card */}
        <div className="bg-[#F4EFE6] border border-[#E8DFD0] rounded-[24px] sm:rounded-[32px] p-5 sm:p-12 lg:p-16 text-center shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              The Thedateboss Advantage
            </span>
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#1A1816] tracking-tight mb-3 sm:mb-4">
            What Makes Thedateboss Different?
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6860] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal mb-8 sm:mb-12 lg:mb-16">
            Thedateboss is like a fast lane for dating. Ditch endless messaging. Get noticed and get to the good stuff — real dates — way quicker. Check out these impressive numbers:
          </p>

          {/* MOBILE CAROUSEL VIEW (< md) with pagination dots matching Figma */}
          <div className="md:hidden flex flex-col items-center text-center space-y-4">
            <div className="w-28 h-28 flex items-center justify-center">
              <img
                src={metrics[activeMetricSlide].image}
                alt={metrics[activeMetricSlide].alt}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              {metrics.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMetricSlide(idx)}
                  aria-label={`Go to metric slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeMetricSlide === idx ? 'bg-[#961C23] w-4' : 'bg-[#D5CEC2] w-2'
                  }`}
                />
              ))}
            </div>

            <h3 className="font-serif font-bold text-4xl text-[#1A1816]">
              {metrics[activeMetricSlide].value}
            </h3>

            <p className="text-[#6E6860] text-xs leading-relaxed max-w-xs">
              {metrics[activeMetricSlide].desc}
            </p>
          </div>

          {/* DESKTOP 2-COLUMN VIEW (md+) */}
          <div className="hidden md:grid grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto items-start">
            {metrics.map((m) => (
              <div key={m.id} className="flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={m.image}
                    alt={m.alt}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="font-serif font-bold text-4xl sm:text-5xl text-[#1A1816]">
                  {m.value}
                </h3>

                <p className="text-[#6E6860] text-xs sm:text-sm leading-relaxed max-w-xs">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </section>


      {/* =========================================================================
          5. "WHAT OUR USERS ARE SAYING" (SECTION 4)
          - Mobile: Single testimonial card with < and > navigation
          - Desktop: 3-column cards grid
         ========================================================================= */}
      <section id="reviews" className="w-full max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 pb-10 sm:pb-20">
        
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              Testimonials
            </span>
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          </div>

          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#1A1816] tracking-tight">
            What Our Users Are Saying
          </h2>
        </div>

        {/* MOBILE SINGLE CARD VIEW (< md) */}
        <div className="md:hidden mb-6">
          <div className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
            <p className="text-[#6E6860] text-xs leading-relaxed mb-5 font-normal">
              {testimonials[activeReviewSlide].quote}
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
              <img
                src={testimonials[activeReviewSlide].avatar}
                alt={testimonials[activeReviewSlide].name}
                className="w-9 h-9 rounded-full object-cover border border-[#961C23]/30"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1A1816]">
                  {testimonials[activeReviewSlide].name}
                </h4>
                <p className="text-[10px] text-[#8E8880]">
                  {testimonials[activeReviewSlide].role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP 3-CARD GRID VIEW (md+) */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]"
            >
              <p className="text-[#6E6860] text-xs sm:text-[13px] leading-relaxed mb-6 font-normal">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#961C23]/30"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#1A1816]">{t.name}</h4>
                  <p className="text-[10px] text-[#8E8880]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrevReview}
            aria-label="Previous review"
            className="w-9 h-9 rounded-full bg-white border border-[#D5CEC2] flex items-center justify-center text-[#6E6860] hover:bg-stone-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextReview}
            aria-label="Next review"
            className="w-9 h-9 rounded-full bg-[#961C23] text-white flex items-center justify-center hover:bg-[#7D141A] transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>


      {/* =========================================================================
          6. "BUILT AGAINST GHOSTING." (SECTION 5)
          - Mobile: Each item is a distinct card with rounded border matching Figma
          - Desktop: Elegant full-width dark section
         ========================================================================= */}
      <section id="safety" className="w-full bg-[#141414] text-white py-12 sm:py-20 lg:py-24">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-10">
          
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
            <span className="text-xs font-semibold text-[#961C23] tracking-wide">
              Safety
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6 sm:mb-10">
            Built Against Ghosting.
          </h2>

          {/* 4 Feature Items (Cards on mobile, rows on desktop) */}
          <div className="space-y-3 sm:space-y-4 md:space-y-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#1C1C1C] md:bg-transparent border border-white/10 md:border-transparent rounded-2xl md:rounded-none p-4 md:p-0 flex items-start gap-3.5 sm:gap-4 transition-colors"
              >
                <div className="w-9 h-9 rounded-full border border-[#961C23] bg-transparent flex items-center justify-center shrink-0 text-[#E63946] mt-0.5">
                  {f.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                    {f.title}
                  </h3>
                  <p className="text-[#8E8A83] text-xs sm:text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>


      {/* =========================================================================
          7. "FREQUENTLY ASKED QUESTIONS" (SECTION 6)
         ========================================================================= */}
      <section id="faq" className="max-w-4xl mx-auto w-full px-4 sm:px-10 py-12 sm:py-20">
        
        {/* Top Label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[1.5px] bg-[#961C23]"></span>
          <span className="text-xs font-semibold text-[#961C23] tracking-wide">
            FAQ
          </span>
        </div>

        {/* Section Headline */}
        <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#1A1816] tracking-tight mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>

        {/* Accordion Questions List */}
        <div className="divide-y divide-[#E3D9C8]/80 border-y border-[#E3D9C8]/80">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                >
                  <span className="font-serif font-bold text-sm sm:text-lg text-[#1A1816] group-hover:text-[#961C23] transition-colors">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-stone-500 group-hover:text-[#961C23] transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-[#6E6860] leading-relaxed pr-6 sm:pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </section>


      {/* =========================================================================
          8. CALL TO ACTION BANNER (SECTION 7)
         ========================================================================= */}
      <section className="max-w-[1360px] mx-auto w-full px-4 sm:px-10 lg:px-14 pb-12 sm:pb-20">
        
        <div className="bg-[#F4EFE6] border border-[#E8DFD0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-14 lg:p-16 text-center shadow-sm">
          
          <div className="flex flex-col items-center max-w-xl mx-auto space-y-4">
            
            {/* Wax Seal Stamp Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(150,28,35,0.35)]">
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

            {/* Headline */}
            <h2 className="font-serif font-extrabold text-xl sm:text-3xl md:text-4xl text-[#1A1816] tracking-tight leading-tight">
              MAKE THE FIRST MOVE <br />
              <span className="text-[#961C23]">WORTH ANSWERING</span>
            </h2>

            {/* Two Action Buttons (Stacked full-width on mobile, side-by-side on sm+) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:pt-3 w-full justify-center">
              <button className="w-full sm:w-auto bg-[#F3A83B] hover:bg-[#DE952B] text-[#1E1C1A] font-bold text-xs px-7 py-3 rounded-full transition-colors shadow-sm">
                Join as a Host
              </button>
              <button className="w-full sm:w-auto bg-[#961C23] hover:bg-[#7D141A] text-white font-bold text-xs px-7 py-3 rounded-full transition-colors shadow-sm">
                Join as a Guest of Honor
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          9. FOOTER (SECTION 8)
         ========================================================================= */}
      <footer className="w-full border-t border-[#ECE3D4] py-6 sm:py-8 bg-[#FAF7F2]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left: Wax Seal + Copyright */}
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#961C23] flex items-center justify-center text-[10px] text-white font-serif font-bold italic shrink-0">
              d
            </div>
            <span className="text-xs text-stone-500 font-medium">
              © 2025 thedateboss • 18+ only
            </span>
          </div>

          {/* Right: Legal Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-xs text-[#5F5B54]">
            <a href="#terms" className="hover:text-[#961C23] transition-colors">Terms & Conditions</a>
            <a href="#safety-tips" className="hover:text-[#961C23] transition-colors">Safety Tips</a>
            <a href="#disclaimer" className="hover:text-[#961C23] transition-colors">Disclaimer</a>
            <a href="#privacy" className="hover:text-[#961C23] transition-colors">Privacy Policy</a>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
