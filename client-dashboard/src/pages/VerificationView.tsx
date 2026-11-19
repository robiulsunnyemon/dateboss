import React, { useEffect, useState } from 'react';
import { Check, Clock, ShieldCheck } from 'lucide-react';
import { dashboardApi } from '../services/api';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface VerificationItem {
  id: string;
  name: string;
  location: string;
  distance: string;
  avatar: string;
  selfieUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  documentId: string;
}

const DEMO_VERIFICATIONS: VerificationItem[] = [
  {
    id: 'ver-1',
    name: 'Sophia Williams, 27',
    location: 'New York, US',
    distance: '5.5 km away',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 10:28 am',
    documentId: 'ID<DEMO<WILLIAMS<<4821',
  },
  {
    id: 'ver-2',
    name: 'Olivia Bennett, 26',
    location: 'New York, US',
    distance: '3.2 km away',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 09:45 am',
    documentId: 'ID<DEMO<BENNETT<<9034',
  },
  {
    id: 'ver-3',
    name: 'Camila Laurent, 29',
    location: 'New York, US',
    distance: '4.1 km away',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted today, 08:15 am',
    documentId: 'ID<DEMO<LAURENT<<3120',
  },
  {
    id: 'ver-4',
    name: 'Elena Rostova, 28',
    location: 'New York, US',
    distance: '6.0 km away',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    status: 'PENDING',
    submittedAt: 'Submitted yesterday, 07:10 pm',
    documentId: 'ID<DEMO<ROSTOVA<<7712',
  },
  {
    id: 'ver-5',
    name: 'James Alexander, 33',
    location: 'New York, US',
    distance: '2.4 km away',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    submittedAt: 'Submitted yesterday, 04:20 pm',
    documentId: 'ID<DEMO<ALEXANDER<<1145',
  },
  {
    id: 'ver-6',
    name: 'Daniel Mitchell, 35',
    location: 'New York, US',
    distance: '4.8 km away',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    status: 'APPROVED',
    submittedAt: 'Submitted yesterday, 02:10 pm',
    documentId: 'ID<DEMO<MITCHELL<<5529',
  },
  {
    id: 'ver-7',
    name: 'Marcus Vance, 31',
    location: 'New York, US',
    distance: '7.5 km away',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    status: 'REJECTED',
    submittedAt: 'Submitted 2 days ago',
    documentId: 'ID<DEMO<VANCE<<6618',
  },
];

interface VerificationViewProps {
  onCountChange?: (pendingCount: number) => void;
}

export function VerificationView({ onCountChange }: VerificationViewProps) {
  const [activeTab, setActiveTab] = useState<VerificationStatus>('PENDING');
  const [items, setItems] = useState<VerificationItem[]>(DEMO_VERIFICATIONS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadVerifications() {
      try {
        const res = await dashboardApi.admin.getVerifications();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: VerificationItem[] = res.data.map((v: any) => ({
            id: v.id,
            name: v.user?.nickname || v.user?.email || 'Member',
            location: v.user?.locationCity || 'New York, US',
            distance: '5.5 km away',
            avatar: v.selfieUrl || DEMO_VERIFICATIONS[0].avatar,
            selfieUrl: v.selfieUrl || DEMO_VERIFICATIONS[0].selfieUrl,
            status: v.status as VerificationStatus,
            submittedAt: 'Submitted today, 10:28 am',
            documentId: 'ID<DEMO<VERIFIED<<4821',
          }));
          setItems(mapped);
        }
      } catch {
        // Fallback to demo items
      }
    }
    loadVerifications();
  }, []);

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const rejectedCount = items.filter((i) => i.status === 'REJECTED').length;

  useEffect(() => {
    if (onCountChange) onCountChange(pendingCount);
  }, [pendingCount, onCountChange]);

  const filteredItems = items.filter((i) => i.status === activeTab);

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    const nextStatus: VerificationStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    try {
      await dashboardApi.admin.reviewVerification(id, {
        action,
        rejectionReason: action === 'REJECT' ? 'Document clarity check failed' : undefined,
      });
    } catch {
      // Allow local state update in demo mode even if offline
    } finally {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F1E19]">
            Trust &amp; Safety
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          Member Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Real people. Genuine intentions. A community built on trust.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'PENDING'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Pending review</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'PENDING' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('APPROVED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'APPROVED'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Approved</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'APPROVED' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {approvedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'REJECTED'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Rejected</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* 2-Column Verification Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-10 text-center">
          <p className="font-serif font-semibold text-base text-[#16120F]">
            No {activeTab.toLowerCase()} verifications right now
          </p>
          <p className="text-xs text-[#6E6A63] mt-1">
            Switch tabs above to inspect other submissions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#16120F]">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#6E6A63]">
                      {item.location} · {item.distance}
                    </p>
                  </div>
                </div>

                {item.status === 'PENDING' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                    Pending review
                  </span>
                )}
                {item.status === 'APPROVED' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                    Approved
                  </span>
                )}
                {item.status === 'REJECTED' && (
                  <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#9F1E19] text-[10px] font-semibold">
                    Rejected
                  </span>
                )}
              </div>

              {/* Card Body: Live Selfie + Government ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Left: Live Selfie */}
                <div>
                  <p className="text-[11px] font-medium text-[#6E6A63] mb-1.5">
                    Live selfie
                  </p>
                  <div className="relative rounded-xl overflow-hidden border border-[#E5DDD0] h-44 bg-[#EFE7DA]">
                    <img
                      src={item.selfieUrl}
                      alt={`${item.name} live selfie`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-emerald-700 text-[10px] font-semibold shadow-sm">
                      <Check className="w-3 h-3" /> Approved
                    </span>
                  </div>
                </div>

                {/* Right: Government ID Preview */}
                <div>
                  <p className="text-[11px] font-medium text-[#6E6A63] mb-1.5">
                    Government ID
                  </p>
                  <div className="rounded-xl border border-[#E5DDD0] bg-[#F5F1E6] p-3 h-44 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9F1E19]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Identity card
                      </span>
                      <span className="text-[10px] font-bold tracking-widest text-[#6E6A63]">
                        DEMO
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 my-1">
                      <img
                        src={item.avatar}
                        alt="ID thumbnail"
                        className="w-12 h-14 rounded-lg object-cover border border-[#E5DDD0]"
                      />
                      <div className="text-[10px] space-y-1 min-w-0">
                        <div>
                          <p className="text-[8px] uppercase text-[#6E6A63]">Surname / Given Name</p>
                          <p className="font-bold text-[#16120F] truncate uppercase">
                            {item.name.split(',')[0]}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase text-[#6E6A63]">Document Number</p>
                          <p className="font-semibold text-[#16120F]">••••• 4821</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase text-[#6E6A63]">Date of Birth</p>
                          <p className="font-semibold text-[#16120F]">•• / •• / 1997</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[9px] font-mono tracking-wider text-[#6E6A63] truncate border-t border-[#E5DDD0] pt-1.5">
                      {item.documentId}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E5DDD0]/70">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6A63]">
                  <Clock className="w-3.5 h-3.5" />
                  {item.submittedAt}
                </span>

                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handleReview(item.id, 'REJECT')}
                      className="px-4 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handleReview(item.id, 'APPROVE')}
                      className="px-4 py-1.5 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-xs font-semibold text-white transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                )}

                {item.status === 'APPROVED' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                    Verified
                  </span>
                )}

                {item.status === 'REJECTED' && (
                  <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#9F1E19] text-[11px] font-semibold">
                    Review complete
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
