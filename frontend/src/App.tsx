import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/Landing';
import { DiscoverPage } from './pages/Discover';
import { TermsAndConditionsPage } from './pages/Legal/TermsAndConditionsPage';
import {
  Step1Begin,
  Step2Interests,
  Step2GuestEvents,
  Step3Account,
  Step4Details,
  Step5Lifestyle,
  Step6Career,
  Step7Prompts,
  Step8Photos,
  Step9SelfieVerification,
  Step10FaceCenterStage,
  Step11VideoChecking,
  Step12WelcomeHost,
} from './pages/Onboarding';
import { UserRole } from './types/onboarding';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

type AppView =
  | 'landing'
  | 'terms'
  | 'discover'
  | 'onboarding-step1'
  | 'onboarding-guest-events'
  | 'onboarding-step2'
  | 'onboarding-step3'
  | 'onboarding-step4'
  | 'onboarding-step5'
  | 'onboarding-step6'
  | 'onboarding-step7'
  | 'onboarding-step8'
  | 'onboarding-step9'
  | 'onboarding-step10'
  | 'onboarding-step11'
  | 'onboarding-step12';

const PROTECTED_AUTH_VIEWS: AppView[] = [
  'discover',
  'onboarding-step4',
  'onboarding-step5',
  'onboarding-step6',
  'onboarding-step7',
  'onboarding-step8',
  'onboarding-step9',
  'onboarding-step10',
  'onboarding-step11',
  'onboarding-step12',
];

function resolveViewFromLocation(): { view: AppView; signinMode: boolean } {
  if (typeof window === 'undefined') {
    return { view: 'landing', signinMode: false };
  }
  const path = window.location.pathname;
  const rawHash = window.location.hash;
  const hash = rawHash.split('?')[0];

  if (path === '/terms' || hash === '#terms' || hash === '#terms-and-conditions') {
    return { view: 'terms', signinMode: false };
  }
  if (
    path === '/discover' ||
    hash === '#discover' ||
    hash === '#explore' ||
    hash === '#offers' ||
    hash === '#dates' ||
    hash === '#profile' ||
    hash === '#messages' ||
    hash === '#reviews' ||
    hash === '#appeals' ||
    hash === '#send-offer'
  ) {
    return { view: 'discover', signinMode: false };
  }
  if (path === '/signin' || hash === '#signin' || hash === '#login') {
    return { view: 'onboarding-step3', signinMode: true };
  }
  if (path === '/step12' || hash === '#step12' || hash === '#welcome-host' || hash === '#membership') {
    return { view: 'onboarding-step12', signinMode: false };
  }
  if (path === '/step11' || hash === '#step11' || hash === '#checking') {
    return { view: 'onboarding-step11', signinMode: false };
  }
  if (path === '/step10' || hash === '#step10' || hash === '#face' || hash === '#video-check') {
    return { view: 'onboarding-step10', signinMode: false };
  }
  if (path === '/step9' || hash === '#step9' || hash === '#verification' || hash === '#selfie') {
    return { view: 'onboarding-step9', signinMode: false };
  }
  if (path === '/step8' || hash === '#step8' || hash === '#photos') {
    return { view: 'onboarding-step8', signinMode: false };
  }
  if (path === '/step7' || hash === '#step7' || hash === '#prompts') {
    return { view: 'onboarding-step7', signinMode: false };
  }
  if (path === '/step6' || hash === '#step6' || hash === '#career') {
    return { view: 'onboarding-step6', signinMode: false };
  }
  if (path === '/step5' || hash === '#step5' || hash === '#lifestyle') {
    return { view: 'onboarding-step5', signinMode: false };
  }
  if (path === '/step4' || hash === '#step4' || hash === '#details') {
    return { view: 'onboarding-step4', signinMode: false };
  }
  if (path === '/step3' || hash === '#step3' || hash === '#account') {
    return { view: 'onboarding-step3', signinMode: false };
  }
  if (path === '/events' || hash === '#events' || hash === '#guest-events') {
    return { view: 'onboarding-guest-events', signinMode: false };
  }
  if (path === '/step2' || hash === '#step2' || hash === '#host') {
    return { view: 'onboarding-step2', signinMode: false };
  }
  if (path === '/join' || hash === '#join') {
    return { view: 'onboarding-step1', signinMode: false };
  }
  return { view: 'landing', signinMode: false };
}

export function App() {
  const { isLoading, isAuthenticated, hasActiveSubscription } = useAuth();

  const initial = resolveViewFromLocation();
  const [currentView, setCurrentView] = useState<AppView>(initial.view);
  const [step3InitialMode, setStep3InitialMode] = useState<'options' | 'signin'>(
    initial.signinMode ? 'signin' : 'options'
  );

  const [initialRole, setInitialRole] = useState<UserRole | null>(null);
  const [step2Source, setStep2Source] = useState<'events' | 'host'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.split('?')[0];
      const path = window.location.pathname;
      if (path === '/step2' || hash === '#step2' || hash === '#host') return 'host';
    }
    return 'events';
  });

  // Persist Step 1 & Step 2 choices in sessionStorage so refreshes before Step 3 never lose data
  const [selectedGender, setSelectedGender] = useState<'MAN' | 'WOMAN' | 'OTHER'>(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('tdb_gender') : null;
    return saved === 'MAN' || saved === 'WOMAN' || saved === 'OTHER' ? saved : 'MAN';
  });
  const [selectedTargetGender, setSelectedTargetGender] = useState<'MEN' | 'WOMEN' | 'EVERYONE'>(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('tdb_target_gender') : null;
    return saved === 'MEN' || saved === 'WOMEN' || saved === 'EVERYONE' ? saved : 'WOMEN';
  });
  const [pendingGuestEvents, setPendingGuestEvents] = useState<{
    selectedEvents: string[];
    customIdeas: Array<{ title: string; description: string }>;
  } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('tdb_pending_guest_events');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [pendingHostInterests, setPendingHostInterests] = useState<string[] | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('tdb_pending_host_interests');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [uploadedStep8Photos, setUploadedStep8Photos] = useState<string[]>([]);

  const pushView = useCallback((view: AppView, url: string) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.history.pushState({ view }, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateToLanding = useCallback(() => {
    pushView('landing', '/');
  }, [pushView]);

  const navigateToStep1 = useCallback(
    (role?: UserRole | null) => {
      setInitialRole(role || null);
      pushView('onboarding-step1', '#join');
    },
    [pushView]
  );

  const navigateToGuestEvents = useCallback(() => {
    setStep2Source('events');
    pushView('onboarding-guest-events', '#events');
  }, [pushView]);

  const navigateToStep2 = useCallback(() => {
    setStep2Source('host');
    pushView('onboarding-step2', '#step2');
  }, [pushView]);

  const navigateToStep3 = useCallback(
    (mode: 'options' | 'signin' = 'options') => {
      setStep3InitialMode(mode);
      pushView('onboarding-step3', mode === 'signin' ? '#signin' : '#step3');
    },
    [pushView]
  );

  const navigateToStep4 = useCallback(() => pushView('onboarding-step4', '#step4'), [pushView]);
  const navigateToStep5 = useCallback(() => pushView('onboarding-step5', '#step5'), [pushView]);
  const navigateToStep6 = useCallback(() => pushView('onboarding-step6', '#step6'), [pushView]);
  const navigateToStep7 = useCallback(() => pushView('onboarding-step7', '#step7'), [pushView]);
  const navigateToStep8 = useCallback(() => pushView('onboarding-step8', '#step8'), [pushView]);
  const navigateToStep9 = useCallback(() => pushView('onboarding-step9', '#step9'), [pushView]);
  const navigateToStep10 = useCallback(() => pushView('onboarding-step10', '#step10'), [pushView]);
  const navigateToStep11 = useCallback(() => pushView('onboarding-step11', '#step11'), [pushView]);
  const navigateToStep12 = useCallback(() => pushView('onboarding-step12', '#step12'), [pushView]);
  const navigateToDiscover = useCallback(() => pushView('discover', '#discover'), [pushView]);

  // Strict Route & Subscription Guard:
  // 1) Unauthenticated visitors cannot access discover/offers/dates/profile/messages or post-auth onboarding -> Landing Page
  // 2) Authenticated Hosts without an active subscription cannot access discover -> Step 12 Membership
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && PROTECTED_AUTH_VIEWS.includes(currentView)) {
      setCurrentView('landing');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'landing' }, '', '/');
      }
      return;
    }

    if (isAuthenticated && !hasActiveSubscription && currentView === 'discover') {
      setCurrentView('onboarding-step12');
      if (typeof window !== 'undefined') {
        window.history.replaceState({ view: 'onboarding-step12' }, '', '#step12');
      }
    }
  }, [isLoading, isAuthenticated, hasActiveSubscription, currentView]);

  // Sync with browser back/forward buttons and anchor hash links (e.g. #terms)
  useEffect(() => {
    const handleLocationSync = () => {
      const hash = window.location.hash.split('?')[0];
      // Ignore in-page section anchors on the landing page
      if (
        hash === '#how-it-works' ||
        hash === '#roles' ||
        hash === '#safety' ||
        hash === '#safety-tips' ||
        hash === '#faq'
      ) {
        return;
      }
      const resolved = resolveViewFromLocation();
      if (resolved.view === 'onboarding-guest-events') setStep2Source('events');
      if (resolved.view === 'onboarding-step2') setStep2Source('host');
      if (resolved.view === 'onboarding-step3') {
        setStep3InitialMode(resolved.signinMode ? 'signin' : 'options');
      }
      setCurrentView(resolved.view);
      if (resolved.view === 'terms') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handleLocationSync);
    window.addEventListener('hashchange', handleLocationSync);
    return () => {
      window.removeEventListener('popstate', handleLocationSync);
      window.removeEventListener('hashchange', handleLocationSync);
    };
  }, []);

  if (currentView === 'terms') {
    return (
      <TermsAndConditionsPage
        onBack={() => navigateToLanding()}
        onJoinAsHost={() => navigateToStep2()}
        onJoinAsGuest={() => navigateToStep1('guest')}
      />
    );
  }

  if (isLoading && PROTECTED_AUTH_VIEWS.includes(currentView)) {
    return (
      <div className="min-h-screen w-full bg-[#EFE7DA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="thedateboss"
            className="h-9 w-auto object-contain animate-pulse"
          />
          <p className="text-xs font-medium text-[#6E6A63]">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'onboarding-step1') {
    return (
      <Step1Begin
        initialRole={initialRole}
        onBack={navigateToLanding}
        onJoinAsHostDirect={() => {
          setSelectedGender('MAN');
          setSelectedTargetGender('WOMEN');
          sessionStorage.setItem('tdb_gender', 'MAN');
          sessionStorage.setItem('tdb_target_gender', 'WOMEN');
          navigateToStep2();
        }}
        onJoinAsGuestDirect={() => {
          setSelectedGender('WOMAN');
          setSelectedTargetGender('MEN');
          sessionStorage.setItem('tdb_gender', 'WOMAN');
          sessionStorage.setItem('tdb_target_gender', 'MEN');
          navigateToGuestEvents();
        }}
        onContinueToStep2={(data) => {
          const mappedGender: 'MAN' | 'WOMAN' | 'OTHER' =
            data.whoYouAre === 'Women' ? 'WOMAN' : data.whoYouAre === 'Men' ? 'MAN' : 'OTHER';
          const mappedTarget: 'MEN' | 'WOMEN' | 'EVERYONE' =
            data.whoToMeet === 'Men' ? 'MEN' : data.whoToMeet === 'Women' ? 'WOMEN' : 'EVERYONE';
          setSelectedGender(mappedGender);
          setSelectedTargetGender(mappedTarget);
          sessionStorage.setItem('tdb_gender', mappedGender);
          sessionStorage.setItem('tdb_target_gender', mappedTarget);

          if (data.role === 'guest' || data.whoYouAre === 'Women') {
            navigateToGuestEvents();
          } else {
            navigateToStep2();
          }
        }}
      />
    );
  }

  if (currentView === 'onboarding-guest-events') {
    return (
      <Step2GuestEvents
        onBack={() => navigateToStep1()}
        onContinue={(eventsData) => {
          setPendingGuestEvents(eventsData);
          sessionStorage.setItem('tdb_pending_guest_events', JSON.stringify(eventsData));
          sessionStorage.removeItem('tdb_pending_host_interests');
          setPendingHostInterests(null);
          navigateToStep3('options');
        }}
      />
    );
  }

  if (currentView === 'onboarding-step2') {
    return (
      <Step2Interests
        onBack={() => navigateToStep1()}
        onContinue={(selected) => {
          setPendingHostInterests(selected);
          sessionStorage.setItem('tdb_pending_host_interests', JSON.stringify(selected));
          sessionStorage.removeItem('tdb_pending_guest_events');
          setPendingGuestEvents(null);
          navigateToStep3('options');
        }}
      />
    );
  }

  if (currentView === 'onboarding-step3') {
    return (
      <Step3Account
        userRole={step2Source === 'events' ? 'guest' : 'host'}
        gender={selectedGender}
        targetGender={selectedTargetGender}
        initialAuthMode={step3InitialMode}
        onBack={() => {
          if (step3InitialMode === 'signin') {
            navigateToLanding();
          } else if (step2Source === 'events' || initialRole === 'guest') {
            navigateToGuestEvents();
          } else {
            navigateToStep2();
          }
        }}
        onComplete={async () => {
          try {
            if (pendingGuestEvents) {
              await api.onboarding.saveGuestEvents(pendingGuestEvents);
              setPendingGuestEvents(null);
              sessionStorage.removeItem('tdb_pending_guest_events');
            } else if (pendingHostInterests) {
              await api.onboarding.saveHostInterests({ interests: pendingHostInterests });
              setPendingHostInterests(null);
              sessionStorage.removeItem('tdb_pending_host_interests');
            }
          } catch (err) {
            console.error('Failed to flush Step 2 preferences:', err);
          }
          navigateToStep4();
        }}
        onSignIn={(hasSub) => {
          if (hasSub) {
            navigateToDiscover();
          } else {
            navigateToStep12();
          }
        }}
      />
    );
  }

  if (currentView === 'onboarding-step4' && isAuthenticated) {
    return (
      <Step4Details
        onBack={() => navigateToStep3('options')}
        onComplete={async (data) => {
          try {
            await api.onboarding.saveDetails({
              nickname: data.nickname,
              age: data.age,
              locationCity: data.location,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          } catch (err) {
            console.error('Save details error:', err);
          }
          navigateToStep5();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step5' && isAuthenticated) {
    return (
      <Step5Lifestyle
        onBack={() => navigateToStep4()}
        onContinue={async (data) => {
          try {
            await api.onboarding.saveLifestyle({
              children: data.children,
              smoking: data.smoke,
              drinking: data.drink,
              heightInches: data.heightInches,
              bodyType: data.bodyType,
              lookingFor: data.lookingFor,
            });
          } catch (err) {
            console.error('Save lifestyle error:', err);
          }
          navigateToStep6();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step6' && isAuthenticated) {
    return (
      <Step6Career
        onBack={() => navigateToStep5()}
        onContinue={async (data) => {
          try {
            await api.onboarding.saveCareer({
              education: data.education,
              occupation: data.occupation,
              annualIncome: data.annualIncome,
              netWorth: data.netWorth,
            });
          } catch (err) {
            console.error('Save career error:', err);
          }
          navigateToStep7();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step7' && isAuthenticated) {
    return (
      <Step7Prompts
        onBack={() => navigateToStep6()}
        onSkip={() => navigateToStep8()}
        onContinue={async (data) => {
          try {
            await api.onboarding.savePrompts({
              bio: data.bio,
              idealDate: data.idealFirstDate,
            });
          } catch (err) {
            console.error('Save prompts error:', err);
          }
          navigateToStep8();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step8' && isAuthenticated) {
    return (
      <Step8Photos
        onBack={() => navigateToStep7()}
        onContinue={async (photos) => {
          setUploadedStep8Photos(photos);
          try {
            if (photos.length > 0) {
              await api.onboarding.savePhotos({ photos });
            }
          } catch (err) {
            console.error('Save photos error:', err);
          }
          navigateToStep9();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step9' && isAuthenticated) {
    return (
      <Step9SelfieVerification
        onBack={() => navigateToStep8()}
        onSkip={() => navigateToStep12()}
        onContinue={() => navigateToStep10()}
      />
    );
  }

  if (currentView === 'onboarding-step10' && isAuthenticated) {
    return (
      <Step10FaceCenterStage
        onBack={() => navigateToStep9()}
        onStartVideoCheck={async () => {
          try {
            const primaryPhoto = uploadedStep8Photos[0] || '/assets/selfie-illustration.png';
            await api.onboarding.submitVerification({
              selfieUrl: primaryPhoto,
              faceSnapshotUrl: uploadedStep8Photos[1] || primaryPhoto,
            });
          } catch (err) {
            console.error('Submit verification error:', err);
          }
          navigateToStep11();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step11' && isAuthenticated) {
    return (
      <Step11VideoChecking
        onBack={() => navigateToStep10()}
        onComplete={() => navigateToStep12()}
      />
    );
  }

  if (currentView === 'onboarding-step12' && isAuthenticated) {
    return (
      <Step12WelcomeHost
        onBack={() => navigateToLanding()}
        onStartHosting={() => navigateToDiscover()}
        onBackToLanding={navigateToLanding}
      />
    );
  }

  if (currentView === 'discover' && isAuthenticated && hasActiveSubscription) {
    return (
      <DiscoverPage
        onBackToLanding={navigateToLanding}
        onRequireSubscription={() => navigateToStep12()}
      />
    );
  }

  return (
    <LandingPage
      onJoinNow={() => navigateToStep1('host')}
      onJoinAsHost={() => navigateToStep2()}
      onJoinAsGuest={() => navigateToStep1('guest')}
      onSignIn={() => navigateToStep3('signin')}
    />
  );
}

export default App;
