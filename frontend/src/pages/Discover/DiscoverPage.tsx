import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Menu,
  X,
  MessageCircle,
  User,
  Compass,
  Calendar,
  Send,
  Sparkles,
  Check,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SearchPreferenceModal, SearchPreferenceFilters } from './SearchPreferenceModal';
import { OfferEventsView } from './OfferEventsView';
import { InviteDetailsView } from './InviteDetailsView';
import { AskForAnOfferModal } from './AskForAnOfferModal';
import { OffersView } from './OffersView';
import { ConfirmedDatesView } from './ConfirmedDatesView';
import { ProfileView } from './ProfileView';
import { MessagesChatView } from './MessagesChatView';

export interface DiscoverProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  photos?: string[];
  reliability: number;
  distanceKm: number;
  bio: string;
  idealDate?: string;
  openTo: string[];
  categories: string[];
  lookingFor?: string[];
  bodyType?: string;
  height?: string;
  education?: string;
  smoking?: string;
  drinking?: string;
  children?: string;
  location?: string;
  occupation?: string;
  interests?: string[];
  isVerified?: boolean;
  isIdVerified?: boolean;
  isSelfieVerified?: boolean;
  completedDatesCount?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string;
    eventTitle?: string;
    venueName?: string;
    reviewerName?: string;
  }>;
}

interface DiscoverPageProps {
  onBackToLanding?: () => void;
  onRequireSubscription?: () => void;
  onOpenProfile?: (profile: DiscoverProfile) => void;
}

export function DiscoverPage({
  onBackToLanding,
  onRequireSubscription,
}: DiscoverPageProps) {
  const { isGuest } = useRole();
  const { user, logout } = useAuth();

  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

  const [askOfferHostProfile, setAskOfferHostProfile] = useState<DiscoverProfile | null>(null);
  const [successToastText, setSuccessToastText] = useState('Invitation sent successfully!');
  const [toastSubtitle, setToastSubtitle] = useState('You will be notified once they respond.');
  const [showOfferSuccessToast, setShowOfferSuccessToast] = useState(false);

  const [activeTab, setActiveTab] = useState<'explore' | 'offers' | 'dates' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#offers') return 'offers';
      if (window.location.hash === '#dates') return 'dates';
      if (
        window.location.hash === '#profile' ||
        window.location.hash === '#reviews' ||
        window.location.hash === '#appeals'
      ) {
        return 'profile';
      }
    }
    return 'explore';
  });

  const [selectedCategory, setSelectedCategory] = useState<'dinner' | 'lunch' | 'events' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const [isMessagesOpen, setIsMessagesOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#messages';
    }
    return false;
  });
  const [initialChatContactName, setInitialChatContactName] = useState<string | undefined>(undefined);
  const [initialChatOfferId, setInitialChatOfferId] = useState<string | undefined>(undefined);

  const [offerModalProfile, setOfferModalProfile] = useState<DiscoverProfile | null>(null);
  const [offerStep, setOfferStep] = useState<'events' | 'details'>('events');
  const [selectedOfferEvents, setSelectedOfferEvents] = useState<string[]>([]);

  const [viewProfileModal, setViewProfileModal] = useState<DiscoverProfile | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [minReliability, setMinReliability] = useState<number>(0);
  const [searchPreferences, setSearchPreferences] = useState<Partial<SearchPreferenceFilters>>({});

  const triggerToast = (title: string, subtitle = 'You will be notified once they respond.') => {
    setSuccessToastText(title);
    setToastSubtitle(subtitle);
    setShowOfferSuccessToast(true);
    setTimeout(() => setShowOfferSuccessToast(false), 3800);
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch live Discover feed from backend (including all Search Preference filters)
  const fetchDiscoverFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    setFeedError(null);
    try {
      const res = await api.discover.getFeed({
        category: selectedCategory || undefined,
        search: debouncedSearch || undefined,
        location: searchPreferences.location?.trim() || undefined,
        isIdVerified: searchPreferences.isIdVerified || undefined,
        isSelfieVerified: searchPreferences.isSelfieVerified || undefined,
        smoking: searchPreferences.smoking || undefined,
        drinking: searchPreferences.drinking || undefined,
        children: searchPreferences.children || undefined,
        education:
          searchPreferences.education && searchPreferences.education.length > 0
            ? searchPreferences.education
            : undefined,
        lookingFor:
          searchPreferences.lookingFor && searchPreferences.lookingFor.length > 0
            ? searchPreferences.lookingFor
            : undefined,
        bodyTypes:
          searchPreferences.bodyTypes && searchPreferences.bodyTypes.length > 0
            ? searchPreferences.bodyTypes
            : undefined,
        heightMin:
          searchPreferences.heightMinInches && searchPreferences.heightMinInches > 58
            ? searchPreferences.heightMinInches
            : undefined,
        heightMax:
          searchPreferences.heightMaxInches && searchPreferences.heightMaxInches < 80
            ? searchPreferences.heightMaxInches
            : undefined,
        minAge: searchPreferences.minAge,
        maxAge: searchPreferences.maxAge,
        maxDistance,
        minReliability: minReliability > 0 ? minReliability : undefined,
        limit: 40,
      });

      if (res.success && Array.isArray(res.data)) {
        const mapped: DiscoverProfile[] = res.data.map((item: any) => ({
          id: item.id,
          name: item.name || item.nickname || 'Member',
          age: item.age || 28,
          image: item.image || '/assets/discover-card-1.jpg',
          photos: Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [item.image || '/assets/discover-card-1.jpg'],
          reliability: typeof item.reliability === 'number' ? item.reliability : 4.9,
          distanceKm: typeof item.distanceKm === 'number' ? item.distanceKm : 3,
          bio: item.bio || 'Meaningful connections and thoughtful evenings.',
          idealDate: item.idealDate,
          openTo: Array.isArray(item.openTo) && item.openTo.length > 0 ? item.openTo : ['Dinner', 'Events'],
          categories: Array.isArray(item.categories) ? item.categories : ['dinner', 'events'],
          lookingFor: Array.isArray(item.lookingFor) ? item.lookingFor : ['Dating', 'Long-term'],
          bodyType: item.bodyType || 'Athletic',
          height: item.height || '5\'09"',
          education: item.education || "Bachelor's degree",
          smoking: item.smoking || 'No',
          drinking: item.drinking || 'Occasionally',
          children: item.children || 'No',
          location: item.location || 'New York',
          occupation: item.occupation || 'Member',
          interests: Array.isArray(item.openTo) ? item.openTo : [],
          isVerified: Boolean(item.isVerified),
          isIdVerified: Boolean(item.isIdVerified ?? item.isVerified),
          isSelfieVerified: Boolean(item.isSelfieVerified ?? item.isVerified),
        }));
        let result = mapped;
        if (searchPreferences.interests && searchPreferences.interests.length > 0) {
          result = result.filter((p) => {
            const pInterests = (p.interests || []).map((i) => i.toLowerCase());
            const bio = (p.bio || '').toLowerCase();
            const openTo = (p.openTo || []).map((o) => o.toLowerCase());
            return searchPreferences.interests!.some((int) => {
              const lower = int.toLowerCase();
              return pInterests.includes(lower) || bio.includes(lower) || openTo.includes(lower);
            });
          });
        }
        setProfiles(result);
      } else {
        setProfiles([]);
      }
    } catch (err: any) {
      if (err?.status === 403 && String(err?.message || '').toLowerCase().includes('subscription')) {
        if (onRequireSubscription) onRequireSubscription();
        return;
      }
      setFeedError(err?.message || 'Unable to load profiles right now.');
      setProfiles([]);
    } finally {
      setIsLoadingFeed(false);
    }
  }, [
    selectedCategory,
    debouncedSearch,
    searchPreferences,
    maxDistance,
    minReliability,
    user?.role,
    onRequireSubscription,
  ]);

  useEffect(() => {
    fetchDiscoverFeed();
  }, [fetchDiscoverFeed]);

  // Load unread message count
  useEffect(() => {
    api.messages
      .getConversations()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const totalUnread = res.data.reduce(
            (sum: number, conv: any) => sum + (Number(conv.unreadCount) || 0),
            0
          );
          setUnreadMessagesCount(totalUnread);
        }
      })
      .catch(() => {});
  }, [isMessagesOpen, activeTab]);

  // Synchronize URL hash with active tab & sub-views
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash === '#offers') {
        setActiveTab('offers');
        setIsMessagesOpen(false);
      } else if (hash === '#dates') {
        setActiveTab('dates');
        setIsMessagesOpen(false);
      } else if (hash === '#profile' || hash === '#reviews' || hash === '#appeals') {
        setActiveTab('profile');
        setIsMessagesOpen(false);
      } else if (hash === '#messages') {
        setIsMessagesOpen(true);
      } else if (hash === '#discover' || hash === '#explore') {
        setActiveTab('explore');
        setIsMessagesOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const navigateTab = (tab: 'explore' | 'offers' | 'dates' | 'profile') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const targetHash = tab === 'explore' ? '#discover' : `#${tab}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState({ tab }, '', targetHash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openMessages = (contactName?: string, offerId?: string) => {
    setInitialChatContactName(contactName);
    setInitialChatOfferId(offerId);
    setIsMessagesOpen(true);
    if (typeof window !== 'undefined' && window.location.hash !== '#messages') {
      window.history.pushState({ view: 'messages' }, '', '#messages');
    }
  };

  const closeMessages = () => {
    setIsMessagesOpen(false);
    setInitialChatContactName(undefined);
    setInitialChatOfferId(undefined);
    if (typeof window !== 'undefined') {
      const fallback = activeTab === 'explore' ? '#discover' : `#${activeTab}`;
      window.history.pushState({ tab: activeTab }, '', fallback);
    }
  };

  const openOfferModal = (profile: DiscoverProfile) => {
    setOfferModalProfile(profile);
    setOfferStep('events');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'offer' }, '', '#send-offer');
    }
  };

  const closeOfferModal = () => {
    setOfferModalProfile(null);
    setOfferStep('events');
    if (typeof window !== 'undefined') {
      const fallback = activeTab === 'explore' ? '#discover' : `#${activeTab}`;
      window.history.pushState({ tab: activeTab }, '', fallback);
    }
  };

  // Fetch full public profile details whenever View Profile modal opens
  useEffect(() => {
    if (!viewProfileModal?.id) return;
    let cancelled = false;
    api.profile
      .getPublicProfile(viewProfileModal.id)
      .then((res) => {
        if (!cancelled && res.success && res.data) {
          setViewProfileModal((prev) =>
            prev && prev.id === res.data.id
              ? {
                  ...prev,
                  ...res.data,
                  image: res.data.photos?.[0] || prev.image,
                }
              : prev
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [viewProfileModal?.id]);

  const activePreferenceCount = useMemo(() => {
    let count = 0;
    if (searchPreferences.location?.trim()) count++;
    if (searchPreferences.isIdVerified) count++;
    if (searchPreferences.isSelfieVerified) count++;
    if (searchPreferences.smoking) count++;
    if (searchPreferences.drinking) count++;
    if (searchPreferences.children) count++;
    if (searchPreferences.education && searchPreferences.education.length > 0) count++;
    if (searchPreferences.interests && searchPreferences.interests.length > 0) count++;
    if (searchPreferences.lookingFor && searchPreferences.lookingFor.length > 0) count++;
    if (searchPreferences.bodyTypes && searchPreferences.bodyTypes.length > 0) count++;
    if (
      (searchPreferences.heightMinInches && searchPreferences.heightMinInches > 58) ||
      (searchPreferences.heightMaxInches && searchPreferences.heightMaxInches < 80)
    ) {
      count++;
    }
    if (
      (searchPreferences.minAge && searchPreferences.minAge > 18) ||
      (searchPreferences.maxAge && searchPreferences.maxAge < 60)
    ) {
      count++;
    }
    if (searchPreferences.keywords?.trim()) count++;
    return count;
  }, [searchPreferences]);

  const filteredProfiles = profiles;

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
    setMaxDistance(50);
    setMinReliability(0);
    setIsFilterModalOpen(false);
  };

  const handleSignOut = () => {
    logout();
    if (onBackToLanding) onBackToLanding();
  };

  return (
    <div className="min-h-screen w-full bg-[#EFE7DA] font-sans antialiased text-[#16120F] flex flex-col justify-between selection:bg-[#9F1E19]/15 pb-20 sm:pb-0">
      {/* 1. TOP NAVBAR / HEADER */}
      <header
        className={`w-full bg-[#EFE7DA]/95 sticky top-0 z-40 backdrop-blur-md border-b border-[#EADBCA]/60 transition-all ${
          activeTab === 'profile' ? 'hidden sm:block' : ''
        }`}
      >
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

          {/* Logo */}
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
              onClick={() => navigateTab('explore')}
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
              onClick={() => navigateTab('offers')}
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
              onClick={() => navigateTab('dates')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'dates'
                  ? 'bg-[#9F1E19] text-white shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
            >
              Dates
            </button>
          </nav>

          {/* Right Icons: Messages + Profile + Sign Out (Desktop only) */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openMessages(undefined, undefined)}
              className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EADBCA] flex items-center justify-center text-[#16120F] hover:bg-[#F5F1E6] hover:border-[#9F1E19]/30 transition-all shadow-xs cursor-pointer relative"
              aria-label="Messages"
            >
              <MessageCircle className="w-4 h-4 text-[#16120F]" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9F1E19] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTab('profile')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#9F1E19] text-white'
                  : 'bg-[#FAF7F2] border border-[#EADBCA] text-[#16120F] hover:bg-[#F5F1E6]'
              }`}
              aria-label="My Profile"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EADBCA] text-[#6E6A63] hover:text-[#9F1E19] hover:border-[#9F1E19]/40 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main
        className={`max-w-[1240px] w-full mx-auto flex-1 ${
          activeTab === 'profile'
            ? 'px-4 sm:px-6 lg:px-8 pt-4 pb-24 sm:py-8'
            : 'px-4 sm:px-6 lg:px-8 py-5 sm:py-8'
        }`}
      >
        {activeTab === 'offers' ? (
          <OffersView
            onNavigateExplore={() => navigateTab('explore')}
            onOpenChat={(offer) => openMessages(offer.userName, offer.id)}
          />
        ) : activeTab === 'dates' ? (
          <ConfirmedDatesView
            onOpenChat={(item) => openMessages(item.userName, item.id)}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView />
        ) : (
          <>
            {/* Search Bar + Filter Button */}
            <div className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full p-1.5 sm:p-2 flex items-center shadow-xs transition-shadow focus-within:shadow-md focus-within:border-[#9F1E19]/40">
              <div className="pl-3 sm:pl-4 pr-2 text-[#6E6A63]">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E6A63]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, bio, or occupation"
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
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-medium border transition-colors cursor-pointer active:scale-95 shrink-0 ${
                  activePreferenceCount > 0
                    ? 'bg-[#9F1E19] text-white border-[#9F1E19]'
                    : 'bg-[#F5F1E6] hover:bg-[#EAE3D6] text-[#16120F] border-[#E0D7C6]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Filter{activePreferenceCount > 0 ? ` (${activePreferenceCount})` : ''}
                </span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 overflow-x-auto pb-1 no-scrollbar">
              {(['dinner', 'lunch', 'events'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#16120F] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#16120F] border border-[#EADBCA] hover:border-[#16120F]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {(selectedCategory || activePreferenceCount > 0) && (
                <button
                  type="button"
                  onClick={handleResetPreferences}
                  className="text-xs text-[#9F1E19] hover:underline font-semibold ml-1 cursor-pointer whitespace-nowrap"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* CARDS FEED / GRID */}
            <section className="mt-6 sm:mt-8">
              {isLoadingFeed ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] overflow-hidden h-[360px] flex flex-col animate-pulse"
                    >
                      <div className="h-44 bg-[#E8DFD0]" />
                      <div className="p-5 space-y-3 flex-1">
                        <div className="h-5 w-1/2 bg-[#E8DFD0] rounded" />
                        <div className="h-3 w-2/3 bg-[#E8DFD0] rounded" />
                        <div className="h-8 w-full bg-[#E8DFD0] rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : feedError ? (
                <div className="bg-[#FAF7F2] border border-[#F3C5C7] rounded-[24px] p-10 text-center max-w-[480px] mx-auto my-12">
                  <p className="font-serif font-bold text-base text-[#9F1E19]">{feedError}</p>
                  <button
                    type="button"
                    onClick={fetchDiscoverFeed}
                    className="mt-4 bg-[#9F1E19] text-white text-xs px-5 py-2 rounded-full font-medium hover:bg-[#851713] cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] p-10 text-center max-w-[480px] mx-auto my-12">
                  <Compass className="w-10 h-10 text-[#9F1E19]/60 mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-lg text-[#16120F]">
                    No profiles match your filter
                  </h3>
                  <p className="text-xs text-[#6E6A63] mt-1.5 leading-relaxed">
                    Try clearing your search query or selecting another category to see more members.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetPreferences}
                    className="mt-4 bg-[#9F1E19] text-white text-xs px-5 py-2 rounded-full font-medium hover:bg-[#851713] cursor-pointer"
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
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8DFD0]">
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>

                      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center justify-between">
                            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#16120F] tracking-tight">
                              {profile.name}, {profile.age}
                            </h2>
                            <span title="Verified Member" className="text-[#B38E46] text-base">
                              👑
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] mt-0.5 font-normal">
                            <span>Reliability {profile.reliability.toFixed(1)}</span>
                            <span>·</span>
                            <span>{profile.distanceKm} km away</span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#16120F] mt-2.5 font-normal leading-relaxed line-clamp-2">
                            {profile.bio}
                          </p>

                          <p className="text-[11px] sm:text-xs text-[#6E6A63] mt-2 font-medium">
                            Open to {profile.openTo.join(' · ')}
                          </p>
                        </div>

                        <div className="mt-5 pt-1 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setViewProfileModal(profile)}
                            className="flex-1 py-2.5 px-3 rounded-full border border-[#DED7C8] bg-[#FAF7F2] hover:bg-[#EFE7DA] text-[#16120F] font-semibold text-xs text-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
                          >
                            View profile
                          </button>

                          {isGuest ? (
                            <button
                              type="button"
                              onClick={() => setAskOfferHostProfile(profile)}
                              className="flex-1 py-2.5 px-3 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-xs text-center shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              Request invitation
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openOfferModal(profile)}
                              className="flex-1 py-2.5 px-3 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-xs text-center shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                              Extend an invitation
                            </button>
                          )}
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

      {/* 3. DESKTOP FOOTER */}
      <footer className="w-full border-t border-[#EADBCA] mt-12 sm:mt-20 py-8 bg-[#EFE7DA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6E6A63]">
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

      {/* 4. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EADBCA] py-2 px-3 flex justify-around items-center shadow-lg">
        <button
          type="button"
          onClick={() => navigateTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'explore' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wide">Explore</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTab('offers')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'offers' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Send className="w-5 h-5 rotate-45" />
          <span className="text-[10px] font-medium tracking-wide">Offers</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTab('dates')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'dates' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Dates</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#9F1E19]' : 'text-[#6E6A63]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </button>
      </nav>

      {/* 5. SIDE MENU (MOBILE DRAWER) */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSideMenuOpen(false)}
          />

          <aside className="relative z-50 w-[290px] max-w-[85vw] h-full bg-[#16120F] text-[#F5F1E6] p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-250">
            <div>
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

              <nav className="flex flex-col space-y-5 pt-3">
                <a
                  href="#messages"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSideMenuOpen(false);
                    openMessages();
                  }}
                  className="text-base sm:text-lg font-medium text-[#F5F1E6] hover:text-[#FCB943] transition-colors flex items-center justify-between group"
                >
                  <span>Messages</span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-xs bg-[#9F1E19] text-white px-2 py-0.5 rounded-full font-semibold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-left text-base sm:text-lg font-medium text-[#F87171] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-[#A9A49C]">
              <p className="font-serif italic text-white/90 mb-1">
                The date starts with an invitation.
              </p>
              <p>© 2025 thedateboss</p>
            </div>
          </aside>
        </div>
      )}

      {/* 6. SEND OFFER MODAL */}
      {offerModalProfile && offerStep === 'events' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <OfferEventsView
            targetProfileName={offerModalProfile.name}
            onBack={closeOfferModal}
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
            onSendOffer={async (offerData) => {
              try {
                await api.offers.create({
                  guestId: offerModalProfile.id,
                  activityType: offerData.occasion,
                  venueName: offerData.where,
                  personalMessage: offerData.shortNote,
                  hospitalityGuarantee: `$${offerData.giftAmount} Escrow Gift`,
                });
                closeOfferModal();
                triggerToast(
                  `Offer sent to ${offerModalProfile.name}!`,
                  'They have 48 hours to accept, counter, or pass.'
                );
              } catch (err: any) {
                if (err?.status === 403 && onRequireSubscription) {
                  closeOfferModal();
                  onRequireSubscription();
                  return;
                }
                triggerToast(err?.message || 'Unable to send invitation', 'Please check your subscription and try again.');
              }
            }}
          />
        </div>
      )}

      {/* 7. VIEW PROFILE MODAL */}
      {viewProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-[#EADBCA] rounded-[28px] max-w-[540px] w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setViewProfileModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

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
                  <span className="block text-xs text-[#6E6A63]">Verification</span>
                  <span className="font-semibold text-xs text-emerald-700">
                    {viewProfileModal.isIdVerified
                      ? 'ID & Selfie Verified'
                      : viewProfileModal.isSelfieVerified
                      ? 'Selfie Verified'
                      : viewProfileModal.isVerified
                      ? 'Verified'
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Gallery Strip if multiple photos exist */}
              {viewProfileModal.photos && viewProfileModal.photos.length > 1 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-2">
                    Gallery ({viewProfileModal.photos.length} Photos)
                  </h4>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {viewProfileModal.photos.map((photoUrl, idx) => (
                      <img
                        key={idx}
                        src={photoUrl}
                        alt={`${viewProfileModal.name} ${idx + 1}`}
                        className="w-16 h-16 rounded-xl object-cover border border-[#EADBCA] shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Attributes Grid (Height, Body Type, Education, Smoking, Drinking, Children) */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Height</span>
                  <span className="text-xs font-semibold text-[#16120F]">
                    {viewProfileModal.height || '5\'09"'}
                  </span>
                </div>
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Body Type</span>
                  <span className="text-xs font-semibold text-[#16120F] truncate block">
                    {viewProfileModal.bodyType || 'Athletic'}
                  </span>
                </div>
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Education</span>
                  <span className="text-xs font-semibold text-[#16120F] truncate block">
                    {viewProfileModal.education || "Bachelor's degree"}
                  </span>
                </div>
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Smoking</span>
                  <span className="text-xs font-semibold text-[#16120F]">
                    {viewProfileModal.smoking || 'No'}
                  </span>
                </div>
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Drinking</span>
                  <span className="text-xs font-semibold text-[#16120F]">
                    {viewProfileModal.drinking || 'Occasionally'}
                  </span>
                </div>
                <div className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-2.5">
                  <span className="block text-[10px] text-[#6E6A63]">Children</span>
                  <span className="text-xs font-semibold text-[#16120F]">
                    {viewProfileModal.children || 'No'}
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

              {viewProfileModal.idealDate && (
                <div>
                  <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-1">
                    Ideal First Date
                  </h4>
                  <p className="text-xs sm:text-sm text-[#524D46] leading-relaxed">
                    {viewProfileModal.idealDate}
                  </p>
                </div>
              )}

              {viewProfileModal.lookingFor && viewProfileModal.lookingFor.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-2">
                    Looking For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewProfileModal.lookingFor.map((lf, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#EFE7DA] border border-[#DFD4C2] text-[#16120F] text-xs font-medium"
                      >
                        {lf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              {viewProfileModal.reviews && viewProfileModal.reviews.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#16120F] uppercase tracking-wider mb-2">
                    Recent Date Reviews ({viewProfileModal.reviews.length})
                  </h4>
                  <div className="space-y-2">
                    {viewProfileModal.reviews.slice(0, 2).map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-[#F5F1E6] border border-[#EADBCA] rounded-xl p-3 text-xs"
                      >
                        <div className="flex items-center justify-between font-semibold text-[#16120F] mb-1">
                          <span>{rev.reviewerName || 'Verified Member'}</span>
                          <span className="text-[#9F1E19]">★ {rev.rating.toFixed(1)}</span>
                        </div>
                        {rev.comment && <p className="text-[#524D46]">{rev.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                {isGuest ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prof = viewProfileModal;
                      setViewProfileModal(null);
                      setAskOfferHostProfile(prof);
                    }}
                    className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request an invitation from {viewProfileModal.name}</span>
                  </button>
                ) : (
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
                    <span>Extend an invitation to {viewProfileModal.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. ASK FOR AN OFFER MODAL */}
      {askOfferHostProfile && (
        <AskForAnOfferModal
          hostProfile={askOfferHostProfile}
          onClose={() => setAskOfferHostProfile(null)}
          onSubmitSuccess={() => {
            setAskOfferHostProfile(null);
            triggerToast(
              'Your date request was sent!',
              'Verified hosts will review your wishlist and respond.'
            );
          }}
        />
      )}

      {/* 9. SEARCH PREFERENCE MODAL */}
      <SearchPreferenceModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyPreferences}
        onReset={handleResetPreferences}
        initialFilters={searchPreferences}
      />

      {/* 10. MESSAGES / CHAT VIEW */}
      {isMessagesOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <MessagesChatView
            initialContactName={initialChatContactName}
            initialOfferId={initialChatOfferId}
            onClose={closeMessages}
          />
        </div>
      )}

      {/* 11. TOAST NOTIFICATION */}
      {showOfferSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16120F] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{successToastText}</p>
            <p className="text-[11px] text-white/70">{toastSubtitle}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscoverPage;
