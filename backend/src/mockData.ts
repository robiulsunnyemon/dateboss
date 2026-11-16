import { DateOffer, Venue, Testimonial, FaqItem, DashboardMetric } from './types';

export const initialOffers: DateOffer[] = [
  {
    id: 'offer-1',
    senderName: 'Julian Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    recipientName: 'Claire Dupont',
    recipientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Dinner For Two',
    activityType: 'Dinner',
    venueName: 'The River Café, Brooklyn',
    venueAddress: '1 Water St, Brooklyn, NY 11201',
    dateTime: 'Friday, Nov 10 • 7:30 PM',
    budgetSplit: 'sender_pays',
    estimatedCost: '$150 - $200',
    customNote: 'Great wine list and view of Manhattan skyline. Looking forward to meeting you!',
    status: 'pending',
    expiresAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    isConfirmedDayBefore: false,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'offer-2',
    senderName: 'Marcus Sterling',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    recipientName: 'Elena Rostova',
    recipientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Cocktails & Jazz',
    activityType: 'Drinks',
    venueName: 'Bemelmans Bar',
    venueAddress: '35 E 76th St, New York, NY 10021',
    dateTime: 'Saturday, Nov 11 • 8:00 PM',
    budgetSplit: 'split_50_50',
    estimatedCost: '$90 - $120',
    customNote: 'Classic piano jazz and martinis.',
    status: 'accepted',
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    isConfirmedDayBefore: true,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'offer-3',
    senderName: 'Sophia Lin',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    recipientName: 'Daniel Hayes',
    recipientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'Modern Art & Espresso',
    activityType: 'Coffee',
    venueName: 'Whitney Museum & Studio Cafe',
    venueAddress: '99 Gansevoort St, New York, NY 10014',
    dateTime: 'Sunday, Nov 12 • 2:00 PM',
    budgetSplit: 'sender_pays',
    estimatedCost: '$60 - $80',
    customNote: 'Checking out the biennial exhibition then artisanal espresso.',
    status: 'countered',
    counterProposal: {
      suggestedTime: 'Sunday, Nov 12 • 3:30 PM',
      note: 'Can we do 3:30 PM? Have a gym class right before!'
    },
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    isConfirmedDayBefore: false,
    createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
  },
  {
    id: 'offer-4',
    senderName: 'Liam O\'Connor',
    senderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    recipientName: 'Chloe Bennett',
    recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Rooftop Wine Tasting',
    activityType: 'Drinks',
    venueName: 'Westlight Rooftop',
    venueAddress: '111 N 12th St, Brooklyn, NY 11249',
    dateTime: 'Thursday, Nov 16 • 6:45 PM',
    budgetSplit: 'split_50_50',
    estimatedCost: '$110 - $140',
    status: 'completed',
    expiresAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    isConfirmedDayBefore: true,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
  }
];

export const venues: Venue[] = [
  {
    id: 'v-1',
    name: 'The River Café',
    category: 'Fine Dining & Waterfront',
    neighborhood: 'DUMBO, Brooklyn',
    city: 'New York',
    priceRange: '$$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    isVerifiedPublic: true
  },
  {
    id: 'v-2',
    name: 'Bemelmans Bar',
    category: 'Cocktail Lounge & Live Piano',
    neighborhood: 'Upper East Side',
    city: 'New York',
    priceRange: '$$$',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    isVerifiedPublic: true
  },
  {
    id: 'v-3',
    name: 'Lilia Ristorante',
    category: 'Handcrafted Pasta & Italian',
    neighborhood: 'Williamsburg',
    city: 'New York',
    priceRange: '$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    isVerifiedPublic: true
  },
  {
    id: 'v-4',
    name: 'Gramercy Tavern',
    category: 'Contemporary American',
    neighborhood: 'Flatiron',
    city: 'New York',
    priceRange: '$$$$',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80',
    isVerifiedPublic: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote: 'Instead of texting "hey" back and forth for three weeks, Liam sent an offer for tapas on Wednesday night. We met, hit it off instantly, and have been dating for 6 months now. It removes all the awkward guessing games.',
    author: 'Sarah Jenkins',
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    dateType: 'Dinner Offer'
  },
  {
    id: 't-2',
    quote: 'The 48-hour expiration rule is a lifesaver. No more dead matches cluttering my inbox. People here are actually serious about meeting in the real world rather than collecting pen pals.',
    author: 'Michael Chen',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    dateType: 'Drinks & Jazz'
  },
  {
    id: 't-3',
    quote: 'Knowing exactly who is paying or splitting beforehand eliminated the weird bill-dance at dinner. Everything was transparent, respectful, and the venue was incredible.',
    author: 'Emma & Liam',
    location: 'Chicago, IL',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    dateType: 'Italian Bistro'
  }
];

export const faqs: FaqItem[] = [
  {
    id: 'f-1',
    question: 'What happens if I decline an offer?',
    answer: 'Declining an offer is simple and respectful. You can pass with one click, or use the "Counter" button to suggest an alternative time, date, or venue if you are interested in meeting but the details do not work for your schedule.',
    category: 'Offers'
  },
  {
    id: 'f-2',
    question: 'Is this an escort or paid companionship service?',
    answer: 'No, absolutely not. The Date Inc is strictly a premium dating platform designed for genuine romantic connections. Offers refer exclusively to date proposals (such as picking a restaurant, drinks venue, or activity and clarifying who hosts or splits the bill). We have zero tolerance for transactional or compensated dating.',
    category: 'Safety & Policy'
  },
  {
    id: 'f-3',
    question: 'What happens if someone doesn\'t show up?',
    answer: 'We have a strict Anti-Ghosting policy. Both parties must re-confirm 24 hours prior. Unexcused no-shows result in a rating penalty and temporary or permanent account suspension. Our verified no-show rate is below 1.8%.',
    category: 'Anti-Ghosting'
  },
  {
    id: 'f-4',
    question: 'Can I switch between Send and Receive Offers?',
    answer: 'Yes! Every member has full flexibility. You can initiate date offers to people you fancy, or switch to passive mode to simply review and answer incoming invitations from verified matches.',
    category: 'Account'
  }
];

export const dashboardMetrics: DashboardMetric = {
  totalOffers: 14280,
  activeOffers: 842,
  acceptedRate: 74.6,
  antiGhostingCompletionRate: 98.4,
  avgResponseHours: 6.2,
  verifiedVenuesCount: 320,
  weeklyRevenue: 48650
};
