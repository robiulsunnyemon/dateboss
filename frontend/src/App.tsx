import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/Landing';
import { DiscoverPage } from './pages/Discover';
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

export function App() {
  // Routing view state: 'landing' | 'discover' | 'onboarding-step1' | 'onboarding-guest-events' | 'onboarding-step2' .. 'onboarding-step12'
  const [currentView, setCurrentView] = useState<
    | 'landing'
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
    | 'onboarding-step12'
  >(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/discover' || hash === '#discover' || hash === '#explore' || hash === '#offers' || hash === '#dates') return 'discover';
      if (path === '/step12' || hash === '#step12' || hash === '#welcome-host' || hash === '#membership') return 'onboarding-step12';
      if (path === '/step11' || hash === '#step11' || hash === '#checking') return 'onboarding-step11';
      if (path === '/step10' || hash === '#step10' || hash === '#face' || hash === '#video-check') return 'onboarding-step10';
      if (path === '/step9' || hash === '#step9' || hash === '#verification' || hash === '#selfie') return 'onboarding-step9';
      if (path === '/step8' || hash === '#step8' || hash === '#photos') return 'onboarding-step8';
      if (path === '/step7' || hash === '#step7' || hash === '#prompts') return 'onboarding-step7';
      if (path === '/step6' || hash === '#step6' || hash === '#career') return 'onboarding-step6';
      if (path === '/step5' || hash === '#step5' || hash === '#lifestyle') return 'onboarding-step5';
      if (path === '/step4' || hash === '#step4' || hash === '#details') return 'onboarding-step4';
      if (path === '/step3' || hash === '#step3' || hash === '#account') return 'onboarding-step3';
      if (path === '/events' || hash === '#events' || hash === '#guest-events') return 'onboarding-guest-events';
      if (path === '/step2' || hash === '#step2' || hash === '#host') return 'onboarding-step2';
      if (path === '/join' || hash === '#join') return 'onboarding-step1';
    }
    return 'landing';
  });

  const [initialRole, setInitialRole] = useState<UserRole | null>(null);
  const [step2Source, setStep2Source] = useState<'events' | 'host'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/step2' || hash === '#step2' || hash === '#host') return 'host';
    }
    return 'events';
  });

  const navigateToStep1 = (role?: UserRole | null) => {
    setInitialRole(role || null);
    setCurrentView('onboarding-step1');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step1' }, '', '#join');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToGuestEvents = () => {
    setStep2Source('events');
    setCurrentView('onboarding-guest-events');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-guest-events' }, '', '#events');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep2 = () => {
    setStep2Source('host');
    setCurrentView('onboarding-step2');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step2' }, '', '#step2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep3 = () => {
    setCurrentView('onboarding-step3');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step3' }, '', '#step3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep4 = () => {
    setCurrentView('onboarding-step4');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step4' }, '', '#step4');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep5 = () => {
    setCurrentView('onboarding-step5');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step5' }, '', '#step5');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep6 = () => {
    setCurrentView('onboarding-step6');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step6' }, '', '#step6');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep7 = () => {
    setCurrentView('onboarding-step7');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step7' }, '', '#step7');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep8 = () => {
    setCurrentView('onboarding-step8');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step8' }, '', '#step8');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep9 = () => {
    setCurrentView('onboarding-step9');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step9' }, '', '#step9');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep10 = () => {
    setCurrentView('onboarding-step10');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step10' }, '', '#step10');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep11 = () => {
    setCurrentView('onboarding-step11');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step11' }, '', '#step11');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep12 = () => {
    setCurrentView('onboarding-step12');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step12' }, '', '#step12');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToDiscover = () => {
    setCurrentView('discover');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'discover' }, '', '#discover');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'landing' }, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/discover' || hash === '#discover' || hash === '#explore') {
        setCurrentView('discover');
      } else if (path === '/step12' || hash === '#step12' || hash === '#welcome-host' || hash === '#membership') {
        setCurrentView('onboarding-step12');
      } else if (path === '/step11' || hash === '#step11' || hash === '#checking') {
        setCurrentView('onboarding-step11');
      } else if (path === '/step10' || hash === '#step10' || hash === '#face' || hash === '#video-check') {
        setCurrentView('onboarding-step10');
      } else if (path === '/step9' || hash === '#step9' || hash === '#verification' || hash === '#selfie') {
        setCurrentView('onboarding-step9');
      } else if (path === '/step8' || hash === '#step8' || hash === '#photos') {
        setCurrentView('onboarding-step8');
      } else if (path === '/step7' || hash === '#step7' || hash === '#prompts') {
        setCurrentView('onboarding-step7');
      } else if (path === '/step6' || hash === '#step6' || hash === '#career') {
        setCurrentView('onboarding-step6');
      } else if (path === '/step5' || hash === '#step5' || hash === '#lifestyle') {
        setCurrentView('onboarding-step5');
      } else if (path === '/step4' || hash === '#step4' || hash === '#details') {
        setCurrentView('onboarding-step4');
      } else if (path === '/step3' || hash === '#step3' || hash === '#account') {
        setCurrentView('onboarding-step3');
      } else if (path === '/events' || hash === '#events' || hash === '#guest-events') {
        setStep2Source('events');
        setCurrentView('onboarding-guest-events');
      } else if (path === '/step2' || hash === '#step2' || hash === '#host') {
        setStep2Source('host');
        setCurrentView('onboarding-step2');
      } else if (path === '/join' || hash === '#join') {
        setInitialRole(null);
        setCurrentView('onboarding-step1');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentView === 'onboarding-step1') {
    return (
      <Step1Begin
        initialRole={initialRole}
        onBack={navigateToLanding}
        onJoinAsHostDirect={() => navigateToStep2()}
        onJoinAsGuestDirect={() => navigateToGuestEvents()}
        onContinueToStep2={(data) => {
          // 1. If role is guest OR who you are is Women -> navigate to Guest Events (Where Should The Offer Take Them?)
          // 2. If men and not guest -> navigate to Step 2 Interests
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
        onContinue={(_events) => {
          navigateToStep3();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step2') {
    return (
      <Step2Interests
        onBack={() => navigateToStep1()}
        onContinue={() => navigateToStep3()}
      />
    );
  }

  if (currentView === 'onboarding-step3') {
    return (
      <Step3Account
        userRole={step2Source === 'events' ? 'guest' : 'host'}
        onBack={() => {
          if (step2Source === 'events' || initialRole === 'guest') {
            navigateToGuestEvents();
          } else {
            navigateToStep2();
          }
        }}
        onComplete={() => navigateToStep4()}
        onSignIn={() => navigateToDiscover()}
      />
    );
  }

  if (currentView === 'onboarding-step4') {
    return (
      <Step4Details
        onBack={() => navigateToStep3()}
        onComplete={() => navigateToStep5()}
      />
    );
  }

  if (currentView === 'onboarding-step5') {
    return (
      <Step5Lifestyle
        onBack={() => navigateToStep4()}
        onContinue={() => navigateToStep6()}
      />
    );
  }

  if (currentView === 'onboarding-step6') {
    return (
      <Step6Career
        onBack={() => navigateToStep5()}
        onContinue={() => navigateToStep7()}
      />
    );
  }

  if (currentView === 'onboarding-step7') {
    return (
      <Step7Prompts
        onBack={() => navigateToStep6()}
        onSkip={() => navigateToStep8()}
        onContinue={() => navigateToStep8()}
      />
    );
  }

  if (currentView === 'onboarding-step8') {
    return (
      <Step8Photos
        onBack={() => navigateToStep7()}
        onContinue={(_photos) => {
          navigateToStep9();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step9') {
    return (
      <Step9SelfieVerification
        onBack={() => navigateToStep8()}
        onSkip={() => navigateToLanding()}
        onContinue={() => {
          navigateToStep10();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step10') {
    return (
      <Step10FaceCenterStage
        onBack={() => navigateToStep9()}
        onStartVideoCheck={() => {
          navigateToStep11();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step11') {
    return (
      <Step11VideoChecking
        onBack={() => navigateToStep10()}
        onComplete={() => {
          navigateToStep12();
        }}
      />
    );
  }

  if (currentView === 'onboarding-step12') {
    return (
      <Step12WelcomeHost
        onBack={() => navigateToStep10()}
        onStartHosting={() => {
          navigateToDiscover();
        }}
        onLookAround={() => {
          navigateToDiscover();
        }}
        onBuyNow={() => {
          navigateToDiscover();
        }}
      />
    );
  }

  if (currentView === 'discover') {
    return (
      <DiscoverPage
        onBackToLanding={navigateToLanding}
      />
    );
  }

  return (
    <LandingPage
      onJoinNow={() => navigateToStep1('host')}
      onJoinAsHost={() => navigateToStep2()}
      onJoinAsGuest={() => navigateToStep1('guest')}
    />
  );
}

export default App;
