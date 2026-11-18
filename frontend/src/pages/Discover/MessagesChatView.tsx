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
  unread?: boolean;
  online?: boolean;
  verified?: boolean;
  initials?: string;
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

// Sample contact list matching Figma screenshot
const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: 'farhana',
    name: 'Farhana Ahmed',
    avatar: '/assets/discover-card-2.jpg',
    lastMessage: 'Sounds perfection. See you Friday at 8:30 PM!',
    time: '01:11',
    unread: true,
    online: true,
    verified: true,
  },
  {
    id: 'guy',
    name: 'Guy Hawkins',
    avatar: '/assets/julian-avatar.png',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '01:11',
    unread: true,
    online: true,
    verified: true,
  },
  {
    id: 'kristin',
    name: 'Kristin Watson',
    avatar: '/assets/discover-card-1.jpg',
    lastMessage: "Let's catch up",
    time: '02:11',
    unread: false,
    online: false,
    verified: false,
  },
  {
    id: 'cameron',
    name: 'Cameron Williamson',
    avatar: '/assets/julian-gallery-1.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unread: true,
    online: true,
    verified: false,
  },
  {
    id: 'jacob',
    name: 'Jacob Jones',
    avatar: '/assets/julian-gallery-2.jpg',
    lastMessage: 'You just matched',
    time: '02:11',
    unread: false,
    online: false,
    verified: false,
  },
  {
    id: 'brooklyn',
    name: 'Brooklyn Simmons',
    avatar: '/assets/discover-card-3.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unread: true,
    online: true,
    verified: false,
  },
  {
    id: 'savannah',
    name: 'Savannah Nguyen',
    avatar: '/assets/julian-gallery-3.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unread: false,
    online: false,
    verified: false,
  },
  {
    id: 'devon',
    name: 'Devon Lane',
    avatar: '/assets/julian-gallery-4.jpg',
    lastMessage: 'Have you spoken to the delivery man? He is more tha...',
    time: '02:11',
    unread: false,
    online: false,
    verified: false,
  },
];

// Active stories avatars matching top row
const STORY_AVATARS = [
  { id: 's1', avatar: '/assets/discover-card-1.jpg', online: true },
  { id: 's2', avatar: '/assets/discover-card-2.jpg', online: true },
  { id: 's3', avatar: '/assets/discover-card-3.jpg', online: false },
  { id: 's4', avatar: '/assets/julian-avatar.png', online: true },
  { id: 's5', avatar: '/assets/julian-gallery-1.jpg', online: false },
  { id: 's6', avatar: '/assets/julian-gallery-2.jpg', online: true },
  { id: 's7', avatar: '/assets/julian-gallery-3.jpg', online: false },
];

// Initial conversation matching Figma
const DEFAULT_CONVERSATION: Record<string, ChatMessage[]> = {
  farhana: [
    {
      id: 'm1',
      sender: 'me',
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
  guy: [
    {
      id: 'm1',
      sender: 'them',
      text: 'Have you spoken to the delivery man? He is more than willing to assist with our venue.',
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Yes, all arranged. Looking forward to meeting this weekend.',
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
  
  // Find initial active contact
  const matchedContact = initialContactName
    ? contacts.find((c) =>
        c.name.toLowerCase().includes(initialContactName.toLowerCase())
      )
    : null;

  const [activeContactId, setActiveContactId] = useState<string>(
    matchedContact?.id || 'farhana'
  );

  // Mobile state: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

  // Messages state
  const [conversations, setConversations] =
    useState<Record<string, ChatMessage[]>>(DEFAULT_CONVERSATION);
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
    <div className="min-h-screen w-full bg-[#FAF7F2] sm:bg-[#EFE7DA] py-0 sm:py-8 px-0 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F] animate-in fade-in duration-200">
      
      {/* Centered Desktop Card container / Mobile full width */}
      <div className="w-full max-w-[1040px] bg-[#FAF7F2] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-4 sm:p-7 lg:p-8 shadow-none sm:shadow-[0_10px_35px_rgba(22,18,15,0.05)] flex flex-col min-h-[92vh] sm:min-h-[700px] max-h-[96vh]">
        
        {/* ======================================================== */}
        {/* DESKTOP HEADER (Back button + Logo)                     */}
        {/* ======================================================== */}
        <div className="hidden sm:flex items-center gap-3 pb-5 border-b border-[#EADBCA]/70 shrink-0">
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
        {/* MAIN 2-COLUMN LAYOUT (DESKTOP) / SWITCHABLE (MOBILE)     */}
        {/* ======================================================== */}
        <div className="flex-1 flex overflow-hidden pt-1 sm:pt-4">
          
          {/* ------------------------------------------------------ */}
          {/* LEFT COLUMN: CHAT LIST                                  */}
          {/* (Visible on desktop always; on mobile when mobileView==='list') */}
          {/* ------------------------------------------------------ */}
          <div
            className={`w-full sm:w-[330px] lg:w-[350px] shrink-0 flex flex-col pr-0 sm:pr-6 sm:border-r sm:border-[#EADBCA]/70 overflow-y-auto ${
              mobileView === 'list' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Mobile Header: Red Back Button + "Messages" Title */}
            <div className="flex sm:hidden items-center gap-3 mb-4">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-serif font-bold text-2xl text-[#16120F] tracking-tight">
                Messages
              </h1>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-[#8A857D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name"
                className="w-full bg-[#FAF7F2] border border-[#E5DDD0] rounded-full pl-9 pr-4 py-2 text-xs sm:text-[13px] text-[#16120F] placeholder-[#8A857D] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            {/* Active stories / Online avatars row */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
              {STORY_AVATARS.map((st) => (
                <div key={st.id} className="relative shrink-0 cursor-pointer">
                  <img
                    src={st.avatar}
                    alt="Active contact"
                    className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  {st.online && (
                    <span className="w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Section Header: Chats */}
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#16120F] mt-3 mb-2">
              Chats
            </h2>

            {/* Contact Items List */}
            <div className="space-y-1 overflow-y-auto flex-1 pr-1">
              {filteredContacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                return (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-[18px] cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#F5EFE6] border border-[#E09094]/40 shadow-2xs'
                        : 'hover:bg-[#F5EFE6]/70 border border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E5DDD0]"
                      />
                      {contact.online && (
                        <span className="w-2.5 h-2.5 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-xs sm:text-[13px] text-[#16120F] truncate">
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

                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[11px] text-[#6E6A63] truncate leading-tight pr-2">
                          {contact.lastMessage}
                        </p>
                        {contact.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
                        )}
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
            className={`flex-1 flex flex-col pl-0 sm:pl-6 h-full min-w-0 ${
              mobileView === 'chat' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Header: Contact Info & Options */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EADBCA]/70 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile back button: returns to 'list' view */}
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="sm:hidden w-9 h-9 rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
                  aria-label="Back to messages list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#E5DDD0]"
                  />
                  {activeContact.online && (
                    <span className="w-2 h-2 bg-[#22C55E] border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#16120F] leading-tight truncate">
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
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
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

            {/* Quick Reply Pills */}
            <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
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
              className="pt-1 shrink-0"
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
                  className="w-9 h-9 rounded-full bg-[#9F1E19] hover:bg-[#851713] disabled:opacity-50 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer active:scale-95"
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
  );
}

export default MessagesChatView;
