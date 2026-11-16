import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/Landing';
import { Step1Begin, Step2Interests } from './pages/Onboarding';
import { UserRole } from './types/onboarding';

export function App() {
  // Routing view state: 'landing' | 'onboarding-step1' | 'onboarding-step2'
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding-step1' | 'onboarding-step2'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
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
      if (path === '/step2' || hash === '#step2' || hash === '#host') {
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
        onContinue={navigateToLanding}
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
