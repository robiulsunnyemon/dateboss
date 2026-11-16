import React, { useState } from 'react';
import { ViewModeBar, ViewMode } from './components/ViewModeBar';
import { LandingPageContent } from './components/LandingPageContent';
import { DashboardView } from './components/DashboardView';
import { OfferModal } from './components/OfferModal';
import { Wifi, Battery, Signal } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'send' | 'receive' }>({
    isOpen: false,
    mode: 'send'
  });

  const handleOpenOfferModal = (mode: 'send' | 'receive') => {
    setModalState({ isOpen: true, mode });
  };

  return (
    <div className="min-h-screen bg-[#F0ECE1] flex flex-col font-sans">
      
      {/* Top Previewer Controller Bar */}
      <ViewModeBar
        currentMode={viewMode}
        onModeChange={setViewMode}
      />

      {/* Main Container */}
      <main className="flex-1 flex justify-center items-start py-6 px-2 sm:px-4">
        
        {/* VIEW 1: Integrated Dashboard */}
        {viewMode === 'dashboard' && (
          <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-stone-300">
            <DashboardView onBackToLanding={() => setViewMode('desktop')} />
          </div>
        )}

        {/* VIEW 2: Desktop View Mode (1440px framed view) */}
        {viewMode === 'desktop' && (
          <div className="w-full max-w-[1440px] bg-[#FBF8F3] shadow-2xl rounded-2xl overflow-hidden border border-stone-300">
            {/* Desktop browser header bar */}
            <div className="bg-[#EAE4D7] px-4 py-2 border-b border-stone-300 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-stone-500">
                  https://thedateinc.com (Desktop 1440px)
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Desktop View Preview</span>
            </div>

            <LandingPageContent
              onOpenOfferModal={handleOpenOfferModal}
              onOpenDashboard={() => setViewMode('dashboard')}
              isMobileFrame={false}
            />
          </div>
        )}

        {/* VIEW 3: Mobile View Mode (iPhone 390px frame matching Screenshot 2) */}
        {viewMode === 'mobile' && (
          <div className="my-2">
            {/* Realistic Smartphone Shell */}
            <div className="w-[390px] h-[844px] bg-[#121212] p-3 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[5px] border-[#2A2A2A] relative flex flex-col overflow-hidden">
              
              {/* Dynamic Island / Speaker notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-800" />
              </div>

              {/* Mobile Status Bar */}
              <div className="w-full bg-[#FBF8F3] pt-2 pb-1 px-6 flex items-center justify-between text-xs font-semibold text-stone-900 z-30 select-none">
                <span>12:15</span>
                <div className="flex items-center gap-1.5 text-stone-900">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto bg-[#FBF8F3] rounded-b-[38px] scroll-smooth">
                <LandingPageContent
                  onOpenOfferModal={handleOpenOfferModal}
                  onOpenDashboard={() => setViewMode('dashboard')}
                  isMobileFrame={true}
                />
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-400/80 rounded-full z-40" />
            </div>
          </div>
        )}

        {/* VIEW 4: Full Responsive View */}
        {viewMode === 'responsive' && (
          <div className="w-full bg-[#FBF8F3] shadow-lg rounded-xl overflow-hidden border border-stone-200">
            <LandingPageContent
              onOpenOfferModal={handleOpenOfferModal}
              onOpenDashboard={() => setViewMode('dashboard')}
              isMobileFrame={false}
            />
          </div>
        )}

      </main>

      {/* Interactive Modal */}
      <OfferModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'send' })}
        mode={modalState.mode}
      />

    </div>
  );
}

export default App;
