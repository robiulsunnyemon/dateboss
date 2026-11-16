# The Date Inc — Complete TypeScript Project

An end-to-end dating and date-offer platform built with **TypeScript**, **React**, **Node.js/Express**, and **Tailwind CSS**.

Faithfully designed after the high-converting landing page ("THE DATE STARTS WITH AN OFFER.") with both **Desktop View** (1440px) and **Mobile View** (390px iPhone viewport), plus an operational **Dashboard** and **REST API Backend**.

---

## 📁 Project Architecture

```
d:/new_tap/
├── backend/                  # TypeScript Express REST API Server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── offers.ts     # Date Offers CRUD (Accept, Counter, Pass)
│   │   │   ├── venues.ts     # Verified Public Dining Venues
│   │   │   ├── dashboard.ts  # Analytics, Ghosting Rates, Volume
│   │   │   └── content.ts    # Testimonials & FAQs
│   │   ├── types.ts          # Core TypeScript Data Models
│   │   ├── mockData.ts       # Realistic Seed Dataset
│   │   └── server.ts         # Server entrypoint (Port 5000)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # High-Fidelity Landing Page with Desktop & Mobile Views
│   ├── src/
│   │   ├── components/
│   │   │   ├── WaxSealLogo.tsx          # Authentic Wax Seal SVG Emblem
│   │   │   ├── Navbar.tsx               # Desktop & Mobile Drawer Navigation
│   │   │   ├── HeroSection.tsx          # "The Date Starts With An Offer."
│   │   │   ├── HowItWorksSection.tsx    # "Less Chat, More Chemistry" + Live Preview
│   │   │   ├── WhyDifferentSection.tsx  # Envelope & Lock feature cards
│   │   │   ├── ReviewsSection.tsx       # User testimonials slider
│   │   │   ├── AntiGhostingSection.tsx  # Charcoal Dark Theme 4-Pillars
│   │   │   ├── FaqSection.tsx           # Interactive Accordion
│   │   │   ├── CtaBanner.tsx            # Bottom Wax Seal Call-to-Action
│   │   │   ├── Footer.tsx               # Footer with Legal Links
│   │   │   ├── ViewModeBar.tsx          # View Switcher (Desktop 1440px / Mobile 390px)
│   │   │   └── OfferModal.tsx           # Interactive Date Proposal Form
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts        # Port 3000 + API Proxy
│   ├── tailwind.config.js
│   └── package.json
│
├── dashboard/                # Platform Operations & Analytics Dashboard
│   ├── src/
│   │   ├── App.tsx           # Offers Pipeline, Venues, Anti-Ghosting KPIs
│   │   └── main.tsx
│   ├── vite.config.ts        # Port 3001
│   ├── tailwind.config.js
│   └── package.json
│
└── package.json              # Monorepo Workspace Root
```

---

## ⚡ One-Click Run (এক ক্লিকে চালু করার উপায়)

### Method 1: Double-Click Desktop File (সবচেয়ে সহজ - এক ক্লিকে)
- ফোল্ডারে থাকা **`start.bat`** ফাইলে ডাবল ক্লিক করুন!
- এটি স্বয়ংক্রিয়ভাবে Backend, Frontend ও Dashboard চালু করে ব্রাউজারে `http://localhost:3000` ওপেন করবে।

### Method 2: Single Command Run
টার্মিনাল থেকে এক লাইনে চালু করতে:
```bash
npm run dev
# অথবা:
npm start
```

---

## 🚀 Individual Service Commands

### 1. Run the Backend API (Port 5000)
```bash
npm run dev:backend
# or: cd backend && npm run dev
```
*Health Check: http://localhost:5000/api/health*

### 2. Run the Frontend Landing Page (Port 3000)
```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```
*Open http://localhost:3000 in your browser.*
- Use the **Desktop View** button to view the 1440px desktop layout.
- Use the **Mobile View** button to view the realistic iPhone 390px mobile layout (identical to the attached screenshot).
- Use **Responsive** for natural flexible resizing.

### 3. Run the Admin Dashboard (Port 3001)
```bash
npm run dev:dashboard
# or: cd dashboard && npm run dev
```
*Open http://localhost:3001 in your browser.*

---

## 🎨 Design System & Highlights
- **Palette**: Rich Burgundy (`#8A1B22`), Warm Amber Gold (`#E8A738`), Classic Cream (`#FBF8F3`), and Deep Slate Charcoal (`#141414`).
- **Typography**: Playfair Display (Luxury Editorial Serif) paired with Plus Jakarta Sans (Clean Modern Sans-Serif).
- **Anti-Ghosting Protocol**: 48h expiration timer, 24h mutual confirmation, and verified public venues.
