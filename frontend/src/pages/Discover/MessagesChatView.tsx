import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Send,
  CheckCircle2,
  Check,
} from 'lucide-react';

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  online?: boolean;
  verified?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time?: string;
}

export interface MessagesChatViewProps {
  onClose: () => void;
  initialContactName?: string;
}

// Contact list matching Figma screenshot (media_1794977743525_e2ec0c4f.png)
const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: 'guy',
    name: 'Guy Hawkins',
    avatar: '/assets/julian-gallery-2.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '01:11',
    unreadCount: 5,
    online: true,
    verified: true,
  },
  {
    id: 'kristin',
    name: 'Kristin Watson',
    avatar: '/assets/discover-card-1.jpg',
    lastMessage: "Let's catch up",
    time: '02:11',
    unreadCount: 0,
    online: true,
    verified: false,
  },
  {
    id: 'cameron',
    name: 'Cameron Williamson',
    avatar: '/assets/discover-card-3.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unreadCount: 2,
    online: true,
    verified: false,
  },
  {
    id: 'jacob',
    name: 'Jacob Jones',
    avatar: '/assets/discover-card-2.jpg',
    lastMessage: 'You just matched',
    time: '02:11',
    unreadCount: 0,
    online: true,
    verified: false,
  },
  {
    id: 'brooklyn',
    name: 'Brooklyn Simmons',
    avatar: '/assets/julian-gallery-1.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unreadCount: 1,
    online: true,
    verified: false,
  },
  {
    id: 'savannah',
    name: 'Savannah Nguyen',
    avatar: '/assets/julian-gallery-3.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more than an...',
    time: '02:11',
    unreadCount: 0,
    online: true,
    verified: false,
  },
  {
    id: 'devon',
    name: 'Devon Lane',
    avatar: '/assets/julian-gallery-5.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more than an...',
    time: '02:11',
    unreadCount: 0,
    online: true,
    verified: false,
  },
  {
    id: 'chats',
    name: 'Chats',
    avatar: '/assets/julian-gallery-4.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more than an...',
    time: '02:11',
    unreadCount: 0,
    online: true,
    verified: false,
  },
];

// Active stories avatars matching top row
const STORY_AVATARS = [
  { id: 's1', avatar: '/assets/julian-gallery-1.jpg', online: true },
  { id: 's2', avatar: '/assets/julian-gallery-2.jpg', online: true },
  { id: 's3', avatar: '/assets/discover-card-3.jpg', online: true },
  { id: 's4', avatar: '/assets/discover-card-1.jpg', online: true },
  { id: 's5', avatar: '/assets/discover-card-2.jpg', online: true },
  { id: 's6', avatar: '/assets/face-center-stage.png', online: true },
  { id: 's7', avatar: '/assets/julian-avatar.png', online: false },
];

// Conversation threads
const DEFAULT_CONVERSATIONS: Record<string, ChatMessage[]> = {
  guy: [
    {
      id: 'm1',
      sender: 'them',
      text: 'Good afternoon Sophia. Delighted you accepted the invitation to Caviar Russe.',
    },
    {
      id: 'm2',
      sender: 'them',
      text: 'Thank you Julian! I have been looking forward to trying their new tasting menu. Should we meet directly at the bar?',
    },
    {
      id: 'm3',
      sender: 'me',
      text: 'Yes, exactly. I have asked the sommelier to chill a bottle of 2012 Dom Pérignon for our arrival.',
    },
    {
      id: 'm4',
      sender: 'them',
      text: 'Sounds perfection. See you Friday at 8:30 PM!',
    },
  ],
  jacob: [
    {
      id: 'm1',
      sender: 'them',
      text: 'Hello Julian! Looking forward to connecting.',
    },
  ],
};

const QUICK_REPLIES = [
  'Looking forward to our table!',
  'I will be dressed cocktail elegant.',
  "Let's meet by the lounge bar",
];

export function MessagesChatView({
  onClose,
  initialContactName,
}: MessagesChatViewProps) {
  const [contacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Find initial contact if provided
  const matchedContact = initialContactName
    ? contacts.find((c) =>
        c.name.toLowerCase().includes(initialContactName.toLowerCase())
      )
    : null;

  const [activeContactId, setActiveContactId] = useState<string>(
    matchedContact?.id || 'guy'
  );

  // Mobile view state: default to 'list' unless specifically opened with a contact name!
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(
    initialContactName ? 'chat' : 'list'
  );

  // Messages state
  const [conversations, setConversations] =
    useState<Record<string, ChatMessage[]>>(DEFAULT_CONVERSATIONS);
  const [inputMessage, setInputMessage] = useState('');

  const activeContact =
    contacts.find((c) => c.id === activeContactId) || contacts[0];
  const activeMessages = conversations[activeContactId] || [
    {
      id: 'm-default',
      sender: 'them',
      text: `Hello Julian! Looking forward to connecting.`,
    },
  ];

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: 'Just now',
    };

    setConversations((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));

    setInputMessage('');
  };

  const handleContactClick = (id: string) => {
    setActiveContactId(id);
    setMobileView('chat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] sm:bg-[#EFE7DA] flex flex-col sm:items-center sm:justify-center overflow-hidden font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      
      {/* Desktop Centered Card (sm+) / Mobile Full Viewport (h-full w-full) */}
      <div className="w-full max-w-[1040px] h-[100dvh] sm:h-[88vh] sm:max-h-[820px] sm:min-h-[660px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-0 sm:p-7 lg:p-8 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)] flex flex-col overflow-hidden">
        
        {/* ======================================================== */}
        {/* DESKTOP HEADER (Back button + thedateboss Logo)          */}
        {/* ======================================================== */}
        <div className="hidden sm:flex items-center gap-3 pb-4 border-b border-[#EADBCA]/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Back to Discover"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="flex items-center gap-2 select-none"
          >
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
        </div>

        {/* ======================================================== */}
        {/* MAIN 2-COLUMN (DESKTOP) / SWITCHABLE (MOBILE)            */}
        {/* ======================================================== */}
        <div className="flex-1 flex overflow-hidden sm:pt-4 h-full">
          
          {/* ------------------------------------------------------ */}
          {/* LEFT COLUMN: CHAT LIST                                  */}
          {/* (Visible on desktop always; on mobile when mobileView==='list') */}
          {/* ------------------------------------------------------ */}
          <div
            className={`w-full sm:w-[330px] lg:w-[350px] shrink-0 flex flex-col h-full sm:border-r sm:border-[#EADBCA]/70 overflow-hidden ${
              mobileView === 'list' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Mobile Header: Red Back Button + "Messages" Title (Hidden on desktop) */}
            <div className="sm:hidden p-4 flex items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
                aria-label="Back to Discover"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-serif font-bold text-2xl text-[#16120F] tracking-tight">
                Messages
              </h1>
            </div>

            {/* Search Input */}
            <div className="px-4 sm:px-0 sm:pr-6 mt-1 sm:mt-0 mb-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8A857D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="w-full bg-[#F5EFE6] sm:bg-[#FAF7F2] border border-[#E5DDD0] rounded-full pl-9 pr-4 py-2 text-xs sm:text-[13px] text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
                />
              </div>
            </div>

            {/* Active stories / Online avatars row */}
            <div className="px-4 sm:px-0 sm:pr-6 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none select-none shrink-0">
              {STORY_AVATARS.map((st) => (
                <div key={st.id} className="relative shrink-0 cursor-pointer">
                  <img
                    src={st.avatar}
                    alt="Active contact"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#FAF7F2] shadow-2xs"
                  />
                  {st.online && (
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Section Header: Chats */}
            <div className="px-4 sm:px-0 sm:pr-6 mt-3 mb-2 shrink-0">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#16120F]">
                Chats
              </h2>
            </div>

            {/* Contact Items List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-0 sm:pr-6 space-y-1.5 pb-6">
              {filteredContacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-[20px] cursor-pointer transition-all active:scale-[0.99] ${
                      isActive
                        ? 'bg-[#F5EFE6] border border-[#E09094]/40 shadow-2xs'
                        : 'hover:bg-[#F5EFE6]/70 border border-transparent'
                    }`}
                  >
                    {/* Avatar with online dot */}
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#E5DDD0]"
                      />
                      {contact.online && (
                        <span className="w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-serif font-bold text-sm text-[#16120F] truncate">
                            {contact.name}
                          </span>
                          {contact.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#8A857D] shrink-0 ml-1">
                          {contact.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-[#6E6A63] truncate leading-tight pr-2">
                          {contact.lastMessage}
                        </p>
                        {contact.unreadCount && contact.unreadCount > 0 ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {contact.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* RIGHT COLUMN: OPEN CHAT CONVERSATION                    */}
          {/* (Visible on desktop always; on mobile when mobileView==='chat') */}
          {/* ------------------------------------------------------ */}
          <div
            className={`flex-1 flex flex-col h-full overflow-hidden pl-0 sm:pl-6 ${
              mobileView === 'chat' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Header: Contact Info & Options */}
            <div className="p-3.5 sm:p-0 sm:pb-3.5 border-b border-[#EADBCA]/70 flex items-center justify-between shrink-0 bg-[#FAF7F2]">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile back button: returns to 'list' view */}
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="sm:hidden w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
                  aria-label="Back to messages list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  {activeContact.online && (
                    <span className="w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#16120F] leading-tight truncate">
                    {activeContact.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5">
                    {activeContact.online && (
                      <span className="text-[#22C55E] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                        Online
                      </span>
                    )}
                    {activeContact.verified && (
                      <span className="text-[#3B82F6] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        ID Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 dots menu button */}
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5EFE6] text-[#8A857D] transition-colors cursor-pointer"
                aria-label="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] p-3.5 text-xs sm:text-[13px] leading-relaxed select-text ${
                        isMe
                          ? 'bg-[#9F1E19] text-white rounded-[20px] rounded-tr-xs shadow-2xs'
                          : 'bg-[#FAF7F2] border border-[#E5DDD0] text-[#16120F] rounded-[20px] rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Area: Quick replies + Input bar pinned firmly at bottom */}
            <div className="shrink-0 p-3 sm:p-0 bg-[#FAF7F2] border-t border-[#EADBCA]/50 sm:border-t-0">
              {/* Quick Reply Pills */}
              <div className="pb-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(reply)}
                    className="border border-[#E09094] bg-[#FBEFF0]/50 hover:bg-[#FBEFF0] text-[#9F1E19] text-[11px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors active:scale-95 shrink-0"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input Message Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E5DDD0] rounded-full pl-5 pr-2 py-1.5 focus-within:border-[#9F1E19] transition-colors">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message"
                    className="flex-1 bg-transparent text-xs sm:text-sm text-[#16120F] placeholder-[#8A857D] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-9 h-9 rounded-full bg-[#9F1E19] hover:bg-[#851713] disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer active:scale-95"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MessagesChatView;
