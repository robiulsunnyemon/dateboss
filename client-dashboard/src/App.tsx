import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { LoginPage } from './pages/LoginPage';
import { TopBar } from './components/TopBar';
import { Sidebar, DashboardSection } from './components/Sidebar';
import { OverviewView } from './pages/OverviewView';
import { VerificationView } from './pages/VerificationView';
import { MembersSubscriptionsView } from './pages/MembersSubscriptionsView';
import { AccountManagementView } from './pages/AccountManagementView';
import { ReportsView } from './pages/ReportsView';
import { SafetyModerationView } from './pages/SafetyModerationView';

function DashboardContent() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pendingCount } = useDashboard();

  return (
    <div className="min-h-screen bg-[#EFE7DA] text-[#16120F] flex flex-col">
      <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          pendingCount={pendingCount}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-5 sm:p-8 max-w-[1360px] w-full">
          {/* Keep sections mounted with CSS visibility for instant 0ms tab switching */}
          <div className={activeSection === 'overview' ? 'block' : 'hidden'}>
            <OverviewView onNavigate={(sec) => setActiveSection(sec)} />
          </div>

          <div className={activeSection === 'verification' ? 'block' : 'hidden'}>
            <VerificationView />
          </div>

          <div className={activeSection === 'members' ? 'block' : 'hidden'}>
            <MembersSubscriptionsView />
          </div>

          <div className={activeSection === 'accounts' ? 'block' : 'hidden'}>
            <AccountManagementView />
          </div>

          <div className={activeSection === 'reports' ? 'block' : 'hidden'}>
            <ReportsView />
          </div>

          <div className={activeSection === 'safety' ? 'block' : 'hidden'}>
            <SafetyModerationView />
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardShell() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFE7DA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="thedateboss"
            className="h-9 w-auto object-contain animate-pulse"
          />
          <p className="text-xs font-medium text-[#6E6A63]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <DashboardShell />
    </AuthProvider>
  );
}

export default App;
