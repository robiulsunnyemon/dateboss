import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { TopBar } from './components/TopBar';
import { Sidebar, DashboardSection } from './components/Sidebar';
import { OverviewView } from './pages/OverviewView';
import { VerificationView } from './pages/VerificationView';
import { MembersSubscriptionsView } from './pages/MembersSubscriptionsView';
import { AccountManagementView } from './pages/AccountManagementView';
import { ReportsView } from './pages/ReportsView';
import { SafetyModerationView } from './pages/SafetyModerationView';

function DashboardShell() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(4);

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
          {activeSection === 'overview' && (
            <OverviewView onNavigate={(sec) => setActiveSection(sec)} />
          )}
          {activeSection === 'verification' && (
            <VerificationView onCountChange={(c) => setPendingCount(c)} />
          )}
          {activeSection === 'members' && <MembersSubscriptionsView />}
          {activeSection === 'accounts' && <AccountManagementView />}
          {activeSection === 'reports' && <ReportsView />}
          {activeSection === 'safety' && <SafetyModerationView />}
        </main>
      </div>
    </div>
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
