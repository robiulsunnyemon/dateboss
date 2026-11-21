import React, { useState } from 'react';
import {
  ArrowRight,
  Flag,
  X,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Star,
  Scale,
  XCircle,
} from 'lucide-react';
import {
  useDashboard,
  ReportItem,
  ReportStatus,
  AppealItem,
  AppealStatus,
} from '../context/DashboardContext';

export function ReportsView() {
  const { reports, updateReportStatus, appeals, resolveAppeal } = useDashboard();
  const [sectionMode, setSectionMode] = useState<'reports' | 'appeals'>('reports');

  // Reports state
  const [activeTab, setActiveTab] = useState<ReportStatus>('NEW');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Appeals state
  const [activeAppealTab, setActiveAppealTab] = useState<AppealStatus>('PENDING');
  const [selectedAppeal, setSelectedAppeal] = useState<AppealItem | null>(null);
  const [appealNoteInput, setAppealNoteInput] = useState('');

  const newCount = reports.filter((r) => r.status === 'NEW').length;
  const inReviewCount = reports.filter((r) => r.status === 'IN_REVIEW').length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;

  const pendingAppealsCount = appeals.filter((a) => a.status === 'PENDING').length;
  const acceptedAppealsCount = appeals.filter((a) => a.status === 'ACCEPTED').length;
  const rejectedAppealsCount = appeals.filter((a) => a.status === 'REJECTED').length;

  const filteredReports = reports.filter((r) => r.status === activeTab);
  const filteredAppeals = appeals.filter((a) => a.status === activeAppealTab);

  const openReviewModal = (report: ReportItem) => {
    setSelectedReport(report);
    setNoteInput(report.adminNote || '');
  };

  const handleUpdateStatus = async (id: string, nextStatus: ReportStatus) => {
    const note = noteInput.trim() || undefined;
    setSelectedReport(null);
    setNoteInput('');
    await updateReportStatus(id, nextStatus, note);
  };

  const openAppealModal = (appeal: AppealItem) => {
    setSelectedAppeal(appeal);
    setAppealNoteInput(appeal.adminNote || '');
  };

  const handleResolveAppeal = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    const note = appealNoteInput.trim() || undefined;
    setSelectedAppeal(null);
    setAppealNoteInput('');
    await resolveAppeal(id, status, note);
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
          Reports &amp; Appeals
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Thoughtful oversight for member reports and contested review appeals.
        </p>
      </div>

      {/* Main Switcher: Member Reports vs Review Appeals */}
      <div className="flex items-center gap-3 p-1 bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSectionMode('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            sectionMode === 'reports'
              ? 'bg-[#16120F] text-white shadow-sm'
              : 'text-[#6E6A63] hover:text-[#16120F]'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Member Reports</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              sectionMode === 'reports' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {reports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSectionMode('appeals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            sectionMode === 'appeals'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'text-[#6E6A63] hover:text-[#9F1E19]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Review Appeals</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              sectionMode === 'appeals' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {appeals.length}
          </span>
        </button>
      </div>

      {/* ===================== SECTION 1: MEMBER REPORTS ===================== */}
      {sectionMode === 'reports' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('NEW')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
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
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
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
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
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
        </div>
      )}

      {/* ===================== SECTION 2: REVIEW APPEALS ===================== */}
      {sectionMode === 'appeals' && (
        <div className="space-y-6">
          {/* Appeals Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveAppealTab('PENDING')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeAppealTab === 'PENDING'
                  ? 'bg-[#9F1E19] text-white shadow-sm'
                  : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
              }`}
            >
              <span>Pending appeals</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeAppealTab === 'PENDING'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EFE7DA] text-[#6E6A63]'
                }`}
              >
                {pendingAppealsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAppealTab('ACCEPTED')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeAppealTab === 'ACCEPTED'
                  ? 'bg-[#9F1E19] text-white shadow-sm'
                  : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
              }`}
            >
              <span>Accepted appeals</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeAppealTab === 'ACCEPTED'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EFE7DA] text-[#6E6A63]'
                }`}
              >
                {acceptedAppealsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAppealTab('REJECTED')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeAppealTab === 'REJECTED'
                  ? 'bg-[#9F1E19] text-white shadow-sm'
                  : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
              }`}
            >
              <span>Rejected appeals</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeAppealTab === 'REJECTED'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#EFE7DA] text-[#6E6A63]'
                }`}
              >
                {rejectedAppealsCount}
              </span>
            </button>
          </div>

          {/* Appeals List */}
          {filteredAppeals.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-10 text-center">
              <p className="font-serif font-semibold text-base text-[#16120F]">
                No review appeals in this status
              </p>
              <p className="text-xs text-[#6E6A63] mt-1">
                Contested review appeals submitted by members will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppeals.map((appeal) => {
                const isPending = appeal.status === 'PENDING';
                const isAccepted = appeal.status === 'ACCEPTED';
                return (
                  <div
                    key={appeal.id}
                    className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D6CBB8] transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Scale / Justice Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isAccepted
                            ? 'bg-[#ECFDF5] text-emerald-700 border border-emerald-200'
                            : isPending
                            ? 'bg-[#FBEFF0] text-[#9F1E19] border border-[#F3C5C7]'
                            : 'bg-[#FEF2F2] text-red-600 border border-red-200'
                        }`}
                      >
                        <Scale className="w-4 h-4" />
                      </div>

                      {/* Appeal Content */}
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#16120F]">
                            Appeal: {appeal.reason}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {appeal.status === 'PENDING'
                              ? 'Pending Trust & Safety'
                              : appeal.status === 'ACCEPTED'
                              ? 'Appeal Accepted'
                              : 'Appeal Rejected'}
                          </span>
                        </div>

                        {/* Review snippet being appealed */}
                        <div className="p-3 bg-[#F5F1E6] rounded-xl border border-[#E5DDD0] text-xs max-w-2xl space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#16120F] flex items-center gap-1.5">
                              <img
                                src={appeal.reviewerAvatar}
                                alt={appeal.reviewerName}
                                className="w-4 h-4 rounded-full object-cover border border-[#E5DDD0]"
                              />
                              Review by {appeal.reviewerName}
                            </span>
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < appeal.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-[#D6CBB8]'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[#6E6A63] italic">&quot;{appeal.reviewFeedback}&quot;</p>
                        </div>

                        {/* Appellant Member & Meta */}
                        <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[#6E6A63]">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-[#16120F]">
                            <img
                              src={appeal.userAvatar}
                              alt={appeal.userName}
                              className="w-4 h-4 rounded-full object-cover border border-[#E5DDD0]"
                            />
                            Appealed by {appeal.userName}
                          </span>
                          <span className="font-medium text-[#8A857D]">{appeal.code}</span>
                          <span>· {appeal.timeAgo}</span>
                          {appeal.adminNote && (
                            <span className="text-emerald-700 font-medium">
                              · Note: {appeal.adminNote}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right CTA */}
                    <div className="shrink-0 flex sm:justify-end">
                      <button
                        type="button"
                        onClick={() => openAppealModal(appeal)}
                        className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect appeal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== MODAL 1: REPORT REVIEW MODAL ===================== */}
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
                className="p-1.5 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA] cursor-pointer"
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
                  className="px-4 py-2 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-xs font-semibold text-[#16120F] cursor-pointer"
                >
                  Mark In review
                </button>
              )}
              {selectedReport.status !== 'RESOLVED' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                  className="px-5 py-2 rounded-full bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: REVIEW APPEAL MODAL ===================== */}
      {selectedAppeal && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setSelectedAppeal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl p-6 shadow-xl space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#FBEFF0] border border-[#F3C5C7] text-[#9F1E19] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#16120F]">
                      Review Appeal
                    </h3>
                    <span className="text-[11px] font-semibold text-[#8A857D]">
                      {selectedAppeal.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6A63] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Submitted {selectedAppeal.timeAgo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppeal(null)}
                className="p-1.5 rounded-full text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Appeal Details Card */}
            <div className="p-4 rounded-xl bg-[#F5F1E6] border border-[#E5DDD0] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6E6A63]">Appealing Member</span>
                <span className="font-semibold text-[#16120F] flex items-center gap-1.5">
                  <img
                    src={selectedAppeal.userAvatar}
                    alt={selectedAppeal.userName}
                    className="w-4 h-4 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  {selectedAppeal.userName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#6E6A63]">Original Reviewer</span>
                <span className="font-semibold text-[#16120F] flex items-center gap-1.5">
                  <img
                    src={selectedAppeal.reviewerAvatar}
                    alt={selectedAppeal.reviewerName}
                    className="w-4 h-4 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  {selectedAppeal.reviewerName}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E5DDD0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#6E6A63]">
                    Contested Review Content
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < selectedAppeal.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[#D6CBB8]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#16120F] italic bg-white/70 p-2.5 rounded-lg border border-[#E5DDD0]">
                  &quot;{selectedAppeal.reviewFeedback}&quot;
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5DDD0]">
                <p className="text-[11px] uppercase tracking-wider text-[#9F1E19] font-semibold mb-1">
                  Appeal Ground / Reason
                </p>
                <p className="text-[#16120F] font-medium leading-relaxed bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E5DDD0]">
                  {selectedAppeal.reason}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Trust &amp; Safety Decision Notes
              </label>
              <textarea
                rows={2}
                value={appealNoteInput}
                onChange={(e) => setAppealNoteInput(e.target.value)}
                placeholder="Reasoning for accepting or declining this appeal..."
                className="w-full bg-white border border-[#E5DDD0] rounded-xl p-3 text-xs text-[#16120F] placeholder:text-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-[#E5DDD0]">
              <button
                type="button"
                onClick={() => handleResolveAppeal(selectedAppeal.id, 'REJECTED')}
                className="px-4 py-2 rounded-full bg-white border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Appeal
              </button>

              <button
                type="button"
                onClick={() => handleResolveAppeal(selectedAppeal.id, 'ACCEPTED')}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept Appeal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsView;
