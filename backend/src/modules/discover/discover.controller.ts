import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AccountStatus, Role, SubscriptionStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function parseHeightToInches(val: unknown): number | undefined {
  if (val == null || val === '') return undefined;
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  const str = String(val).trim();
  if (/^\d+$/.test(str)) {
    const n = Number(str);
    return n >= 48 && n <= 90 ? n : undefined;
  }
  const match = str.match(/(\d+)\s*'\s*(\d+)?/);
  if (match) {
    const feet = Number(match[1]);
    const inches = match[2] ? Number(match[2]) : 0;
    return feet * 12 + inches;
  }
  return undefined;
}

export function formatHeightInches(inches: number | null | undefined, fallback = '5\'09"'): string {
  if (!inches || Number.isNaN(inches)) return fallback;
  const feet = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${feet}'${String(rem).padStart(2, '0')}"`;
}

function deriveCategories(tags: string[]): string[] {
  const cats = new Set<string>();
  const joined = tags.map((t) => t.toLowerCase());

  for (const tag of joined) {
    cats.add(tag);
    if (
      /dinner|dining|wine|bordeaux|sushi|cooking|cocktail|michelin|restaurant/.test(tag)
    ) {
      cats.add('dinner');
    }
    if (/lunch|brunch|coffee|walk|day trip|farmers|beach|picnic/.test(tag)) {
      cats.add('lunch');
    }
    if (
      /event|jazz|opera|theatre|concert|museum|galler|art|polo|sailing|wedding|festival|arcade|tennis|music|movie|karaoke|game|sport|architect|travel/.test(
        tag
      )
    ) {
      cats.add('events');
    }
  }

  return Array.from(cats);
}

function matchesLifestyle(value: string | null | undefined, filter: string): boolean {
  const f = filter.trim().toLowerCase();
  const v = (value || '').trim().toLowerCase();
  if (!v) return false;
  if (f === 'no') return v === 'no' || v === 'never' || v === 'none';
  if (f === 'occasionally') return v.includes('occasional') || v.includes('social');
  if (f === 'yes') return v === 'yes' || v.includes('regular') || v.includes('someday') || v.includes('maybe');
  return v.includes(f);
}

function matchesEducation(value: string | null | undefined, filters: string[]): boolean {
  if (filters.length === 0) return true;
  const v = (value || '').trim().toLowerCase();
  if (!v) return false;

  return filters.some((f) => {
    const fl = f.trim().toLowerCase();
    if (fl.includes('bachelor')) return v.includes('bachelor');
    if (fl.includes('graduate') || fl.includes('master'))
      return v.includes('graduate') || v.includes('master') || v.includes('mba');
    if (fl.includes('post-doctoral') || fl.includes('phd'))
      return v.includes('post-doc') || v.includes('phd') || v.includes('doctor');
    if (fl.includes('associate')) return v.includes('associate');
    if (fl.includes('high school')) return v.includes('high school');
    if (fl.includes('some college')) return v.includes('some college');
    return v.includes(fl);
  });
}

export class DiscoverController {
  // GET /api/discover - Role Adaptive with full Search Preference & Category filtering
  static async getDiscoverFeed(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    const userRole = req.user?.role || Role.HOST;

    const category = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
    const location = typeof req.query.location === 'string' ? req.query.location.trim().toLowerCase() : '';
    const isIdVerified = req.query.isIdVerified === 'true';
    const isSelfieVerified = req.query.isSelfieVerified === 'true';
    const smoking = typeof req.query.smoking === 'string' ? req.query.smoking.trim() : '';
    const drinking = typeof req.query.drinking === 'string' ? req.query.drinking.trim() : '';
    const children = typeof req.query.children === 'string' ? req.query.children.trim() : '';
    const educationList =
      typeof req.query.education === 'string' && req.query.education.trim()
        ? req.query.education.split(',').map((e) => e.trim()).filter(Boolean)
        : [];
    const lookingForList =
      typeof req.query.lookingFor === 'string' && req.query.lookingFor.trim()
        ? req.query.lookingFor.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
        : [];
    const bodyTypesList =
      typeof req.query.bodyTypes === 'string' && req.query.bodyTypes.trim()
        ? req.query.bodyTypes.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
        : [];
    const heightMinInches = parseHeightToInches(req.query.heightMin);
    const heightMaxInches = parseHeightToInches(req.query.heightMax);
    const minAge = req.query.minAge ? Number(req.query.minAge) : undefined;
    const maxAge = req.query.maxAge ? Number(req.query.maxAge) : undefined;
    const maxDistance = req.query.maxDistance ? Number(req.query.maxDistance) : undefined;
    const minReliability = req.query.minReliability ? Number(req.query.minReliability) : undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const currentUser = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          select: { latitude: true, longitude: true, subscription: true },
        })
      : null;

    const applyCommonFilters = (cards: any[]) => {
      let filtered = cards;
      if (category && category !== 'all') {
        filtered = filtered.filter((c) => c.categories.some((cat: string) => cat.includes(category)));
      }
      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.bio.toLowerCase().includes(search) ||
            c.occupation.toLowerCase().includes(search) ||
            c.location.toLowerCase().includes(search) ||
            (c.bodyType && c.bodyType.toLowerCase().includes(search)) ||
            c.openTo.some((tag: string) => tag.toLowerCase().includes(search)) ||
            (Array.isArray(c.lookingFor) &&
              c.lookingFor.some((lf: string) => lf.toLowerCase().includes(search)))
        );
      }
      if (location) {
        filtered = filtered.filter((c) => c.location.toLowerCase().includes(location));
      }
      if (isIdVerified) {
        filtered = filtered.filter((c) => c.isIdVerified);
      }
      if (isSelfieVerified) {
        filtered = filtered.filter((c) => c.isSelfieVerified);
      }
      if (smoking) {
        filtered = filtered.filter((c) => matchesLifestyle(c.smoking, smoking));
      }
      if (drinking) {
        filtered = filtered.filter((c) => matchesLifestyle(c.drinking, drinking));
      }
      if (children) {
        filtered = filtered.filter((c) => matchesLifestyle(c.children, children));
      }
      if (educationList.length > 0) {
        filtered = filtered.filter((c) => matchesEducation(c.education, educationList));
      }
      if (lookingForList.length > 0) {
        filtered = filtered.filter(
          (c) =>
            Array.isArray(c.lookingFor) &&
            c.lookingFor.some((item: string) => lookingForList.includes(item.toLowerCase()))
        );
      }
      if (bodyTypesList.length > 0) {
        filtered = filtered.filter(
          (c) => c.bodyType && bodyTypesList.includes(String(c.bodyType).toLowerCase())
        );
      }
      if (heightMinInches != null) {
        filtered = filtered.filter((c) => (c.heightInches || 68) >= heightMinInches);
      }
      if (heightMaxInches != null) {
        filtered = filtered.filter((c) => (c.heightInches || 68) <= heightMaxInches);
      }
      if (minAge != null && !Number.isNaN(minAge)) {
        filtered = filtered.filter((c) => c.age >= minAge);
      }
      if (maxAge != null && !Number.isNaN(maxAge)) {
        filtered = filtered.filter((c) => c.age <= maxAge);
      }
      if (maxDistance != null && !Number.isNaN(maxDistance)) {
        filtered = filtered.filter((c) => c.distanceKm <= maxDistance);
      }
      if (minReliability != null && !Number.isNaN(minReliability)) {
        filtered = filtered.filter((c) => c.reliability >= minReliability);
      }
      return filtered;
    };

    if (userRole === Role.HOST) {
      if (currentUser?.subscription?.status !== SubscriptionStatus.ACTIVE) {
        throw new AppError('An active Host subscription is required to browse Discover.', 403);
      }

      const guests = await prisma.user.findMany({
        where: {
          role: Role.GUEST,
          isActive: true,
          accountStatus: AccountStatus.ACTIVE,
        },
        include: {
          guestProfile: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      const rawCards = guests.map((guest, idx) => {
        const profile = guest.guestProfile;
        const openTo = profile?.inviteMeToEvents?.length
          ? profile.inviteMeToEvents
          : ['Dinner', 'Events'];
        const heightInches = profile?.heightInches ?? 66;
        const distanceKm =
          currentUser?.latitude != null &&
          currentUser?.longitude != null &&
          guest.latitude != null &&
          guest.longitude != null
            ? haversineKm(currentUser.latitude, currentUser.longitude, guest.latitude, guest.longitude)
            : 2 + (idx % 5);

        return {
          id: guest.id,
          name: guest.nickname || 'Guest of Honor',
          age: guest.age ?? 25 + (idx % 6),
          image: profile?.photos?.[0] || '/assets/discover-card-1.jpg',
          photos: profile?.photos?.length ? profile.photos : ['/assets/discover-card-1.jpg'],
          reliability: profile?.reliabilityScore ?? 4.9,
          distanceKm,
          bio: profile?.bio || 'Long dinners, warm light, no rush.',
          idealDate: profile?.idealDate || 'An unhurried candlelit dinner with great conversation.',
          openTo,
          categories: deriveCategories(openTo),
          lookingFor: profile?.lookingFor?.length ? profile.lookingFor : ['Dating', 'Long-term'],
          bodyType: profile?.bodyType || 'Slender',
          heightInches,
          height: formatHeightInches(heightInches, '5\'06"'),
          location: guest.locationCity || 'Downtown, NY',
          occupation: profile?.occupation || 'Creative Producer',
          education: profile?.education || "Bachelor's degree",
          smoking: profile?.smoking || 'No',
          drinking: profile?.drinking || 'Occasionally',
          children: profile?.children || 'No',
          customIdeas: profile?.customDateIdeas || [],
          crownBadge: true,
          isVerified: guest.isVerified,
          isIdVerified: guest.isIdVerified || guest.isVerified,
          isSelfieVerified: guest.isSelfieVerified || guest.isVerified,
          canSendOffer: true,
        };
      });

      const filtered = applyCommonFilters(rawCards);
      const total = filtered.length;
      const paged = filtered.slice((page - 1) * limit, page * limit);

      res.json({
        success: true,
        roleView: 'HOST_VIEWING_GUESTS',
        count: paged.length,
        total,
        page,
        data: paged,
      });
      return;
    }

    if (userRole === Role.GUEST) {
      const hosts = await prisma.user.findMany({
        where: {
          role: Role.HOST,
          isActive: true,
          accountStatus: AccountStatus.ACTIVE,
        },
        include: {
          hostProfile: true,
          subscription: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      const rawCards = hosts.map((host, idx) => {
        const profile = host.hostProfile;
        const interests = profile?.interests?.length
          ? profile.interests
          : ['Fine Dining', 'Jazz', 'Architecture'];
        const heightInches = profile?.heightInches ?? 71;
        const distanceKm =
          currentUser?.latitude != null &&
          currentUser?.longitude != null &&
          host.latitude != null &&
          host.longitude != null
            ? haversineKm(currentUser.latitude, currentUser.longitude, host.latitude, host.longitude)
            : 2 + (idx % 6);

        return {
          id: host.id,
          name: host.nickname || 'Host',
          age: host.age ?? 31 + (idx % 7),
          image: profile?.photos?.[0] || '/assets/discover-card-2.jpg',
          photos: profile?.photos?.length ? profile.photos : ['/assets/discover-card-2.jpg'],
          reliability: profile?.reliabilityScore ?? 5.0,
          distanceKm,
          bio:
            profile?.bio ||
            'Passionate about great cuisine, thoughtful conversation, and memorable date hospitality.',
          idealDate:
            profile?.idealDate ||
            'A chef’s tasting menu followed by live jazz or an evening gallery walk.',
          openTo: interests,
          categories: deriveCategories(interests),
          lookingFor: profile?.lookingFor?.length ? profile.lookingFor : ['Dating', 'Long-term'],
          bodyType: profile?.bodyType || 'Athletic',
          heightInches,
          height: formatHeightInches(heightInches, '5\'11"'),
          location: host.locationCity || 'Upper East Side, NY',
          occupation: profile?.occupation || 'Managing Partner',
          education: profile?.education || 'Graduate degree',
          smoking: profile?.smoking || 'No',
          drinking: profile?.drinking || 'Occasionally',
          children: profile?.children || 'No',
          netWorth: profile?.netWorth,
          annualIncome: profile?.annualIncome,
          crownBadge: true,
          isProHost: host.subscription?.status === 'ACTIVE',
          isVerified: host.isVerified,
          isIdVerified: host.isIdVerified || host.isVerified,
          isSelfieVerified: host.isSelfieVerified || host.isVerified,
          canSendOffer: false,
          canReceiveOffer: true,
        };
      });

      const filtered = applyCommonFilters(rawCards);
      const total = filtered.length;
      const paged = filtered.slice((page - 1) * limit, page * limit);

      res.json({
        success: true,
        roleView: 'GUEST_VIEWING_HOSTS',
        count: paged.length,
        total,
        page,
        data: paged,
      });
      return;
    }

    const allUsers = await prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        hostProfile: true,
        guestProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      roleView: 'ADMIN_PLATFORM_OVERVIEW',
      count: allUsers.length,
      page,
      data: allUsers,
    });
  }
}
