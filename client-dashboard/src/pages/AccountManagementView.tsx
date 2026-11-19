import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Crown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDashboard, AccountItem, AccountStatus } from '../context/DashboardContext';

type FilterTab = 'ALL' | AccountStatus;

export function AccountManagementView() {
  const { accounts, updateAccountStatus } = useDashboard();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activeCount = accounts.filter((a) => a.status === 'Active').length;
  const suspendedCount = accounts.filter((a) => a.status === 'Suspended').length;
  const bannedCount = accounts.filter((a) => a.status === 'Banned').length;

  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return accounts.filter((acc) => {
      const matchesTab = activeTab === 'ALL' || acc.status === activeTab;
      const matchesSearch =
        !q ||
        acc.name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        acc.memberIdCode.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [accounts, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedAccounts = filteredAccounts.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleAccountAction = async (
    id: string,
    action: 'SUSPEND' | 'BAN' | 'RESTORE'
  ) => {
    setOpenMenuId(null);
    await updateAccountStatus(id, action);
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
          Account Management
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] mt-1">
          Thoughtful oversight for a respectful, welcoming community.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'ALL'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>All accounts</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {accounts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Active')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'Active'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Active</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'Active'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {activeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Suspended')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'Suspended'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Suspended</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'Suspended'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {suspendedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Banned')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            activeTab === 'Banned'
              ? 'bg-[#9F1E19] text-white shadow-sm'
              : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] hover:border-[#9F1E19]'
          }`}
        >
          <span>Banned</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'Banned'
                ? 'bg-white/20 text-white'
                : 'bg-[#EFE7DA] text-[#6E6A63]'
            }`}
          >
            {bannedCount}
          </span>
        </button>
      </div>

      {/* Main Card */}
      <div
        ref={menuContainerRef}
        className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-2xl overflow-visible"
      >
        {/* Search Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#E5DDD0]/80">
          <div className="relative w-full sm:max-w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#8A857D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a member..."
              className="w-full bg-[#F5F1E6]/70 border border-[#E5DDD0] rounded-full pl-9 pr-4 py-2 text-xs text-[#16120F] placeholder:text-[#8A857D] focus:outline-none focus:border-[#9F1E19] transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F1E6]/80 border-b border-[#E5DDD0] text-[10px] font-semibold uppercase tracking-wider text-[#6E6A63]">
                <th className="py-3 px-5">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-5 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD0]/70 text-xs">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#6E6A63]">
                    No accounts match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => {
                  const isMenuOpen = openMenuId === account.id;
                  return (
                    <tr
                      key={account.id}
                      className="hover:bg-[#F5F1E6]/60 transition-colors"
                    >
                      {/* Member */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={account.avatar}
                            alt={account.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E5DDD0] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#16120F] truncate">
                              {account.name}
                            </p>
                            <p className="text-[11px] text-[#8A857D] truncate">
                              {account.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#16120F]">
                          <Crown
                            className={`w-3.5 h-3.5 ${
                              account.role === 'Host' ? 'text-[#D48806]' : 'text-[#8A857D]'
                            }`}
                          />
                          <span>{account.role}</span>
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {account.status === 'Active' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                            Active
                          </span>
                        )}
                        {account.status === 'Suspended' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#FDF6E4] border border-[#F2DFB0] text-[#B7791F] text-[11px] font-medium">
                            Suspended
                          </span>
                        )}
                        {account.status === 'Banned' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-[#9F1E19] text-[11px] font-medium">
                            Banned
                          </span>
                        )}
                      </td>

                      {/* Member ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#6E6A63]">
                        {account.memberIdCode}
                      </td>

                      {/* Account Actions */}
                      <td className="py-3.5 px-5 text-right relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === account.id ? null : account.id
                            )
                          }
                          className="p-1.5 rounded-lg text-[#6E6A63] hover:text-[#16120F] hover:bg-[#EFE7DA] transition-colors inline-flex items-center justify-center"
                          aria-label={`Account actions for ${account.name}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-6 top-11 z-40 w-40 bg-[#FAF7F2] border border-[#E5DDD0] rounded-xl shadow-[0_8px_24px_rgba(22,18,15,0.12)] py-1.5 text-left">
                            <button
                              type="button"
                              onClick={() => handleAccountAction(account.id, 'SUSPEND')}
                              className="w-full px-4 py-2 text-xs font-medium text-[#16120F] hover:bg-[#EFE7DA] transition-colors text-left"
                            >
                              Suspend
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAccountAction(account.id, 'BAN')}
                              className="w-full px-4 py-2 text-xs font-medium text-[#9F1E19] hover:bg-[#EFE7DA] transition-colors text-left"
                            >
                              Ban account
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAccountAction(account.id, 'RESTORE')}
                              className="w-full px-4 py-2 text-xs font-medium text-[#16120F] hover:bg-[#EFE7DA] transition-colors text-left"
                            >
                              Restore access
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 border-t border-[#E5DDD0]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6E6A63]">
          <span>
            Showing {paginatedAccounts.length} of {filteredAccounts.length} accounts
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#6E6A63] hover:bg-[#EFE7DA] disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: Math.max(2, totalPages) }).map((_, idx) => {
              const pageNum = idx + 1;
              const isDisabled = pageNum > totalPages;
              const isActive = safePage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#9F1E19] text-white shadow-sm'
                      : isDisabled
                      ? 'text-[#A39E96] cursor-default'
                      : 'text-[#16120F] hover:bg-[#EFE7DA]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#6E6A63] hover:bg-[#EFE7DA] disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
