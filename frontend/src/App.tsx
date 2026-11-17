import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/Landing';
import {
  Step1Begin,
  Step2Interests,
  Step3Account,
  Step4Details,
  Step5Lifestyle,
  Step6Career,
  Step7Prompts,
  Step8Photos,
} from './pages/Onboarding';
import { UserRole } from './types/onboarding';

export function App() {
  // Routing view state: 'landing' | 'onboarding-step1' .. 'onboarding-step8'
  const [currentView, setCurrentView] = useState<
    | 'landing'
    | 'onboarding-step1'
    | 'onboarding-step2'
    | 'onboarding-step3'
    | 'onboarding-step4'
    | 'onboarding-step5'
    | 'onboarding-step6'
    | 'onboarding-step7'
    | 'onboarding-step8'
  >(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/step8' || hash === '#step8' || hash === '#photos') return 'onboarding-step8';
      if (path === '/step7' || hash === '#step7' || hash === '#prompts') return 'onboarding-step7';
      if (path === '/step6' || hash === '#step6' || hash === '#career') return 'onboarding-step6';
      if (path === '/step5' || hash === '#step5' || hash === '#lifestyle') return 'onboarding-step5';
      if (path === '/step4' || hash === '#step4' || hash === '#details') return 'onboarding-step4';
      if (path === '/step3' || hash === '#step3' || hash === '#account') return 'onboarding-step3';
      if (path === '/step2' || hash === '#step2' || hash === '#host') return 'onboarding-step2';
      if (path === '/join' || hash === '#join') return 'onboarding-step1';
    }
    return 'landing';
  });

  const [initialRole, setInitialRole] = useState<UserRole>('host');

  const navigateToStep1 = (role: UserRole = 'host') => {
    setInitialRole(role);
    setCurrentView('onboarding-step1');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'onboarding-step1' }, '', '#join');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToStep2 = () => {
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
      if (path === '/step8' || hash === '#step8' || hash === '#photos') {
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
      } else if (path === '/step2' || hash === '#step2' || hash === '#host') {
        setCurrentView('onboarding-step2');
      } else if (path === '/join' || hash === '#join') {
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
        onContinueToStep2={() => navigateToStep2()}
      />
    );
  }

  if (currentView === 'onboarding-step2') {
    return (
      <Step2Interests
        onBack={() => navigateToStep1('host')}
        onContinue={() => navigateToStep3()}
      />
    );
  }

  if (currentView === 'onboarding-step3') {
    return (
      <Step3Account
        onBack={() => navigateToStep2()}
        onComplete={() => navigateToStep4()}
        onSignIn={navigateToLanding}
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
          navigateToLanding();
        }}
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
