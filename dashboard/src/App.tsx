import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  ShieldCheck,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Search,
  Filter,
  DollarSign,
  Sparkles,
  RefreshCw,
  Users
} from 'lucide-react';

interface DateOffer {
  id: string;
  senderName: string;
  senderAvatar: string;
  recipientName: string;
  recipientAvatar: string;
  title: string;
  activityType: string;
  venueName: string;
  dateTime: string;
  budgetSplit: string;
  estimatedCost: string;
  status: 'pending' | 'accepted' | 'countered' | 'passed' | 'completed';
  expiresHoursLeft: number;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'offers' | 'venues' | 'ghosting'>('offers');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [offers, setOffers] = useState<DateOffer[]>([
    {
      id: 'NY-9021',
      senderName: 'Julian Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      recipientName: 'Claire Dupont',
      recipientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      title: 'Dinner For Two',
      activityType: 'Dinner',
      venueName: 'The River Café, Brooklyn',
      dateTime: 'Friday, Nov 10 • 7:30 PM',
      budgetSplit: 'Sender covers ($150 - $200)',
      estimatedCost: '$180',
      status: 'pending',
      expiresHoursLeft: 36
    },
    {
      id: 'NY-8842',
      senderName: 'Marcus Sterling',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      recipientName: 'Elena Rostova',
      recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      title: 'Cocktails & Jazz',
      activityType: 'Drinks',
      venueName: 'Bemelmans Bar',
      dateTime: 'Saturday, Nov 11 • 8:00 PM',
      budgetSplit: 'Split 50/50',
      estimatedCost: '$110',
      status: 'accepted',
      expiresHoursLeft: 48
    },
    {
      id: 'NY-7910',
      senderName: 'Sophia Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      recipientName: 'Daniel Hayes',
      recipientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      title: 'Modern Art & Espresso',
      activityType: 'Museum',
      venueName: 'Whitney Museum & Studio Cafe',
      dateTime: 'Sunday, Nov 12 • 2:00 PM',
      budgetSplit: 'Sender covers ($60 - $80)',
      estimatedCost: '$75',
      status: 'countered',
      expiresHoursLeft: 18
    },
    {
      id: 'NY-6540',
      senderName: 'Liam O\'Connor',
      senderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      recipientName: 'Chloe Bennett',
      recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      title: 'Rooftop Sunset Tasting',
      activityType: 'Drinks',
      venueName: 'Westlight Rooftop',
      dateTime: 'Thursday, Nov 16 • 6:45 PM',
      budgetSplit: 'Split 50/50',
      estimatedCost: '$130',
      status: 'completed',
      expiresHoursLeft: 0
    }
  ]);

  const venues = [
    {
      id: 'v1',
      name: 'The River Café',
      location: 'DUMBO, Brooklyn',
      tier: '$$$$',
      rating: 4.9,
      datesHosted: 482,
      safetyStatus: 'Verified Public'
    },
    {
      id: 'v2',
      name: 'Bemelmans Bar',
      location: 'Upper East Side',
      tier: '$$$',
      rating: 4.8,
      datesHosted: 365,
      safetyStatus: 'Verified Public'
    },
    {
      id: 'v3',
      name: 'Lilia Ristorante',
      location: 'Williamsburg',
      tier: '$$$',
      rating: 4.9,
      datesHosted: 290,
      safetyStatus: 'Verified Public'
    },
    {
      id: 'v4',
      name: 'Gramercy Tavern',
      location: 'Flatiron',
      tier: '$$$$',
      rating: 4.8,
      datesHosted: 215,
      safetyStatus: 'Verified Public'
    }
  ];

  const filteredOffers = offers.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: DateOffer['status']) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-stone-900 font-sans flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#8A1B22] text-[#F6E7D0] flex items-center justify-center font-serif italic font-bold shadow-sm">
                d
              </span>
              <span className="font-serif font-bold text-xl text-stone-900">
                thedate<span className="text-[#8A1B22]">inc</span>
              </span>
            </div>
            <span className="bg-stone-100 text-stone-600 text-xs px-2.5 py-1 rounded-md font-medium border border-stone-200">
              Admin & Analytics Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#8A1B22] px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <span>View Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="w-8 h-8 rounded-full bg-[#8A1B22]/10 border border-[#8A1B22]/30 flex items-center justify-center text-xs font-bold text-[#8A1B22]">
              AD
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8 w-full">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Total Proposals
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">14,280</h3>
              <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Anti-Ghosting Rate
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">98.4%</h3>
              <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 24h Confirmation Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Acceptance Rate
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">74.6%</h3>
              <p className="text-xs font-medium text-stone-500 mt-1 flex items-center gap-1">
                Avg reply: <strong>6.2 hrs</strong>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#8A1B22] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Weekly Volume
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">$48,650</h3>
              <p className="text-xs font-medium text-stone-500 mt-1">
                320 Verified Venues
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'offers'
                ? 'bg-[#8A1B22] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Date Offers Pipeline ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'venues'
                ? 'bg-[#8A1B22] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Verified Venues ({venues.length})
          </button>
          <button
            onClick={() => setActiveTab('ghosting')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'ghosting'
                ? 'bg-[#8A1B22] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Anti-Ghosting Protocol
          </button>
        </div>

        {/* TAB 1: Date Offers Pipeline */}
        {activeTab === 'offers' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            
            {/* Table Filters & Search */}
            <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sender, recipient, venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8A1B22]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-stone-500 font-medium">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-700 focus:outline-none"
                >
                  <option value="all">All Offers</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="countered">Countered</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Offer ID & Title</th>
                    <th className="py-3 px-4">Participants</th>
                    <th className="py-3 px-4">Venue & Time</th>
                    <th className="py-3 px-4">Bill Terms</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredOffers.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] text-stone-500 block">
                          #{item.id}
                        </span>
                        <span className="font-semibold text-stone-900 text-sm block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {item.activityType}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.senderAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-stone-200"
                          />
                          <span className="font-medium">{item.senderName}</span>
                          <span className="text-stone-400">➔</span>
                          <img
                            src={item.recipientAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-stone-200"
                          />
                          <span className="font-medium">{item.recipientName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-medium text-stone-900">
                          <MapPin className="w-3.5 h-3.5 text-[#8A1B22]" />
                          <span>{item.venueName}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {item.dateTime}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-stone-900">{item.estimatedCost}</span>
                        <span className="block text-[11px] text-stone-500">{item.budgetSplit}</span>
                      </td>

                      <td className="py-4 px-4">
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            <Clock className="w-3 h-3" /> Awaiting ({item.expiresHoursLeft}h)
                          </span>
                        )}
                        {item.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Accepted & Chat Open
                          </span>
                        )}
                        {item.status === 'countered' && (
                          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                            <RefreshCw className="w-3 h-3" /> Counter Proposed
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Date Completed
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'accepted')}
                                className="bg-[#8A1B22] text-white px-2.5 py-1 rounded font-semibold text-[11px] hover:bg-[#6E1118]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'passed')}
                                className="bg-stone-100 text-stone-700 px-2 py-1 rounded font-medium text-[11px] hover:bg-stone-200"
                              >
                                Pass
                              </button>
                            </>
                          )}
                          {item.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'pending')}
                              className="text-stone-500 hover:text-stone-800 text-[11px] underline"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: Verified Venues */}
        {activeTab === 'venues' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-base">{venue.name}</h4>
                    <p className="text-stone-500 text-xs">{venue.location}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {venue.safetyStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex justify-between">
                    <span>Price Tier:</span>
                    <strong className="text-stone-900">{venue.tier}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <strong className="text-amber-600">★ {venue.rating}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dates Hosted:</span>
                    <strong className="text-stone-900">{venue.datesHosted}</strong>
                  </div>
                </div>

                <button className="w-full bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold py-2 rounded-lg border border-stone-200 transition-colors">
                  View Venue Agreement
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Anti-Ghosting Protocol */}
        {activeTab === 'ghosting' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                The Anti-Ghosting Guarantee System
              </h3>
              <p className="text-stone-600 text-sm">
                How our algorithm and operational workflows keep ghosting rates under 1.8% across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-stone-50">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Clock className="w-4 h-4 text-[#8A1B22]" />
                  <span>1. 48-Hour Hard Expiration</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Every proposal is auto-canceled if unaddressed in 48 hours. No stale chats or dangling threads.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-stone-50">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. 24-Hour Re-Confirmation</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Automated push notifications sent 24 hours prior. Both sides must tap "I Am Going" to finalize.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-stone-50">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>3. Accountability Strikes</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Unexcused no-shows immediately penalize trust score and result in a 30-day suspension.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} The Date Inc Platform Operations • Connected to Backend API
      </footer>

    </div>
  );
}

export default App;
