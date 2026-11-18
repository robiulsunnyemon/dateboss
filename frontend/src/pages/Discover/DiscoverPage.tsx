import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Menu,
  X,
  MessageCircle,
  User,
  Compass,
  Calendar,
  Crown,
  Heart,
  Send,
  Sparkles,
  Check,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SearchPreferenceModal, SearchPreferenceFilters } from './SearchPreferenceModal';
import { OfferEventsView } from './OfferEventsView';
import { InviteDetailsView } from './InviteDetailsView';
import { OffersView } from './OffersView';
import { ConfirmedDatesView } from './ConfirmedDatesView';
import { ProfileView } from './ProfileView';
import { MessagesChatView } from './MessagesChatView';

export interface DiscoverProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  reliability: number;
  distanceKm: number;
  bio: string;
  openTo: string[];
  categories: Array<'dinner' | 'lunch' | 'events'>;
  location?: string;
  occupation?: string;
  interests?: string[];
}

const SAMPLE_PROFILES: DiscoverProfile[] = [
  {
    id: '1',
    name: 'Camila',
    age: 29,
    image: '/assets/discover-card-1.jpg',
    reliability: 4.9,
    distanceKm: 3,
    bio: 'Long dinners, warm light, no rush.',
    openTo: ['Dinner', 'Events'],
    categories: ['dinner', 'events'],
    location: 'Downtown, 3 km away',
    occupation: 'Creative Producer',
    interests: ['Fine Dining', 'Art Galleries', 'Wine Tasting', 'Cinema'],
  },
  {
    id: '2',
    name: 'Camila',
    age: 29,
    image: '/assets/discover-card-2.jpg',
    reliability: 4.9,
    distanceKm: 3,
    bio: 'Long dinners, warm light, no rush.',
    openTo: ['Dinner', 'Events'],
    categories: ['dinner', 'lunch', 'events'],
    location: 'West End, 3 km away',
    occupation: 'Architectural Designer',
    interests: ['Jazz Lounges', 'Coffee', 'Architecture', 'Cooking'],
  },
  {
    id: '3',
    name: 'Camila',
    age: 18,
    image: '/assets/discover-card-3.jpg',
    reliability: 4.9,
    distanceKm: 3,
    bio: 'Long dinners, warm light, no rush.',
    openTo: ['Dinner', 'Events'],
    categories: ['dinner', 'events'],
    location: 'Midtown, 3 km away',
    occupation: 'Sound Designer & DJ',
    interests: ['Live Concerts', 'Vinyl Bars', 'Rooftop Lounges', 'Sushi'],
  },
  {
    id: '4',
    name: 'Elena',
    age: 27,
    image: '/assets/discover-card-2.jpg',
    reliability: 4.8,
    distanceKm: 5,
    bio: 'Slow Sunday brunches, vintage bookstores and great wine.',
    openTo: ['Lunch', 'Events'],
    categories: ['lunch', 'events'],
    location: 'Old Town, 5 km away',
    occupation: 'Curator',
    interests: ['Bookstores', 'Museums', 'Botanical Gardens', 'Bistros'],
  },
  {
    id: '5',
    name: 'Maya',
    age: 26,
    image: '/assets/discover-card-1.jpg',
    reliability: 5.0,
    distanceKm: 2,
    bio: 'Looking for thoughtful conversations and memorable evenings.',
    openTo: ['Dinner', 'Lunch'],
    categories: ['dinner', 'lunch'],
    location: 'Harbor District, 2 km away',
    occupation: 'Product Strategist',
    interests: ['Tasting Menus', 'Opera', 'Day Trips', 'Farmers Market'],
  },
  {
    id: '6',
    name: 'Sophia',
    age: 28,
    image: '/assets/discover-card-3.jpg',
    reliability: 4.9,
    distanceKm: 4,
    bio: 'Sunset terrace dining, acoustic sessions, and genuine laughs.',
    openTo: ['Dinner', 'Events'],
    categories: ['dinner', 'events'],
    location: 'Hillside, 4 km away',
    occupation: 'Brand Director',
    interests: ['Cocktail Lounges', 'Modern Art', 'Boutique Hotels', 'Tennis'],
  },
];

interface DiscoverPageProps {
  onBackToLanding?: () => void;
  onOpenProfile?: (profile: DiscoverProfile) => void;
}

export function DiscoverPage({ onBackToLanding }: DiscoverPageProps) {
  // Navigation tabs: 'explore' | 'offers' | 'dates' | 'profile'
  const [activeTab, setActiveTab] = useState<'explore' | 'offers' | 'dates' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#offers') return 'offers';
      if (window.location.hash === '#dates') return 'dates';
      if (window.location.hash === '#profile') return 'profile';
    }
    return 'explore';
  });

  // Filter category: 'dinner' | 'lunch' | 'events' | null
  const [selectedCategory, setSelectedCategory] = useState<'dinner' | 'lunch' | 'events' | null>('dinner');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Side Menu Drawer
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Messages Chat View State
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [initialChatContactName, setInitialChatContactName] = useState<string | undefined>(undefined);

  // Send Offer Modal state
  const [offerModalProfile, setOfferModalProfile] = useState<DiscoverProfile | null>(null);
  const [offerStep, setOfferStep] = useState<'events' | 'details'>('events');
  const [selectedOfferEvents, setSelectedOfferEvents] = useState<string[]>([]);
  const [selectedOfferOuting, setSelectedOfferOuting] = useState('Dinner at a fine restaurant');
  const [offerMessage, setOfferMessage] = useState('');
  const [showOfferSuccessToast, setShowOfferSuccessToast] = useState(false);

  // View Profile Modal state
  const [viewProfileModal, setViewProfileModal] = useState<DiscoverProfile | null>(null);

  // Filter Drawer / Modal & Search Preferences
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [minReliability, setMinReliability] = useState<number>(4.5);
  const [searchPreferences, setSearchPreferences] = useState<Partial<SearchPreferenceFilters>>({});

  // Filtered profiles list
  const filteredProfiles = useMemo(() => {
    return SAMPLE_PROFILES.filter((profile) => {
      // Category filter
      if (selectedCategory && !profile.categories.includes(selectedCategory)) {
        return false;
      }
      // Distance filter
      if (profile.distanceKm > maxDistance) {
        return false;
      }
      // Reliability filter
      if (profile.reliability < minReliability) {
        return false;
      }
      // Search Preference filters (Age, Location, Keywords)
      if (searchPreferences.minAge && profile.age < searchPreferences.minAge) {
        return false;
      }
      if (searchPreferences.maxAge && profile.age > searchPreferences.maxAge) {
        return false;
      }
      if (searchPreferences.location && searchPreferences.location.trim()) {
        const loc = searchPreferences.location.toLowerCase();
        if (profile.location && !profile.location.toLowerCase().includes(loc)) {
          return false;
        }
      }
      if (searchPreferences.keywords && searchPreferences.keywords.trim()) {
        const kw = searchPreferences.keywords.toLowerCase();
        const matchName = profile.name.toLowerCase().includes(kw);
        const matchBio = profile.bio.toLowerCase().includes(kw);
        const matchInterests = profile.interests?.some((i) => i.toLowerCase().includes(kw));
        if (!matchName && !matchBio && !matchInterests) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = profile.name.toLowerCase().includes(query);
        const matchBio = profile.bio.toLowerCase().includes(query);
        const matchOpenTo = profile.openTo.some((item) =>
          item.toLowerCase().includes(query)
        );
        return matchName || matchBio || matchOpenTo;
      }
      return true;
    });
  }, [selectedCategory, maxDistance, minReliability, searchQuery, searchPreferences]);

  const handleApplyPreferences = (filters: SearchPreferenceFilters) => {
    setSearchPreferences(filters);
    if (filters.keywords) {
      setSearchQuery(filters.keywords);
    }
    setIsFilterModalOpen(false);
  };

  const handleResetPreferences = () => {
    setSearchPreferences({});
    setSearchQuery('');
    setSelectedCategory(null);
    setIsFilterModalOpen(false);
  };

  const handleSendOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOfferSuccessToast(true);
    setOfferModalProfile(null);
    setOfferMessage('');
    setTimeout(() => {
      setShowOfferSuccessToast(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen w-full bg-[#EFE7DA] font-sans antialiased text-[#16120F] flex flex-col justify-between selection:bg-[#9F1E19]/15 pb-20 sm:pb-0">
      
      {/* ============================================================ */}
      {/* 1. TOP NAVBAR / HEADER                                      */}
      {/* ============================================================ */}
      <header className={`w-full bg-[#EFE7DA]/95 sticky top-0 z-40 backdrop-blur-md border-b border-[#EADBCA]/60 transition-all ${
        activeTab === 'profile' ? 'hidden sm:block' : ''
      }`}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile: Left Hamburger Button */}
          <div className="flex items-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => setIsSideMenuOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EADBCA] flex items-center justify-center text-[#16120F] hover:bg-[#F5F1E6] active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label="Open side menu"
            >
              <Menu className="w-5 h-5 text-[#16120F]" />
            </button>
          </div>

          {/* Logo (Left on desktop, right/center on mobile) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBackToLanding) onBackToLanding();
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Center Navigation Tabs (Desktop only) */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-[#FAF7F2]/80 border border-[#EADBCA] p-1.5 rounded-full shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-[#9F1E19] text-white shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('offers')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-[#9F1E19] text-white shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
            >
              Offers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dates')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'dates'
                  ? 'bg-[#9F1E19] text-white shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
            >
              Dates
            </button>
          </nav>

          {/* Right Icons: Messages + Profile (Desktop only) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setInitialChatContactName(undefined);
                setIsMessagesOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EADBCA] flex items-center justify-center text-[#16120F] hover:bg-[#F5F1E6] hover:border-[#9F1E19]/30 transition-all shadow-xs cursor-pointer relative"
              aria-label="Messages"
            >
              <MessageCircle className="w-4 h-4 text-[#16120F]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9F1E19]"></span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#9F1E19] text-white'
                  : 'bg-[#FAF7F2] border border-[#EADBCA] text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
              aria-label="My Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA                                        */}
      {/* ============================================================ */}
      <main className={`max-w-[1240px] w-full mx-auto flex-1 ${
        activeTab === 'profile'
          ? 'px-4 sm:px-6 lg:px-8 pt-4 pb-24 sm:py-8'
          : 'px-4 sm:px-6 lg:px-8 py-5 sm:py-8'
      }`}>
        {activeTab === 'offers' ? (
          <OffersView
            onNavigateExplore={() => setActiveTab('explore')}
            onOpenChat={(offer) => {
              setInitialChatContactName(offer.userName);
              setIsMessagesOpen(true);
            }}
          />
        ) : activeTab === 'dates' ? (
          <ConfirmedDatesView
            onOpenChat={(item) => {
              setInitialChatContactName(item.userName);
              setIsMessagesOpen(true);
            }}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView />
        ) : (
          <>
            {/* Search Bar + Filter Button (Pill Container) */}
            <div className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full p-1.5 sm:p-2 flex items-center shadow-xs transition-shadow focus-within:shadow-md focus-within:border-[#9F1E19]/40">
          <div className="pl-3 sm:pl-4 pr-2 text-[#6E6A63]">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E6A63]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#16120F] placeholder-[#6E6A63] focus:outline-none focus:ring-0 font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#6E6A63] hover:text-[#16120F] text-xs font-semibold mr-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#F5F1E6] hover:bg-[#EAE3D6] text-[#16120F] text-xs font-medium border border-[#E0D7C6] transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#16120F]" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Category Filter Pills (Dinner, Lunch, Events) */}
        <div className="flex items-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'dinner' ? null : 'dinner')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              selectedCategory === 'dinner'
                ? 'bg-[#16120F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#16120F] border border-[#EADBCA] hover:border-[#16120F]/30'
            }`}
          >
            Dinner
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'lunch' ? null : 'lunch')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              selectedCategory === 'lunch'
                ? 'bg-[#16120F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#16120F] border border-[#EADBCA] hover:border-[#16120F]/30'
            }`}
          >
            Lunch
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === 'events' ? null : 'events')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              selectedCategory === 'events'
                ? 'bg-[#16120F] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#16120F] border border-[#EADBCA] hover:border-[#16120F]/30'
            }`}
          >
            Events
          </button>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-[#9F1E19] hover:underline font-semibold ml-1 cursor-pointer"
            >
              Show all
            </button>
          )}
        </div>

        {/* ============================================================ */}
        {/* CARDS FEED / GRID                                           */}
        {/* ============================================================ */}
        <section className="mt-6 sm:mt-8">
          {filteredProfiles.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-10 text-center max-w-[480px] mx-auto my-12">
              <Compass className="w-10 h-10 text-[#9F1E19]/60 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#16120F]">
                No profiles match your filter
              </h3>
              <p className="text-xs text-[#6E6A63] mt-1.5 leading-relaxed">
                Try clearing your search query or selecting another category to see more guests of honor.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setMaxDistance(50);
                }}
                className="mt-4 bg-[#9F1E19] text-white text-xs px-5 py-2 rounded-full font-medium hover:bg-[#851713]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProfiles.map((profile) => (
                <article
                  key={profile.id}
                  className="bg-[#FAF7F2] sm:bg-[#F5F1E6] border border-[#EADBCA] rounded-[24px] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8DFD0]">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Name, Age + Crown Icon */}
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif font-bold text-lg sm:text-xl text-[#16120F] tracking-tight">
                          {profile.name}, {profile.age}
                        </h2>
                        <span
                          title="Verified Guest of Honor"
                          className="text-[#B38E46] text-base"
                        >
                          👑
                        </span>
                      </div>

                      {/* Reliability Score + Distance */}
                      <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5 font-normal">
                        <span>Reliability {profile.reliability.toFixed(1)}</span>
                        <span>·</span>
                        <span>{profile.distanceKm} km away</span>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs sm:text-sm text-[#16120F] mt-2.5 font-normal leading-relaxed line-clamp-2">
                        {profile.bio}
                      </p>

                      {/* Outings Open to */}
                      <p className="text-[11px] sm:text-xs text-[#6E6A63] mt-2 font-medium">
                        Open to {profile.openTo.join(' · ')}
                      </p>
                    </div>

                    {/* Action Buttons: View Profile (outlined) & Send Offer (red solid) */}
                    <div className="mt-5 pt-1 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setViewProfileModal(profile)}
                        className="flex-1 py-2.5 px-3 rounded-full border border-[#DED7C8] bg-[#FAF7F2] hover:bg-[#EFE7DA] text-[#16120F] font-semibold text-xs text-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
                      >
                        View profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOfferModalProfile(profile);
                          setOfferStep('events');
                        }}
                        className="flex-1 py-2.5 px-3 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-xs text-center shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        Send offer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        </>
      )}

      </main>

      {/* ============================================================ */}
      {/* 3. DESKTOP FOOTER                                           */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-[#EADBCA] mt-12 sm:mt-20 py-8 bg-[#EFE7DA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6E6A63]">
          
          {/* Left: Copyright */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/seal.png"
              alt="Seal"
              className="w-4 h-4 object-contain opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>© 2025 thedateboss - 18+ only</span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-5 sm:gap-6 font-medium">
            <a href="#how-it-works" className="hover:text-[#16120F] transition-colors">
              How it works
            </a>
            <a href="#roles" className="hover:text-[#16120F] transition-colors">
              Roles
            </a>
            <a href="#safety" className="hover:text-[#16120F] transition-colors">
              Safety
            </a>
            <a href="#faq" className="hover:text-[#16120F] transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-5 sm:gap-6">
            <a href="#terms" className="hover:text-[#16120F] transition-colors">
              Terms & Conditions
            </a>
            <a href="#disclaimer" className="hover:text-[#16120F] transition-colors">
              Disclaimer
            </a>
            <a href="#privacy" className="hover:text-[#16120F] transition-colors">
              Privacy Policy
            </a>
          </div>

        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. MOBILE BOTTOM NAVIGATION BAR                              */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EADBCA] py-2 px-3 flex justify-around items-center shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'explore' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide">Explore</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'offers' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Send className="w-5 h-5 rotate-45" />
          <span className="text-[10px] font-medium tracking-wide">Offers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dates')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dates' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Dates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </button>
      </nav>

      {/* ============================================================ */}
      {/* 5. SIDE MENU (MOBILE DRAWER MATCHING FIGMA)                 */}
      {/* ============================================================ */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSideMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <aside className="relative z-50 w-[290px] max-w-[85vw] h-full bg-[#16120F] text-[#F5F1E6] p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250">
            <div>
              {/* Header with Dark Red Square Close Button on top right */}
              <div className="flex items-center justify-between pb-8">
                <img
                  src="/assets/logo.png"
                  alt="thedateboss"
                  className="h-7 w-auto object-contain brightness-200"
                />
                
                <button
                  type="button"
                  onClick={() => setIsSideMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links list */}
              <nav className="flex flex-col space-y-5 pt-3">
                <a
                  href="#messages"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                    setInitialChatContactName(undefined);
                    setIsMessagesOpen(true);
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors flex items-center justify-between group"
                >
                  <span>Message</span>
                  <span className="text-xs bg-[#9F1E19] text-white px-2 py-0.5 rounded-full font-semibold">1</span>
                </a>

                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                    if (onBackToLanding) onBackToLanding();
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors"
                >
                  How It Works
                </a>

                <a
                  href="#roles"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                    if (onBackToLanding) onBackToLanding();
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors"
                >
                  Roles
                </a>

                <a
                  href="#safety"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors"
                >
                  Safety
                </a>

                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors"
                >
                  FAQ
                </a>
              </nav>
            </div>

            {/* Bottom Note */}
            <div className="pt-6 border-t border-white/10 text-xs text-[#A9A49C]">
              <p className="font-serif italic text-white/90 mb-1">
                The date starts with an offer.
              </p>
              <p>© 2025 thedateboss</p>
            </div>
          </aside>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. SEND OFFER MODAL (STEP 1: EVENTS, STEP 2: DETAILS)        */}
      {/* ============================================================ */}
      {offerModalProfile && offerStep === 'events' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <OfferEventsView
            targetProfileName={offerModalProfile.name}
            onBack={() => setOfferModalProfile(null)}
            onContinue={(events) => {
              setSelectedOfferEvents(events);
              setOfferStep('details');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        </div>
      )}

      {offerModalProfile && offerStep === 'details' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <InviteDetailsView
            targetProfileName={offerModalProfile.name}
            selectedEvents={selectedOfferEvents}
            onBack={() => {
              setOfferStep('events');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onSendOffer={(_offerData) => {
              setShowOfferSuccessToast(true);
              setOfferModalProfile(null);
              setOfferStep('events');
              setTimeout(() => {
                setShowOfferSuccessToast(false);
              }, 3500);
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. VIEW PROFILE MODAL                                        */}
      {/* ============================================================ */}
      {viewProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[28px] max-w-[540px] w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setViewProfileModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Cover Image */}
            <div className="h-60 w-full relative bg-[#E8DFD0] shrink-0">
              <img
                src={viewProfileModal.image}
                alt={viewProfileModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-2xl">
                    {viewProfileModal.name}, {viewProfileModal.age}
                  </h3>
                  <span className="text-amber-400 text-lg">👑</span>
                </div>
                <p className="text-xs text-white/80">
                  {viewProfileModal.occupation} · {viewProfileModal.location}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between bg-[#F5F1E6] rounded-2xl p-3 border border-[#EADBCA]">
                <div className="text-center flex-1 border-r border-[#EADBCA]">
                  <span className="block text-xs text-[#6E6A63]">Reliability</span>
                  <span className="font-serif font-bold text-base text-[#16120F]">
                    {viewProfileModal.reliability.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="text-center flex-1 border-r border-[#EADBCA]">
                  <span className="block text-xs text-[#6E6A63]">Distance</span>
                  <span className="font-serif font-bold text-base text-[#16120F]">
                    {viewProfileModal.distanceKm} km
                  </span>
                </div>
                <div className="text-center flex-1">
                  <span className="block text-xs text-[#6E6A63]">Status</span>
                  <span className="font-semibold text-xs text-emerald-700">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-1">
                  About
                </h4>
                <p className="text-xs sm:text-sm text-[#524D46] leading-relaxed">
                  {viewProfileModal.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-2">
                  Open to Outings
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewProfileModal.openTo.map((outing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#FAF0F1] border border-[#F3C5C7] text-[#9F1E19] text-xs font-medium"
                    >
                      {outing}
                    </span>
                  ))}
                </div>
              </div>

              {viewProfileModal.interests && (
                <div>
                  <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-2">
                    Interests & Passions
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewProfileModal.interests.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-[#F5F1E6] border border-[#EADBCA] text-[#6E6A63] text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const prof = viewProfileModal;
                    setViewProfileModal(null);
                    setOfferModalProfile(prof);
                    setOfferStep('events');
                  }}
                  className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 rotate-45" />
                  <span>Send an Offer to {viewProfileModal.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. SEARCH PREFERENCE MODAL (FIGMA / ATTACHMENT DESIGN)        */}
      {/* ============================================================ */}
      <SearchPreferenceModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyPreferences}
        onReset={handleResetPreferences}
        initialFilters={searchPreferences}
      />

      {/* ============================================================ */}
      {/* 8. MESSAGES / CHAT VIEW (FIGMA SCREENSHOT DESIGN)            */}
      {/* ============================================================ */}
      {isMessagesOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <MessagesChatView
            initialContactName={initialChatContactName}
            onClose={() => {
              setIsMessagesOpen(false);
              setInitialChatContactName(undefined);
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. SUCCESS TOAST NOTIFICATION                                */}
      {/* ============================================================ */}
      {showOfferSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16120F] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Offer sent successfully!</p>
            <p className="text-[11px] text-white/70">You will be notified once they respond.</p>
          </div>
        </div>
      )}

    </div>
  );
}
export default DiscoverPage;
