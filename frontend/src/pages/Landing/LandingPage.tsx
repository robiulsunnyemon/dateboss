import React, { useState, useEffect } from 'react';
import {
  Check,
  Plus,
  Minus,
  MessageSquare,
  Clock,
  CalendarCheck,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { api } from '../../services/api';

interface LandingPageProps {
  onJoinNow: () => void;
  onJoinAsHost: () => void;
  onJoinAsGuest: () => void;
  onSignIn?: () => void;
}

export function LandingPage({
  onJoinNow,
  onJoinAsHost,
  onJoinAsGuest,
  onSignIn,
}: LandingPageProps) {
  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Carousel state for mobile metrics ($99 and 25%)
  const [activeMetricSlide, setActiveMetricSlide] = useState(0);

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

  const TESTIMONIAL_VIDEOS: (string | undefined)[] = [
    '/assets/testimonial-1.mp4',
    '/assets/testimonial-2.mp4',
  ];

  const [testimonials, setTestimonials] = useState<
    Array<{ id: number | string; quote: string; name: string; role: string; avatar: string; video?: string }>
  >([
    {
      id: 1,
      video: '/assets/testimonial-1.mp4',
      quote:
        '"I had the best experience with a date! We tried paddle boarding! It was so windy that we got blown backwards and we laughed the whole time as I struggled! We saw seals in the harbor and it was something I always wanted to do! It was a fun, exciting, great first date, and we are still seeing each other!"',
      name: 'Sarah Jenkins',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      video: '/assets/testimonial-2.mp4',
      quote:
        '"An exceptional, easy-to-navigate platform that makes meeting generous and established local men completely stress-free. Backed by top-tier safety and verified profiles, I was reviewing tailored offers and arranging memorable dates within days. It delivers an effortless, premium dating experience from the very first step."',
      name: 'Jessica Taylor',
      role: 'Member',
      avatar: '/assets/testimonial-2-avatar.jpg',
    },
    {
      id: 3,
      quote:
        '"The standout experience on thedateboss has been the prompt, dedicated support team. Whenever I had an inquiry, it was handled swiftly with genuine care and clear guidance. The platform truly honors its promise of fostering meaningful, high-caliber connections between like-minded individuals."',
      name: 'Aissatou Balde',
      role: 'Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  ]);

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

  const [faqs, setFaqs] = useState([
    {
      question: '1. Do Guests Of Honor Ever Pay?',
      answer:
        'Never. No plan, no card, no catch. Hosts carry a $9.99 monthly membership that keeps the community serious.',
    },
    {
      question: '2. Is This An Escort Or Paid-Companionship Service?',
      answer:
        'No, absolutely not. The Date Boss is strictly a premium dating platform designed for genuine romantic connections and intentional dates. Compensated dating or escorting is strictly prohibited and immediately banned.',
    },
    {
      question: "3. What Happens If Someone Doesn't Show?",
      answer:
        'We enforce a strict Anti-Ghosting protocol. Both members confirm 24 hours prior. Unexcused no-shows trigger reliability penalties and temporary or permanent account suspension.',
    },
    {
      question: '4. Can I Switch Between Host And Guest Of Honor?',
      answer:
        'Yes! Every member has full versatility. You can switch between sending date invitations as a Host and receiving curated date proposals as a Guest of Honor whenever you like.',
    },
  ]);

  useEffect(() => {
    let mounted = true;
    async function loadContent() {
      try {
        const [tRes, fRes] = await Promise.all([
          api.content.getTestimonials().catch(() => null),
          api.content.getFaqs().catch(() => null),
        ]);
        if (!mounted) return;
        if (tRes?.success && Array.isArray(tRes.data) && tRes.data.length > 0) {
          setTestimonials(
            tRes.data.map((item: any, idx: number) => ({
              id: item.id || idx + 1,
              quote: item.quote || item.content || '',
              name: item.name || item.author || 'Member',
              role: item.role || 'Member',
              avatar: item.avatar || '/assets/avatar-1.png',
              video: item.video || TESTIMONIAL_VIDEOS[idx],
            }))
          );
        }
        if (fRes?.success && Array.isArray(fRes.data) && fRes.data.length > 0) {
          setFaqs(
            fRes.data.map((item: any, idx: number) => ({
              question: item.question || `${idx + 1}. Question`,
              answer: item.answer || '',
            }))
          );
        }
      } catch {
        // Keep fallback copy if API unavailable
      }
    }
    loadContent();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#EFE7DA] text-[#16120F] font-sans antialiased selection:bg-[#9F1E19] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          HERO SECTION WRAPPER
          - Envelope-style luxury stationery aesthetic
          - Desktop: Arched restaurant couple photo + luxury cream parchment background
          - Mobile: Romantic ambient background overlay with warm vignette
         ========================================================================= */}
      <section className="relative w-full bg-[#F8F4EC] overflow-hidden min-h-0 lg:h-[730px] xl:h-[770px] flex flex-col justify-between border-b border-[#E5DDD0]/80">
        
        {/* Luxury Stationery Open Envelope (Mobile Only - authentic client reference; hidden on desktop for clean header) */}
        <div className="block md:hidden absolute -top-3 -left-4 z-10 pointer-events-none select-none">
          <img
            src="/assets/envelope-luxury.png"
            alt="Luxury stationery envelope"
            className="w-36 sm:w-44 h-auto select-none pointer-events-none"
          />
        </div>

        {/* Mobile Ambient Background: Restores the romantic restaurant image for mobile visitors */}
        <div className="absolute inset-0 block lg:hidden pointer-events-none z-0 overflow-hidden">
          <img
            src="/assets/hero-couple.jpg"
            alt="Romantic couple dining background"
            className="w-full h-full object-cover object-[center_top] opacity-25 filter saturate-110 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8F4EC]/40 via-[#F8F4EC]/85 to-[#F8F4EC] pointer-events-none" />
        </div>

        {/* SVG ClipPath Definition: smooth organic sweeping arch matching Figma */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroUserDrawnArc" clipPathUnits="objectBoundingBox">
              <path d="M 0.40, 0 
                       C 0.18, 0.14, 0.02, 0.42, 0.02, 0.76 
                       C 0.02, 0.88, 0.04, 0.95, 0.06, 1 
                       L 1, 1 
                       L 1, 0 
                       Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Right Photo: Visible strictly on desktop */}
        <div className="absolute right-0 top-0 bottom-0 w-[48%] xl:w-[49%] h-full z-10 pointer-events-none hidden lg:block overflow-hidden">
          <div
            className="w-full h-full relative"
            style={{ clipPath: 'url(#heroUserDrawnArc)' }}
          >
            <img
              src="/assets/hero-couple.jpg"
              alt="Romantic couple dining with wine glasses at restaurant table"
              className="w-full h-full object-cover object-[96%_center] pointer-events-auto"
            />
            {/* Subtle warm lighting vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/15 pointer-events-none" />
          </div>
        </div>

        {/* 1. HEADER / NAVIGATION BAR */}
        <header className="w-full relative z-30 pt-4 sm:pt-6 px-4 sm:px-10 lg:px-14">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            
            {/* Mobile Hamburger Menu Button (visible on mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 -ml-1 text-[#16120F] hover:text-[#9F1E19] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Official Logo: thedateboss (Hidden on mobile phones, visible on tablet & desktop) */}
            <a href="#" className="hidden sm:flex items-center shrink-0">
              <img
                src="/assets/logo.png"
                alt="thedateboss"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </a>

            {/* Center Desktop: Nav Capsule on clean cream background */}
            <nav className="bg-[#EFE9DF]/85 backdrop-blur-md border border-[#E5DECF] rounded-full px-7 py-2.5 hidden md:flex items-center gap-7 text-xs font-medium text-[#5F5B54] shadow-sm">
              <a href="#how-it-works" className="hover:text-[#9F1E19] transition-colors">How it works</a>
              <a href="#roles" className="hover:text-[#9F1E19] transition-colors">Roles</a>
              <a href="#safety" className="hover:text-[#9F1E19] transition-colors">Safety</a>
              <a href="#faq" className="hover:text-[#9F1E19] transition-colors">FAQ</a>
            </nav>

            {/* Right: Sign in + Join now Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {onSignIn && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="bg-[#FAF7F2]/90 hover:bg-white text-[#16120F] border border-[#E5DECF] text-xs font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  Sign in
                </button>
              )}
              <button
                type="button"
                onClick={onJoinNow}
                className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
              >
                Join now
              </button>
            </div>

          </div>
        </header>

        {/* Mobile Navigation Fullscreen Backdrop Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-[#16120F]/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-start animate-in fade-in duration-200">
            
            {/* Top row: Red square close button on top-right */}
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-lg"
                aria-label="Close navigation overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links on top-left (Serif typography matching Figma) */}
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

          </div>
        )}

        {/* 2. HERO CONTENT */}
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-4 sm:px-10 lg:px-14 py-6 sm:py-8 flex-1 flex flex-col justify-center">
          
          <div className="w-full lg:w-[50%] xl:w-[48%] space-y-5 sm:space-y-7 pr-0 sm:pr-4">
            
            {/* Main Headline */}
            <div>
              <h1 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl xl:text-[68px] leading-[1.12] sm:leading-[1.08] tracking-tight text-[#16120F]">
                Skip the Small Talk. <br />
                <span className="text-[#9F1E19] font-serif">Meet Someone.</span>
              </h1>
              <p className="font-serif italic text-base sm:text-lg text-[#6E6458] font-medium mt-1.5">
                The date starts with an invitation.
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-[#656059] text-xs sm:text-base leading-relaxed max-w-lg font-normal">
              Skip the &quot;hey.&quot; Propose a real lunch, dinner, or event, and let them say yes. Less ghosting, more dating.
            </p>

            {/* Question Prompt above cards (matching client reference) */}
            <div className="pt-1 sm:pt-2">
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7A746B]">
                How would you like to join?
              </p>
            </div>

            {/* Two Action Cards */}
            <div className="relative pt-1 max-w-xl">
              <div id="roles" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Card 1: Host */}
                <div className="bg-[#FFFDF9] border border-[#E5DDD0] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,25,10,0.04)] flex flex-col justify-between min-h-[175px] sm:min-h-[195px] hover:border-[#D4A751] transition-all">
                  <div className="space-y-2">
                    <div className="space-y-1.5">
                      <div>
                        <svg
                          viewBox="0 0 20 16"
                          className="w-5 h-4 block"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 15H18L19.5 4L14 9.5L10 1.5L6 9.5L0.5 4L2 15Z"
                            fill="url(#goldCrownGrad)"
                            stroke="#7A5615"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient id="goldCrownGrad" x1="10" y1="1.5" x2="10" y2="15" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#E8C570" />
                              <stop offset="50%" stopColor="#C59341" />
                              <stop offset="100%" stopColor="#9B6F1C" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="text-xs text-[#6E6861] font-medium">
                        Host (Men)
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                      You Extend The Invitations. Pick The Place And The Time.
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={onJoinAsHost}
                    className="w-full btn-bar-gold font-bold text-xs py-3 px-4 rounded-full mt-3 sm:mt-4 text-center cursor-pointer tracking-wide"
                  >
                    Join as a Host (Men)
                  </button>
                </div>

                {/* Card 2: Guest of Honor */}
                <div className="relative bg-[#FFFDF9] border border-[#E5DDD0] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 shadow-[0_4px_18px_rgba(40,25,10,0.04)] flex flex-col justify-between min-h-[175px] sm:min-h-[195px] hover:border-[#9F1E19] transition-all">
                  <div className="space-y-2">
                    <div className="space-y-1.5">
                      <div>
                        <svg
                          viewBox="0 0 20 16"
                          className="w-5 h-4 block"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 15H18L19.5 4L14 9.5L10 1.5L6 9.5L0.5 4L2 15Z"
                            fill="url(#silverCrownGrad)"
                            stroke="#6E6861"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient id="silverCrownGrad" x1="10" y1="1.5" x2="10" y2="15" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#FAF7F2" />
                              <stop offset="50%" stopColor="#D9D2C7" />
                              <stop offset="100%" stopColor="#B3ACA0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="text-xs text-[#6E6861] font-medium">
                        Guest of Honor (Women)
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug">
                      You Receive The Invitations. Say Yes, Counter Or Pass.
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={onJoinAsGuest}
                    className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs py-3 px-4 rounded-full transition-all mt-3 sm:mt-4 text-center shadow-[0_4px_14px_rgba(159,30,25,0.25)] hover:shadow-[0_6px_18px_rgba(159,30,25,0.35)] cursor-pointer tracking-wide"
                  >
                    Join as a Guest of Honor (Women)
                  </button>
                </div>

              </div>
            </div>

            {/* Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#3D3832] font-medium pt-3 sm:pt-4">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#851713]" /> ID-verified members
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#851713]" /> Public venues only
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#851713]" /> Invitations expire in 48h
              </span>
            </div>

          </div>

        </div>

        {/* Bottom spacing */}
        <div className="h-6 sm:h-10 w-full" />
      </section>


      {/* =========================================================================
          3. "LESS CHAT. MORE CHEMISTRY." (SECTION 2)
          - Container Card with rounded corners
         ========================================================================= */}
      <section id="how-it-works" className="w-full max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 py-8 sm:py-12 lg:py-16">
        
        {/* Large Rounded Container Card */}
        <div className="bg-[#FBF8F1] border border-[#E5DDD0] rounded-[24px] sm:rounded-[32px] p-5 sm:p-12 lg:p-16 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
            <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
              How it works
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#16120F] leading-[1.15] sm:leading-[1.12] tracking-tight mb-3 sm:mb-4">
            Less Chat. <br />
            More Chemistry.
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6A63] text-xs sm:text-base leading-relaxed max-w-2xl font-normal mb-6 sm:mb-10">
            A direct, graceful rhythm for meeting someone — with enough information to say yes, no, or perhaps another time.
          </p>

          {/* The 3 Steps with Horizontal Dividers */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            
            {/* Step 01 */}
            <div className="border-b border-[#E3D9C8]/80 pb-3 sm:pb-4">
              <span className="text-xs font-semibold text-[#9F1E19]">01</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mt-0.5">
                Make Your Move
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A63] mt-1 leading-relaxed">
                Choose a restaurant, event, date, and offer. Make it personal, and keep the plans somewhere public.
              </p>
            </div>

            {/* Step 02 */}
            <div className="border-b border-[#E3D9C8]/80 pb-3 sm:pb-4">
              <span className="text-xs font-semibold text-[#9F1E19]">02</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mt-0.5">
                Get a Response
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A63] mt-1 leading-relaxed">
                Accept, decline, or suggest a different plan. You'll have 48 hours to respond to an invitation.
              </p>
            </div>

            {/* Step 03 */}
            <div className="pb-1">
              <span className="text-xs font-semibold text-[#9F1E19]">03</span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F] mt-0.5">
                Take It Offline
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6A63] mt-1 leading-relaxed">
                Once the invitation is accepted, private messaging opens so you can finalize the details before meeting.
              </p>
            </div>

          </div>

          {/* Nested Invitation Card (A Date Invitation) */}
          <div 
            className="relative overflow-hidden bg-[#EDE5D6] border border-[#DDD3C2] rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm transition-all"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(248, 244, 237, 0.94) 0%, rgba(243, 237, 226, 0.90) 50%, rgba(238, 230, 216, 0.86) 100%), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'), url('/assets/hero-couple.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              <div className="flex-1">
                <div className="mb-3 sm:mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9F1E19] block">
                    A DATE INVITATION
                  </span>
                  <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#16120F] mt-0.5 sm:mt-1">
                    Dinner for Two
                  </h4>
                  <p className="text-xs text-[#6E6A63] mt-1 font-normal">
                    A little planning. A real opportunity to connect.
                  </p>
                </div>

                {/* Details Table */}
                <div className="divide-y divide-[#D8CDBC] text-xs mb-5 sm:mb-6">
                  
                  <div className="flex items-center justify-between py-2 sm:py-2.5">
                    <span className="text-[#6E6A63] font-normal">When</span>
                    <span className="font-medium text-[#16120F] text-xs sm:text-sm">Thursday, 8:00 PM</span>
                  </div>

                  <div className="flex items-center justify-between py-2 sm:py-2.5">
                    <span className="text-[#6E6A63] font-normal">Where</span>
                    <span className="font-medium text-[#16120F] text-xs sm:text-sm">Osteria Verde</span>
                  </div>

                  <div className="flex items-center justify-between py-2 sm:py-2.5">
                    <span className="text-[#6E6A63] font-normal">What's Included</span>
                    <span className="font-medium text-[#16120F] text-xs sm:text-sm">Dinner is covered.</span>
                  </div>

                  <div className="flex items-center justify-between py-2 sm:py-2.5">
                    <span className="text-[#6E6A63] font-normal">Expires in</span>
                    <span className="font-bold text-[#9F1E19] text-xs sm:text-sm">47h 12min</span>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button className="bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-xs px-5 sm:px-6 py-2 rounded-full shadow-sm transition-colors cursor-pointer">
                    Accept
                  </button>

                  <button className="bg-white hover:bg-stone-50 border border-[#D5CEC2] text-[#16120F] font-semibold text-xs px-5 sm:px-6 py-2 rounded-full transition-colors cursor-pointer">
                    Suggest Change
                  </button>

                  <button className="text-[#7A756D] hover:text-[#16120F] text-xs font-medium px-3 sm:px-4 py-2 transition-colors cursor-pointer">
                    Pass
                  </button>
                </div>
              </div>

              {/* Lively Restaurant Venue Photo Card */}
              <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0">
                <div className="relative rounded-xl overflow-hidden border border-[#D5CEC2] shadow-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80"
                    alt="Osteria Verde candlelit dinner setting"
                    className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FCD34D] block">
                      Venue Experience
                    </span>
                    <p className="font-serif font-bold text-sm text-white">Osteria Verde</p>
                    <p className="text-[11px] text-white/80">Candlelit dinner & romantic table for two</p>
                  </div>
                </div>
              </div>

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
        <div className="bg-[#FBF8F1] border border-[#E5DDD0] rounded-[24px] sm:rounded-[32px] p-5 sm:p-12 lg:p-16 text-center shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          
          {/* Top Label */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
            <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
              The Thedateboss Advantage
            </span>
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#16120F] tracking-tight mb-3 sm:mb-4">
            What Makes Thedateboss Different?
          </h2>

          {/* Subtitle */}
          <p className="text-[#6E6A63] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal mb-8 sm:mb-12 lg:mb-16">
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
                    activeMetricSlide === idx ? 'bg-[#9F1E19] w-4' : 'bg-[#D5CEC2] w-2'
                  }`}
                />
              ))}
            </div>

            <h3 className="font-serif font-bold text-4xl text-[#16120F]">
              {metrics[activeMetricSlide].value}
            </h3>

            <p className="text-[#6E6A63] text-xs leading-relaxed max-w-xs">
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

                <h3 className="font-serif font-bold text-4xl sm:text-5xl text-[#16120F]">
                  {m.value}
                </h3>

                <p className="text-[#6E6A63] text-xs sm:text-sm leading-relaxed max-w-xs">
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
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
            <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
              Testimonials
            </span>
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          </div>

          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#16120F] tracking-tight">
            What Our Users Are Saying
          </h2>
        </div>

        {/* VIDEO TESTIMONIALS GRID (1 column on mobile, 2 columns on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {testimonials
            .filter((t) => Boolean(t.video))
            .map((t) => (
              <div
                key={t.id}
                className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <video
                  src={t.video}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full aspect-[9/16] max-h-[420px] rounded-xl bg-black object-cover mb-5 sm:mb-6"
                />

                <div className="flex items-center gap-3 pt-3 border-t border-[#EAE3D5]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#9F1E19]/30"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#16120F]">{t.name}</h4>
                    <p className="text-[10px] text-[#6E6A63]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </section>


      {/* =========================================================================
          6. "BUILT AGAINST GHOSTING." (SECTION 5)
          - Mobile: Each item is a distinct card with rounded border matching Figma
          - Desktop: Elegant full-width dark section
         ========================================================================= */}
      <section id="safety" className="w-full bg-[#16120F] text-white py-12 sm:py-20 lg:py-24">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-10">
          
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
            <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
              Safety
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6 sm:mb-10">
            Built Against Ghosting.
          </h2>

          {/* 4 Feature Items (Cards on mobile, rows with subtle dividers on desktop) */}
          <div className="space-y-3 sm:space-y-4 md:space-y-0 md:divide-y md:divide-white/10">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#1C1C1C] md:bg-transparent border border-white/10 md:border-transparent rounded-2xl md:rounded-none p-4 md:py-7 md:px-0 first:md:pt-0 last:md:pb-0 flex items-start gap-3.5 sm:gap-4 transition-colors"
              >
                <div className="w-9 h-9 rounded-full border border-[#9F1E19] bg-transparent flex items-center justify-center shrink-0 text-[#E63946] mt-0.5">
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
          <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            FAQ
          </span>
        </div>

        {/* Section Headline */}
        <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#16120F] tracking-tight mb-6 sm:mb-8">
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
                  <span className="font-serif font-bold text-sm sm:text-lg text-[#16120F] group-hover:text-[#9F1E19] transition-colors">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-stone-500 group-hover:text-[#9F1E19] transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-[#6E6A63] leading-relaxed pr-6 sm:pr-8">
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
        
        <div className="bg-[#FBF8F1] border border-[#E5DDD0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-14 lg:p-16 text-center shadow-sm">
          
          <div className="flex flex-col items-center max-w-xl mx-auto space-y-4">
            
            {/* Official Wax Seal Stamp Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <img
                src="/assets/seal.png"
                alt="thedateboss wax seal"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(150,28,35,0.35)]"
              />
            </div>

            {/* Headline */}
            <h2 className="font-serif font-extrabold text-xl sm:text-3xl md:text-4xl text-[#16120F] tracking-tight leading-tight">
              MAKE THE FIRST MOVE <br />
              <span className="text-[#9F1E19]">WORTH ANSWERING</span>
            </h2>

            {/* Two Action Buttons (Stacked full-width on mobile, side-by-side on sm+) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:pt-3 w-full justify-center">
              <button
                type="button"
                onClick={onJoinAsHost}
                className="w-full sm:w-auto btn-bar-gold font-bold text-xs px-8 py-3 rounded-full shadow-sm tracking-wide cursor-pointer"
              >
                Join as a Host
              </button>
              <button
                type="button"
                onClick={onJoinAsGuest}
                className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs px-8 py-3 rounded-full transition-all shadow-[0_4px_14px_rgba(159,30,25,0.25)] hover:shadow-[0_6px_18px_rgba(159,30,25,0.35)] tracking-wide cursor-pointer"
              >
                Join as a Guest of Honor
              </button>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================================
          9. FOOTER (SECTION 8)
         ========================================================================= */}
      <footer className="w-full border-t border-[#E0D7C8] py-6 sm:py-8 bg-[#EFE7DA]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left: Official Wax Seal + Copyright */}
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/seal.png"
              alt="thedateboss seal"
              className="w-6 h-6 object-contain shrink-0"
            />
            <span className="text-xs text-stone-500 font-medium">
              © 2025 thedateboss • 18+ only
            </span>
          </div>

          {/* Right: Legal Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-xs text-[#5F5B54]">
            <a href="#terms" className="hover:text-[#9F1E19] transition-colors">Terms & Conditions</a>
            <a href="#safety-tips" className="hover:text-[#9F1E19] transition-colors">Safety Tips</a>
            <a href="#disclaimer" className="hover:text-[#9F1E19] transition-colors">Disclaimer</a>
            <a href="#privacy" className="hover:text-[#9F1E19] transition-colors">Privacy Policy</a>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
