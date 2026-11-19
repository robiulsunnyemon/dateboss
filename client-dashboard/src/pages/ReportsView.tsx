import React, { useState, useEffect } from 'react';
import { ArrowRight, Flag, X, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { dashboardApi } from '../services/api';

type ReportStatus = 'NEW' | 'IN_REVIEW' | 'RESOLVED';
type ReportPriority = 'High priority' | 'Medium priority' | 'Low priority';

interface ReportItem {
  id: string;
  code: string;
  title: string;
  priority: ReportPriority;
  description: string;
  reportedName: string;
  reportedAvatar: string;
  reporterName: string;
  timeAgo: string;
  status: ReportStatus;
  adminNote?: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rpt-1',
    code: 'RPT-2084',
    title: 'Inappropriate behavior',
    priority: 'High priority',
    description:
      'The member continued sending unwanted messages after I asked them to stop. I would like the conversation reviewed.',
    reportedName: 'William Carter',
    reportedAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Sophia Williams',
    timeAgo: '12 minutes ago',
    status: 'NEW',
  },
  {
    id: 'rpt-2',
    code: 'RPT-2083',
    title: 'Misleading profile',
    priority: 'Medium priority',
    description:
      'The information on this profile does not appear to match the person I spoke with. Their age and location may be inaccurate.',
    reportedName: 'Oliver Thompson',
    reportedAvatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Olivia Bennett',
    timeAgo: '34 minutes ago',
    status: 'NEW',
  },
  {
    id: 'rpt-3',
    code: 'RPT-2082',
    title: 'Suspicious activity',
    priority: 'High priority',
    description:
      'This member shared an external link and asked me to continue our conversation on another website.',
    reportedName: 'Daniel Mitchell',
    reportedAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Emma Laurent',
    timeAgo: '1 hour ago',
    status: 'NEW',
  },
  {
    id: 'rpt-4',
    code: 'RPT-2079',
    title: 'Unconfirmed cancellation',
    priority: 'Medium priority',
    description:
      'Member cancelled the confirmed dinner reservation less than 2 hours before the scheduled time without notice.',
    reportedName: 'Marcus Vance',
    reportedAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Camila Laurent',
    timeAgo: 'Yesterday',
    status: 'IN_REVIEW',
    adminNote: 'Checking 24-hour check-in logs and reliability hold status.',
  },
  {
    id: 'rpt-5',
    code: 'RPT-2075',
    title: 'Off-platform solicitation',
    priority: 'High priority',
    description:
      'Reported for requesting payment outside the platform ecosystem prior to meeting at a public venue.',
    reportedName: 'Lucas Meyer',
    reportedAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    reporterName: 'Isabella Rose',
    timeAgo: '2 days ago',
    status: 'RESOLVED',
    adminNote: 'Account suspended following Trust & Safety review.',
  },
];

export function ReportsView() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<ReportStatus>('NEW');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await dashboardApi.admin.getReports();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ReportItem[] = res.data.map((r: any) => ({
            id: r.id,
            code: r.code || 'RPT-2000',
            title: r.title,
            priority:
              r.priority === 'HIGH'
                ? 'High priority'
                : r.priority === 'LOW'
                ? 'Low priority'
                : 'Medium priority',
            description: r.description,
            reportedName: r.reported?.nickname || r.reported?.email || 'Member',
            reportedAvatar:
              r.reported?.hostProfile?.photos?.[0] ||
              r.reported?.guestProfile?.photos?.[0] ||
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            reporterName: r.reporter?.nickname || r.reporter?.email || 'Member',
            timeAgo: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently',
            status: (r.status as ReportStatus) || 'NEW',
            adminNote: r.adminNote || undefined,
          }));
          setReports(mapped);
        }
      } catch {
        // Fallback to demo reports if offline
      }
    }
    loadReports();
  }, []);

  const newCount = reports.filter((r) => r.status === 'NEW').length;
  const inReviewCount = reports.filter((r) => r.status === 'IN_REVIEW').length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;

  const filteredReports = reports.filter((r) => r.status === activeTab);

  const openReviewModal = (report: ReportItem) => {
    setSelectedReport(report);
    setNoteInput(report.adminNote || '');
  };

  const handleUpdateStatus = async (id: string, nextStatus: ReportStatus) => {
    const note = noteInput.trim() || undefined;
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: nextStatus,
              adminNote: note || r.adminNote,
            }
          : r
      )
    );
    setSelectedReport(null);
    setNoteInput('');

    try {
      await dashboardApi.admin.updateReport(id, {
        status: nextStatus,
        adminNote: note,
      });
    } catch {
      // Keep optimistic update in demo mode
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
          <span className="text-[11px] font-semibold text-[#9F1E19] tracking-wide">
            A Community Worth Caring for
          </span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-[28px] text-[#16120F] leading-tight">
          Reports
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Thoughtful oversight for a respectful, welcoming community.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('NEW')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'NEW'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>New reports</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'NEW' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {newCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('IN_REVIEW')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'IN_REVIEW'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>In review</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'IN_REVIEW'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {inReviewCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('RESOLVED')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'RESOLVED'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Resolved</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'RESOLVED'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-10 text-center">
          <p className="font-serif font-semibold text-base text-[#16120F]">
            No reports in this queue
          </p>
          <p className="text-xs text-[#6E6A63] mt-1">
            Switch tabs above to inspect other report statuses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isHigh = report.priority === 'High priority';
            return (
              <div
                key={report.id}
                className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D6CBB8] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Left Priority Flag Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isHigh
                        ? 'bg-[#FBEFF0] text-[#9F1E19] border border-[#F3C5C7]'
                        : 'bg-[#FDF6E4] text-[#B7791F] border border-[#F2DFB0]'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </div>

                  {/* Report Content */}
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F]">
                        {report.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isHigh
                            ? 'bg-[#FBEFF0] border border-[#F3C5C7] text-[#9F1E19]'
                            : 'bg-[#FDF6E4] border border-[#F2DFB0] text-[#B7791F]'
                        }`}
                      >
                        {report.priority}
                      </span>
                    </div>

                    <p className="text-xs text-[#6E6A63] leading-relaxed max-w-2xl">
                      {report.description}
                    </p>

                    <div className="pt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[#6E6A63]">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#16120F]">
                        <img
                          src={report.reportedAvatar}
                          alt={report.reportedName}
                          className="w-4 h-4 rounded-full object-cover border border-[#E5DDD0]"
                        />
                        {report.reportedName}
                      </span>
                      <span>Reported by {report.reporterName}</span>
                      <span className="font-medium text-[#8A857D]">{report.code}</span>
                      <span>· {report.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="shrink-0 flex sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openReviewModal(report)}
                    className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Review report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Review Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-6 shadow-xl space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#FBEFF0] border border-[#F3C5C7] text-[#9F1E19] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#16120F]">
                      {selectedReport.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#8A857D]">
                      {selectedReport.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6A63] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {selectedReport.timeAgo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6E6A63]">Reported Member</span>
                <span className="font-semibold text-[#16120F]">
                  {selectedReport.reportedName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6E6A63]">Reported By</span>
                <span className="font-semibold text-[#16120F]">
                  {selectedReport.reporterName}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E5DDD0]">
                <p className="text-[11px] uppercase tracking-wider text-[#6E6A63] mb-1">
                  Report Statement
                </p>
                <p className="text-[#16120F] leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Moderation Notes
              </label>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add internal review notes or resolution details..."
                className="w-full bg-white border border-[#E5DDD0] rounded-xl p-3 text-xs text-[#16120F] placeholder:text-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#E5DDD0]">
              {selectedReport.status !== 'IN_REVIEW' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'IN_REVIEW')}
                  className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F]"
                >
                  Mark In review
                </button>
              )}
              {selectedReport.status !== 'RESOLVED' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                  className="px-5 py-2 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve report
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
