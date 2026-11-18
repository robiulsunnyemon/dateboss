# The Date Inc — Platform Architecture & Documentation

An end-to-end dating and date-offer platform built with **TypeScript**, **React**, **Node.js/Express**, and **Tailwind CSS**, designed with high fidelity to the official Figma Brand Guidelines.

---

## 🧭 Application Paging & Routing (ইউআরএল রাউটিং ও পেজ তালিকা)

The application provides smooth URL routing and full browser History / Back-Forward button support:

| Route / Hash | Page / View Name | Description |
| :--- | :--- | :--- |
| `http://localhost:3000/` | **Landing Page** | High-converting landing page with Hero, Host/Guest selector, How It Works, Features, and FAQ |
| `http://localhost:3000/#join` | **Onboarding Step 1** | Role selection (Host / Guest) & Gender selection |
| `http://localhost:3000/#events` | **Onboarding Guest Events** | 16-outing selection grid for Guests & Women |
| `http://localhost:3000/#step2` .. `#step12` | **Onboarding Steps 2–12** | Host interests, lifestyle, career, prompts, photos, selfie check, face verification, membership |
| `http://localhost:3000/#discover` | **Discover Feed (Explore)** | Profile cards with category filter, distance filter, and search preferences |
| `http://localhost:3000/#offers` | **Offers View** | Sent (2), Counter (3), Pass (3), Received, and Expired offer management |
| `http://localhost:3000/#dates` | **Confirmed Dates View** | Confirmed itineraries, 24-hr check-in, and Attendance & Rating bottom sheet |
| `http://localhost:3000/#profile` | **Profile View** | Julian Sterling profile with gallery, stats, lifestyle, and escrow records |
| `http://localhost:3000/#reviews` | **Reviews View** | Profile reviews with 5-star ratings, timestamps, and reporting modal |
| `http://localhost:3000/#appeals` | **Appeal Statues View** | Accepted & Rejected appeal outcomes with badges |
| `http://localhost:3000/#messages` | **Messages & Chat** | Contact list with online statuses, unread badges, and live chat with quick replies |
| `http://localhost:3000/#send-offer` | **Send Offer Flow** | Step 1: Where Should The Offer Take Them? → Step 2: What Are You Inviting Her To? |

---

## 📁 Clean Project Structure (প্রজেক্ট স্ট্রাকচার)

```
d:/new_tap/
├── backend/                       # Node.js + Express TypeScript REST API (Port 5000)
│   ├── src/
│   │   ├── routes/                # Express API Route Handlers
│   │   │   ├── offers.ts          # Offer CRUD, Accept, Counter, Pass
│   │   │   ├── venues.ts          # Curated Dining Destinations
│   │   │   └── dashboard.ts       # Escrow Analytics & KPIs
│   │   ├── mockData.ts            # Realistic Seed Data
│   │   └── server.ts              # Express Server Entry Point
│   └── package.json
│
├── frontend/                      # React 18 + TypeScript + Vite + Tailwind CSS (Port 3000)
│   ├── public/
│   │   └── assets/                # Local Logo, Seals, Avatars, and Gallery Images
│   │
│   ├── src/
│   │   ├── components/            # Reusable Design System UI Components
│   │   │   └── ui/
│   │   │       ├── Badge.tsx          # Status Badges
│   │   │       ├── BrandHeader.tsx    # Logo & Back button Header
│   │   │       ├── Button.tsx         # Pill & Action Buttons
│   │   │       ├── Input.tsx          # Styled Form Inputs
│   │   │       ├── SelectionPill.tsx  # Outing & Filter Pills
│   │   │       ├── StepContainer.tsx  # Multi-step Card Wrapper
│   │   │       └── TextArea.tsx       # Text Area Inputs
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing/           # Public Landing Page Components
│   │   │   │   ├── LandingPage.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── Onboarding/        # 12-Step Host & Guest Onboarding
│   │   │   │   ├── Step1Begin.tsx
│   │   │   │   ├── Step2Interests.tsx
│   │   │   │   ├── Step2GuestEvents.tsx
│   │   │   │   ├── Step3Account.tsx
│   │   │   │   ├── Step4Details.tsx
│   │   │   │   ├── Step5Lifestyle.tsx
│   │   │   │   ├── Step6Career.tsx
│   │   │   │   ├── Step7Prompts.tsx
│   │   │   │   ├── Step8Photos.tsx
│   │   │   │   ├── Step9SelfieVerification.tsx
│   │   │   │   ├── Step10FaceCenterStage.tsx
│   │   │   │   ├── Step11VideoChecking.tsx
│   │   │   │   ├── Step12WelcomeHost.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── Discover/          # Complete Discover & Dating Ecosystem
│   │   │       ├── DiscoverPage.tsx            # Main Discover feed + Tab Navigation
│   │   │       ├── OfferEventsView.tsx         # Outing Selection ("Where Should The Offer Take Them?")
│   │   │       ├── InviteDetailsView.tsx       # Proposal Details ("What Are You Inviting Her To?")
│   │   │       ├── OffersView.tsx              # Sent / Counter / Pass tabs
│   │   │       ├── ConfirmedDatesView.tsx      # Itineraries + Rating Bottom Sheet
│   │   │       ├── ProfileView.tsx             # User Profile (Julian Sterling)
│   │   │       ├── ProfileReviewsView.tsx      # Reviews & Appeal Statues view
│   │   │       ├── MessagesChatView.tsx        # Mobile/Desktop Chat Split-View
│   │   │       ├── SearchPreferenceModal.tsx   # Filter Preferences Modal
│   │   │       └── index.ts                    # Clean Discover Module Exports
│   │   │
│   │   ├── theme/                 # Typography & Color Palettes
│   │   │   ├── colors.ts          # Dark Red (#9F1E19), Cream (#FAF7F2), Beige (#EFE7DA)
│   │   │   └── typography.ts      # Lora (Serif) & Raleway (Sans-Serif)
│   │   │
│   │   ├── types/                 # TypeScript Interfaces & Models
│   │   ├── App.tsx                # Client-Side Routing & View Dispatcher
│   │   └── main.tsx               # React DOM Root
│   │
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── dashboard/                     # Operational Dashboard & Analytics (Port 3001)
├── start.bat                      # One-Click Windows Launcher
└── package.json                   # Root Monorepo Workspace
```

---

## ⚡ How to Run (চালু করার নিয়ম)

### Method 1: One-Click (সবচেয়ে সহজ)
Double-click `start.bat` in the root folder. It starts Backend, Dashboard, and Frontend simultaneously and opens `http://localhost:3000`.

### Method 2: Command Line
```bash
# Start all packages:
npm run dev

# Or start frontend only:
npm --prefix frontend run dev
```

---

## 🎨 Figma Brand System
- **Dark Red**: `#9F1E19` (Hover: `#851713`)
- **Primary Cream Card**: `#FAF7F2` (Border: `#EADBCA` / `#E5DDD0`)
- **Beige Background**: `#EFE7DA`
- **Charcoal Text**: `#16120F`
- **Muted Text**: `#6E6A63` / `#8A857D`
- **Accent Gold**: `#FCB943`
- **Typography**: Headings use `Lora` serif font, body text uses `Raleway` / sans-serif.
