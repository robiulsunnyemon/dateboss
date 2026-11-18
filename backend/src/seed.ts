import bcrypt from 'bcryptjs';
import { prisma } from './config/db';
import { Role, Gender, TargetGender } from '@prisma/client';

async function main() {
  console.log('[Seed] Seeding TheDateBoss multi-role initial data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thedateboss.com' },
    update: {},
    create: {
      email: 'admin@thedateboss.com',
      passwordHash,
      role: Role.ADMIN,
      nickname: 'Head Administrator',
      isVerified: true,
      onboardingStep: 12,
    },
  });
  console.log('[Seed] Admin created:', admin.email);

  // 2. Seed Verified Hosts (Men / Inviter)
  const hostsData = [
    {
      email: 'alexandre.host@thedateboss.com',
      nickname: 'Alexandre',
      occupation: 'Managing Partner',
      city: 'West End, London',
      bio: 'Passionate about culinary arts, vintage vinyl, and thoughtful date hospitality.',
      interests: ['Fine Dining', 'Opera & Theatre', 'Wine Tasting', 'Architecture'],
      image: '/assets/discover-card-2.jpg',
      income: '$250k - $500k',
      netWorth: '$1M - $5M',
    },
    {
      email: 'julian.sterling@thedateboss.com',
      nickname: 'Julian Sterling',
      occupation: 'Private Equity Managing Director',
      city: 'Upper East Side, NY',
      bio: 'Fond of vintage Bordeaux, competitive polo, and lively discussions on world history. I believe in chivalry, clear intentions, and elevated experiences.',
      interests: ['Vintage Bordeaux', 'Polo', 'World History', 'Opera'],
      image: '/assets/discover-card-1.jpg',
      income: '$500k+',
      netWorth: '$5M+',
    },
    {
      email: 'farhan.ahmed@thedateboss.com',
      nickname: 'Farhan Ahmed',
      occupation: 'Venture Capital Partner',
      city: 'Tribeca, NY',
      bio: 'Passionate about contemporary art, Michelin dining, and meaningful conversations.',
      interests: ['Michelin Dining', 'Jazz', 'Contemporary Art', 'Sailing'],
      image: '/assets/discover-card-3.jpg',
      income: '$500k+',
      netWorth: '$5M+',
    },
  ];

  for (const h of hostsData) {
    const hostUser = await prisma.user.upsert({
      where: { email: h.email },
      update: {},
      create: {
        email: h.email,
        passwordHash,
        role: Role.HOST,
        gender: Gender.MAN,
        targetGender: TargetGender.WOMEN,
        nickname: h.nickname,
        locationCity: h.city,
        isVerified: true,
        onboardingStep: 12,
        hostProfile: {
          create: {
            interests: h.interests,
            occupation: h.occupation,
            education: 'Master Degree',
            annualIncome: h.income,
            netWorth: h.netWorth,
            smoking: 'Socially',
            drinking: 'Socially',
            children: 'Someday',
            bio: h.bio,
            photos: [h.image],
          },
        },
        subscription: {
          create: {
            plan: 'HOST_MONTHLY_PRO',
            priceCents: 999,
            status: 'ACTIVE',
          },
        },
      },
    });
    console.log('[Seed] Host created:', hostUser.nickname);
  }

  // 3. Seed Verified Guests of Honor (Women / Invitee)
  const guestsData = [
    {
      email: 'camila@thedateboss.com',
      nickname: 'Camila',
      age: 29,
      occupation: 'Creative Producer',
      bio: 'Long dinners, warm light, no rush.',
      outings: ['Weddings', 'Coffee', 'Museums', 'Cooking', 'Day Trips', 'Dinner'],
      image: '/assets/discover-card-1.jpg',
      reliability: 4.9,
    },
    {
      email: 'sophia@thedateboss.com',
      nickname: 'Sophia Laurent',
      age: 28,
      occupation: 'Brand Director',
      bio: 'Sunset terrace dining, acoustic sessions, and genuine laughs.',
      outings: ['Dinner', 'Cocktail Lounges', 'Modern Art', 'Tennis'],
      image: '/assets/discover-card-3.jpg',
      reliability: 4.97,
    },
    {
      email: 'elena@thedateboss.com',
      nickname: 'Elena',
      age: 27,
      occupation: 'Architectural Designer',
      bio: 'Slow Sunday brunches, vintage bookstores and great wine.',
      outings: ['Dinner', 'Lunch', 'Museums & Galleries', 'Concerts'],
      image: '/assets/discover-card-2.jpg',
      reliability: 4.8,
    },
    {
      email: 'maya@thedateboss.com',
      nickname: 'Maya',
      age: 26,
      occupation: 'Sound Designer & DJ',
      bio: 'Art galleries, vinyl records & rooftop views.',
      outings: ['Dinner', 'Events', 'Festivals & Fairs', 'Arcades'],
      image: '/assets/discover-card-3.jpg',
      reliability: 5.0,
    },
  ];

  for (const g of guestsData) {
    const guestUser = await prisma.user.upsert({
      where: { email: g.email },
      update: {},
      create: {
        email: g.email,
        passwordHash,
        role: Role.GUEST,
        gender: Gender.WOMAN,
        targetGender: TargetGender.MEN,
        nickname: g.nickname,
        locationCity: 'Downtown',
        isVerified: true,
        onboardingStep: 12,
        guestProfile: {
          create: {
            inviteMeToEvents: g.outings,
            customDateIdeas: [
              {
                title: 'Rooftop Sunset Picnic',
                description: 'Blankets, good snacks and a view of the city as the lights come on.',
              },
            ],
            occupation: g.occupation,
            education: 'Bachelor Degree',
            smoking: 'Never',
            drinking: 'Socially',
            children: 'Maybe',
            bio: g.bio,
            photos: [g.image],
            reliabilityScore: g.reliability,
          },
        },
        subscription: {
          create: {
            plan: 'FREE_GUEST_OF_HONOR',
            priceCents: 0,
            status: 'ACTIVE',
          },
        },
      },
    });
    console.log('[Seed] Guest of Honor created:', guestUser.nickname);
  }

  console.log('[Seed] Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
