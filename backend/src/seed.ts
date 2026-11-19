import bcrypt from 'bcryptjs';
import { prisma } from './config/db';
import { Role, Gender, TargetGender } from '@prisma/client';

async function main() {
  console.log('[Seed] Seeding TheDateBoss multi-role initial data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Admin (Super Admin Jenny Wilson)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thedateboss.com' },
    update: {
      passwordHash,
      role: Role.ADMIN,
      memberCode: 'TDB-0001',
      nickname: 'Jenny Wilson',
      isVerified: true,
      isActive: true,
      onboardingStep: 12,
    },
    create: {
      email: 'admin@thedateboss.com',
      memberCode: 'TDB-0001',
      passwordHash,
      role: Role.ADMIN,
      nickname: 'Jenny Wilson',
      isVerified: true,
      isActive: true,
      onboardingStep: 12,
    },
  });
  console.log('[Seed] Super Admin created:', admin.email, '| Password: password123');

  // 2. Seed Verified Hosts (Men / Inviter)
  const hostsData = [
    {
      email: 'alexandre.host@thedateboss.com',
      nickname: 'Alexandre',
      age: 35,
      occupation: 'Managing Partner',
      city: 'West End, London',
      bio: 'Passionate about culinary arts, vintage vinyl, and thoughtful date hospitality.',
      idealDate: 'An unhurried tasting menu in Mayfair followed by a private jazz lounge.',
      interests: ['Fine Dining', 'Opera & Theatre', 'Wine Tasting', 'Architecture'],
      lookingFor: ['Dating', 'Long-term'],
      bodyType: 'Athletic',
      heightInches: 72,
      education: 'Graduate degree',
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'No',
      photos: [
        '/assets/discover-card-2.jpg',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      ],
      income: '$250k - $500k',
      netWorth: '$1M - $5M',
    },
    {
      email: 'julian.sterling@thedateboss.com',
      nickname: 'Julian Sterling',
      age: 38,
      occupation: 'Private Equity Managing Director',
      city: 'Upper East Side, NY',
      bio: 'Fond of vintage Bordeaux, competitive polo, and lively discussions on world history. I believe in chivalry, clear intentions, and elevated experiences.',
      idealDate: 'Sunset cocktails overlooking Central Park followed by an intimate Italian dinner.',
      interests: ['Vintage Bordeaux', 'Polo', 'World History', 'Opera'],
      lookingFor: ['Long-term', 'Mentorship', 'Dating'],
      bodyType: 'Muscular',
      heightInches: 74,
      education: 'Graduate degree',
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'Yes',
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        '/assets/discover-card-1.jpg',
      ],
      income: '$500k+',
      netWorth: '$5M+',
    },
    {
      email: 'farhan.ahmed@thedateboss.com',
      nickname: 'Farhan Ahmed',
      age: 31,
      occupation: 'Venture Capital Partner',
      city: 'Tribeca, NY',
      bio: 'Passionate about contemporary art, Michelin dining, and meaningful conversations.',
      idealDate: 'Gallery opening in Chelsea followed by omakase sushi and late-night espresso.',
      interests: ['Michelin Dining', 'Jazz', 'Contemporary Art', 'Sailing', 'Brunch'],
      lookingFor: ['Dating', 'Casual', 'Friendship'],
      bodyType: 'Average',
      heightInches: 70,
      education: "Bachelor's degree",
      smoking: 'Occasionally',
      drinking: 'Occasionally',
      children: 'No',
      photos: [
        '/assets/discover-card-3.jpg',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      ],
      income: '$500k+',
      netWorth: '$5M+',
    },
  ];

  for (const h of hostsData) {
    const hostUser = await prisma.user.upsert({
      where: { email: h.email },
      update: {
        nickname: h.nickname,
        age: h.age,
        locationCity: h.city,
        isVerified: true,
        isIdVerified: true,
        isSelfieVerified: true,
        hostProfile: {
          upsert: {
            update: {
              interests: h.interests,
              lookingFor: h.lookingFor,
              bodyType: h.bodyType,
              heightInches: h.heightInches,
              occupation: h.occupation,
              education: h.education,
              annualIncome: h.income,
              netWorth: h.netWorth,
              smoking: h.smoking,
              drinking: h.drinking,
              children: h.children,
              bio: h.bio,
              idealDate: h.idealDate,
              photos: h.photos,
            },
            create: {
              interests: h.interests,
              lookingFor: h.lookingFor,
              bodyType: h.bodyType,
              heightInches: h.heightInches,
              occupation: h.occupation,
              education: h.education,
              annualIncome: h.income,
              netWorth: h.netWorth,
              smoking: h.smoking,
              drinking: h.drinking,
              children: h.children,
              bio: h.bio,
              idealDate: h.idealDate,
              photos: h.photos,
            },
          },
        },
      },
      create: {
        email: h.email,
        passwordHash,
        role: Role.HOST,
        gender: Gender.MAN,
        targetGender: TargetGender.WOMEN,
        nickname: h.nickname,
        age: h.age,
        locationCity: h.city,
        isVerified: true,
        isIdVerified: true,
        isSelfieVerified: true,
        onboardingStep: 12,
        hostProfile: {
          create: {
            interests: h.interests,
            lookingFor: h.lookingFor,
            bodyType: h.bodyType,
            heightInches: h.heightInches,
            occupation: h.occupation,
            education: h.education,
            annualIncome: h.income,
            netWorth: h.netWorth,
            smoking: h.smoking,
            drinking: h.drinking,
            children: h.children,
            bio: h.bio,
            idealDate: h.idealDate,
            photos: h.photos,
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
    console.log('[Seed] Host created/updated:', hostUser.nickname);
  }

  // 3. Seed Verified Guests of Honor (Women / Invitee)
  const guestsData = [
    {
      email: 'camila@thedateboss.com',
      nickname: 'Camila',
      age: 29,
      city: 'SoHo, New York, NY',
      occupation: 'Creative Producer',
      education: "Bachelor's degree",
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'No',
      bodyType: 'Slender',
      heightInches: 66,
      lookingFor: ['Dating', 'Long-term'],
      bio: 'Long dinners, warm light, no rush. I love thoughtful architecture and hidden wine bars.',
      idealDate: 'Corner table at a candlelit bistro with great conversation and no hurry.',
      outings: ['Weddings', 'Coffee', 'Museums', 'Cooking', 'Day Trips', 'Dinner'],
      photos: [
        '/assets/discover-card-1.jpg',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
      ],
      reliability: 4.9,
    },
    {
      email: 'sophia@thedateboss.com',
      nickname: 'Sophia Laurent',
      age: 28,
      city: 'Upper East Side, NY',
      occupation: 'Brand Director',
      education: 'Graduate degree',
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'No',
      bodyType: 'Athletic',
      heightInches: 68,
      lookingFor: ['Long-term', 'Dating', 'Mentorship'],
      bio: 'Sunset terrace dining, acoustic sessions, and genuine laughs.',
      idealDate: 'Cocktails on a rooftop terrace followed by an acoustic jazz set.',
      outings: ['Dinner', 'Cocktail Lounges', 'Modern Art', 'Tennis'],
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        '/assets/discover-card-3.jpg',
      ],
      reliability: 4.97,
    },
    {
      email: 'elena@thedateboss.com',
      nickname: 'Elena',
      age: 25,
      city: 'West Village, NY',
      occupation: 'Architectural Designer',
      education: 'Graduate degree',
      smoking: 'No',
      drinking: 'No',
      children: 'No',
      bodyType: 'Curvy',
      heightInches: 65,
      lookingFor: ['Dating', 'Friendship', 'Long-term'],
      bio: 'Slow Sunday brunches, vintage bookstores and great wine.',
      idealDate: 'Sunday brunch in the West Village and a stroll through local art galleries.',
      outings: ['Dinner', 'Lunch', 'Brunch', 'Museums & Galleries', 'Concerts'],
      photos: [
        '/assets/discover-card-2.jpg',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
      ],
      reliability: 4.8,
    },
    {
      email: 'maya@thedateboss.com',
      nickname: 'Maya',
      age: 24,
      city: 'Williamsburg, NY',
      occupation: 'Sound Designer & DJ',
      education: "Bachelor's degree",
      smoking: 'Occasionally',
      drinking: 'Yes',
      children: 'No',
      bodyType: 'Average',
      heightInches: 67,
      lookingFor: ['Casual', 'Dating', 'Friendship'],
      bio: 'Art galleries, vinyl records & rooftop views.',
      idealDate: 'Live vinyl listening bar followed by late-night ramen or sushi.',
      outings: ['Dinner', 'Events', 'Festivals & Fairs', 'Arcades'],
      photos: [
        '/assets/discover-card-3.jpg',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
      ],
      reliability: 5.0,
    },
  ];

  for (const g of guestsData) {
    const guestUser = await prisma.user.upsert({
      where: { email: g.email },
      update: {
        nickname: g.nickname,
        age: g.age,
        locationCity: g.city,
        isVerified: true,
        isIdVerified: true,
        isSelfieVerified: true,
        guestProfile: {
          upsert: {
            update: {
              inviteMeToEvents: g.outings,
              lookingFor: g.lookingFor,
              bodyType: g.bodyType,
              heightInches: g.heightInches,
              occupation: g.occupation,
              education: g.education,
              smoking: g.smoking,
              drinking: g.drinking,
              children: g.children,
              bio: g.bio,
              idealDate: g.idealDate,
              photos: g.photos,
              reliabilityScore: g.reliability,
            },
            create: {
              inviteMeToEvents: g.outings,
              lookingFor: g.lookingFor,
              bodyType: g.bodyType,
              heightInches: g.heightInches,
              occupation: g.occupation,
              education: g.education,
              smoking: g.smoking,
              drinking: g.drinking,
              children: g.children,
              bio: g.bio,
              idealDate: g.idealDate,
              photos: g.photos,
              reliabilityScore: g.reliability,
            },
          },
        },
      },
      create: {
        email: g.email,
        passwordHash,
        role: Role.GUEST,
        gender: Gender.WOMAN,
        targetGender: TargetGender.MEN,
        nickname: g.nickname,
        age: g.age,
        locationCity: g.city,
        isVerified: true,
        isIdVerified: true,
        isSelfieVerified: true,
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
            lookingFor: g.lookingFor,
            bodyType: g.bodyType,
            heightInches: g.heightInches,
            occupation: g.occupation,
            education: g.education,
            smoking: g.smoking,
            drinking: g.drinking,
            children: g.children,
            bio: g.bio,
            idealDate: g.idealDate,
            photos: g.photos,
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
    console.log('[Seed] Guest of Honor created/updated:', guestUser.nickname);
  }

  // 4. Seed Demo Members & Verification Requests for Admin Dashboard
  const dashboardDemoMembers = [
    {
      email: 'james.alexander@thedateboss.com',
      nickname: 'James Alexander',
      age: 34,
      role: Role.HOST,
      gender: Gender.MAN,
      city: 'Midtown, New York, NY',
      isVerified: true,
      isIdVerified: true,
      isSelfieVerified: true,
      verificationStatus: 'APPROVED' as const,
      occupation: 'Architectural Partner',
      education: 'Post-doctoral degree',
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'No',
      bodyType: 'Athletic',
      heightInches: 73,
      lookingFor: ['Dating', 'Long-term'],
      interests: ['Architecture', 'Coffee', 'Brunch', 'Museums & Galleries'],
      bio: 'Designing skyline spaces by day, exploring espresso bars and museum exhibits on weekends.',
      idealDate: 'Artisanal brunch in SoHo followed by a private architecture & gallery walk.',
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      email: 'sophia.williams@thedateboss.com',
      nickname: 'Sophia Williams',
      age: 27,
      role: Role.GUEST,
      gender: Gender.WOMAN,
      city: 'Chelsea, New York, NY',
      isVerified: false,
      isIdVerified: false,
      isSelfieVerified: true,
      verificationStatus: 'PENDING' as const,
      occupation: 'Editorial Stylist',
      education: "Bachelor's degree",
      smoking: 'No',
      drinking: 'Occasionally',
      children: 'No',
      bodyType: 'Slender',
      heightInches: 67,
      lookingFor: ['Dating', 'Casual'],
      interests: ['Lunch', 'Coffee', 'Museums & Galleries', 'Wine Tasting'],
      bio: 'Fashion editorials, midday espresso walks, and modern art exhibitions.',
      idealDate: 'Afternoon café lunch and exploring Chelsea art spaces.',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      email: 'daniel.mitchell@thedateboss.com',
      nickname: 'Daniel Mitchell',
      age: 29,
      role: Role.HOST,
      gender: Gender.MAN,
      city: 'Greenwich Village, NY',
      isVerified: true,
      isIdVerified: true,
      isSelfieVerified: true,
      verificationStatus: 'APPROVED' as const,
      occupation: 'Tech Founder & Angel Investor',
      education: "Bachelor's degree",
      smoking: 'No',
      drinking: 'Yes',
      children: 'No',
      bodyType: 'Muscular',
      heightInches: 71,
      lookingFor: ['Dating', 'Casual', 'Discreet affair'],
      interests: ['Fine Dining', 'Sushi', 'Live Music', 'Concerts', 'Cooking'],
      bio: 'Building consumer products, collecting rare Japanese whisky, and catching live acoustic sets.',
      idealDate: 'Chef’s counter sushi omakase followed by an underground jazz show.',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      email: 'olivia.bennett@thedateboss.com',
      nickname: 'Olivia Bennett',
      age: 23,
      role: Role.GUEST,
      gender: Gender.WOMAN,
      city: 'Brooklyn Heights, NY',
      isVerified: false,
      isIdVerified: false,
      isSelfieVerified: false,
      verificationStatus: 'PENDING' as const,
      occupation: 'Classical Cellist',
      education: 'Some college',
      smoking: 'No',
      drinking: 'No',
      children: 'No',
      bodyType: 'Slender',
      heightInches: 64,
      lookingFor: ['Friendship', 'Dating', 'Mentorship'],
      interests: ['Concerts', 'Coffee', 'Walks', 'Theatre'],
      bio: 'Juilliard cellist who loves botanical gardens, quiet cafés, and symphony nights.',
      idealDate: 'A scenic afternoon walk and artisanal tea or evening chamber concert.',
      photos: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
      ],
    },
  ];

  for (const m of dashboardDemoMembers) {
    const member = await prisma.user.upsert({
      where: { email: m.email },
      update: {
        nickname: m.nickname,
        age: m.age,
        locationCity: m.city,
        isVerified: m.isVerified,
        isIdVerified: m.isIdVerified,
        isSelfieVerified: m.isSelfieVerified,
        ...(m.role === Role.HOST
          ? {
              hostProfile: {
                upsert: {
                  update: {
                    occupation: m.occupation,
                    education: m.education,
                    smoking: m.smoking,
                    drinking: m.drinking,
                    children: m.children,
                    bodyType: m.bodyType,
                    heightInches: m.heightInches,
                    lookingFor: m.lookingFor,
                    interests: m.interests,
                    bio: m.bio,
                    idealDate: m.idealDate,
                    photos: m.photos,
                  },
                  create: {
                    occupation: m.occupation,
                    education: m.education,
                    smoking: m.smoking,
                    drinking: m.drinking,
                    children: m.children,
                    bodyType: m.bodyType,
                    heightInches: m.heightInches,
                    lookingFor: m.lookingFor,
                    interests: m.interests,
                    bio: m.bio,
                    idealDate: m.idealDate,
                    photos: m.photos,
                  },
                },
              },
            }
          : {
              guestProfile: {
                upsert: {
                  update: {
                    occupation: m.occupation,
                    education: m.education,
                    smoking: m.smoking,
                    drinking: m.drinking,
                    children: m.children,
                    bodyType: m.bodyType,
                    heightInches: m.heightInches,
                    lookingFor: m.lookingFor,
                    inviteMeToEvents: m.interests,
                    bio: m.bio,
                    idealDate: m.idealDate,
                    photos: m.photos,
                  },
                  create: {
                    occupation: m.occupation,
                    education: m.education,
                    smoking: m.smoking,
                    drinking: m.drinking,
                    children: m.children,
                    bodyType: m.bodyType,
                    heightInches: m.heightInches,
                    lookingFor: m.lookingFor,
                    inviteMeToEvents: m.interests,
                    bio: m.bio,
                    idealDate: m.idealDate,
                    photos: m.photos,
                  },
                },
              },
            }),
      },
      create: {
        email: m.email,
        passwordHash,
        role: m.role,
        gender: m.gender,
        targetGender: m.role === Role.HOST ? TargetGender.WOMEN : TargetGender.MEN,
        nickname: m.nickname,
        age: m.age,
        locationCity: m.city,
        isVerified: m.isVerified,
        isIdVerified: m.isIdVerified,
        isSelfieVerified: m.isSelfieVerified,
        onboardingStep: 12,
        ...(m.role === Role.HOST
          ? {
              hostProfile: {
                create: {
                  occupation: m.occupation,
                  education: m.education,
                  smoking: m.smoking,
                  drinking: m.drinking,
                  children: m.children,
                  bodyType: m.bodyType,
                  heightInches: m.heightInches,
                  lookingFor: m.lookingFor,
                  interests: m.interests,
                  bio: m.bio,
                  idealDate: m.idealDate,
                  photos: m.photos,
                },
              },
              subscription: {
                create: {
                  plan: 'HOST_MONTHLY_PRO',
                  priceCents: 999,
                  status: 'ACTIVE',
                },
              },
            }
          : {
              guestProfile: {
                create: {
                  occupation: m.occupation,
                  education: m.education,
                  smoking: m.smoking,
                  drinking: m.drinking,
                  children: m.children,
                  bodyType: m.bodyType,
                  heightInches: m.heightInches,
                  lookingFor: m.lookingFor,
                  inviteMeToEvents: m.interests,
                  bio: m.bio,
                  idealDate: m.idealDate,
                  photos: m.photos,
                },
              },
              subscription: {
                create: {
                  plan: 'FREE_GUEST_OF_HONOR',
                  priceCents: 0,
                  status: 'ACTIVE',
                },
              },
            }),
      },
    });

    // Ensure at least one verification request exists for this member
    const existingVerif = await prisma.verificationRequest.findFirst({
      where: { userId: member.id },
    });
    if (!existingVerif) {
      await prisma.verificationRequest.create({
        data: {
          userId: member.id,
          selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          faceSnapshotUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          status: m.verificationStatus,
        },
      });
    }
  }

  // 5. Seed Subscription Plans
  await prisma.subscriptionPlan.upsert({
    where: { code: 'GUEST_FREE' },
    update: {},
    create: {
      code: 'GUEST_FREE',
      name: 'Guest of Honor',
      tierLabel: 'Free',
      priceCents: 0,
      priceDisplay: '$0.00/Mo',
      variant: 'guest',
      features: [
        { icon: 'mail', text: 'Receive offers from verified hosts' },
        { icon: 'crown', text: 'Silver crown on your profile' },
        { icon: 'chat', text: 'Chat opens only after you say yes' },
      ],
      footerNote: 'Cancel any time. Guests of honor never pay.',
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { code: 'HOST_PRO' },
    update: {},
    create: {
      code: 'HOST_PRO',
      name: 'Host',
      tierLabel: 'Pro',
      priceCents: 999,
      priceDisplay: '$9.99/Mo',
      variant: 'host',
      features: [
        { icon: 'send', text: 'Send offers to verified Guests of Honor' },
        { icon: 'crown', text: 'Gold crown on your profile' },
        { icon: 'award', text: 'A reliability score that builds trust' },
      ],
      footerNote: 'Cancel any time. Guests of honor never pay.',
    },
  });

  // 6. Seed Curated Venues
  const existingVenuesCount = await prisma.venue.count();
  if (existingVenuesCount === 0) {
    await prisma.venue.createMany({
      data: [
        {
          name: 'Osteria Verde',
          neighborhood: 'Downtown',
          city: 'New York',
          category: 'Dinner',
          description: 'Intimate candlelit Italian dining with curated sommelier wine pairings.',
          priceRange: '$$$',
        },
        {
          name: 'The Velvet Lounge',
          neighborhood: 'Tribeca',
          city: 'New York',
          category: 'Cocktails & Jazz',
          description: 'Live acoustic jazz and signature craft cocktails in a refined setting.',
          priceRange: '$$$',
        },
        {
          name: 'MOMA Sculpture Garden Cafe',
          neighborhood: 'Midtown',
          city: 'New York',
          category: 'Museums',
          description: 'Art-forward daytime espresso and light lunch.',
          priceRange: '$$',
        },
      ],
    });
  }

  // 7. Seed Sample Reports & Flagged Moderation Thread
  const sophia = await prisma.user.findUnique({ where: { email: 'sophia.williams@thedateboss.com' } });
  const daniel = await prisma.user.findUnique({ where: { email: 'daniel.mitchell@thedateboss.com' } });
  const olivia = await prisma.user.findUnique({ where: { email: 'olivia.bennett@thedateboss.com' } });

  if (sophia && daniel && olivia) {
    await prisma.report.upsert({
      where: { code: 'RPT-2084' },
      update: {},
      create: {
        code: 'RPT-2084',
        title: 'Inappropriate behavior',
        priority: 'HIGH',
        description:
          'The member continued sending unwanted messages after I asked them to stop. I would like the conversation reviewed.',
        status: 'NEW',
        reporterId: sophia.id,
        reportedId: daniel.id,
      },
    });

    await prisma.report.upsert({
      where: { code: 'RPT-2083' },
      update: {},
      create: {
        code: 'RPT-2083',
        title: 'Misleading profile',
        priority: 'MEDIUM',
        description:
          'The information on this profile does not appear to match the person I spoke with.',
        status: 'NEW',
        reporterId: olivia.id,
        reportedId: daniel.id,
      },
    });

    const existingFlaggedOffer = await prisma.dateOffer.findFirst({
      where: { threadCode: 'CON-481' },
    });

    if (!existingFlaggedOffer) {
      const flaggedOffer = await prisma.dateOffer.create({
        data: {
          threadCode: 'CON-481',
          hostId: daniel.id,
          guestId: sophia.id,
          activityType: 'Dinner',
          venueName: 'Osteria Verde',
          proposedDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          status: 'ACCEPTED',
          moderationStatus: 'FLAGGED',
          flagReason: 'Repeated unwanted contact',
          flagSubtext: 'Flagged for a thoughtful human review.',
        },
      });

      await prisma.message.createMany({
        data: [
          {
            offerId: flaggedOffer.id,
            senderId: daniel.id,
            receiverId: sophia.id,
            content: 'I really enjoyed our conversation yesterday. Are you free to meet this weekend?',
          },
          {
            offerId: flaggedOffer.id,
            senderId: sophia.id,
            receiverId: daniel.id,
            content: "Thank you, but I don't think we're the right match. Wishing you the best.",
          },
          {
            offerId: flaggedOffer.id,
            senderId: daniel.id,
            receiverId: sophia.id,
            content: "You still haven't replied. I'm going to keep trying.",
            isFlagged: true,
            flagReason: 'Repeated unwanted contact',
          },
        ],
      });
    }
  }

  // 8. Seed Sample DateOffers, Confirmed Dates, Reviews & Appeals for Demo Users
  const alexandre = await prisma.user.findUnique({ where: { email: 'alexandre.host@thedateboss.com' } });
  const julian = await prisma.user.findUnique({ where: { email: 'julian.sterling@thedateboss.com' } });
  const camila = await prisma.user.findUnique({ where: { email: 'camila@thedateboss.com' } });
  const sophiaGuest = await prisma.user.findUnique({ where: { email: 'sophia@thedateboss.com' } });

  if (alexandre && julian && camila && sophiaGuest) {
    const seedOffersCount = await prisma.dateOffer.count({
      where: { hostId: { in: [alexandre.id, julian.id] } },
    });

    if (seedOffersCount === 0) {
      // Pending offer from Alexandre -> Camila
      await prisma.dateOffer.create({
        data: {
          threadCode: 'CON-101',
          hostId: alexandre.id,
          guestId: camila.id,
          activityType: 'Dinner',
          venueName: 'Osteria Verde',
          venueAddress: 'Downtown, New York',
          proposedDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          hospitalityGuarantee: '$150 Escrow Gift',
          personalMessage: 'Would love to host you for an intimate candlelit Italian dinner.',
          expiresAt: new Date(Date.now() + 47 * 60 * 60 * 1000),
          status: 'PENDING',
        },
      });

      // Accepted (Confirmed Date + Chat Unlocked) offer from Alexandre -> Sophia
      const confirmedOffer = await prisma.dateOffer.create({
        data: {
          threadCode: 'CON-102',
          hostId: alexandre.id,
          guestId: sophiaGuest.id,
          activityType: 'Cocktails & Jazz',
          venueName: 'The Velvet Lounge',
          venueAddress: 'Tribeca, New York',
          proposedDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          hospitalityGuarantee: '$200 Escrow Gift',
          personalMessage: 'Looking forward to live acoustic jazz and craft cocktails.',
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          status: 'ACCEPTED',
          hostCheckedIn: true,
        },
      });

      await prisma.message.createMany({
        data: [
          {
            offerId: confirmedOffer.id,
            senderId: alexandre.id,
            receiverId: sophiaGuest.id,
            content: 'Delighted you accepted! Does 8:00 PM at The Velvet Lounge still work well?',
          },
          {
            offerId: confirmedOffer.id,
            senderId: sophiaGuest.id,
            receiverId: alexandre.id,
            content: 'Yes! 8:00 PM sounds wonderful. Looking forward to meeting you.',
          },
        ],
      });

      // Completed offer with Review & Appeal for Julian Sterling -> Camila
      const completedOffer = await prisma.dateOffer.create({
        data: {
          threadCode: 'CON-103',
          hostId: julian.id,
          guestId: camila.id,
          activityType: 'Dinner',
          venueName: 'Le Bernardin',
          venueAddress: '155 W 51st St, New York',
          proposedDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          hospitalityGuarantee: '$250 Escrow Gift',
          personalMessage: 'A refined evening tasting menu.',
          expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          hostCheckedIn: true,
          guestCheckedIn: true,
        },
      });

      const review = await prisma.dateReview.create({
        data: {
          offerId: completedOffer.id,
          reviewerId: camila.id,
          revieweeId: julian.id,
          rating: 5,
          feedback: 'Thoughtful hospitality, punctual arrival, and wonderful conversation.',
        },
      });

      await prisma.appeal.create({
        data: {
          reviewId: review.id,
          userId: julian.id,
          reason: 'Clarifying arrival timing note from earlier itinerary.',
          status: 'ACCEPTED',
          adminNote: 'Verified check-in timestamp; appeal accepted.',
          resolvedAt: new Date(),
        },
      });
    }
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
