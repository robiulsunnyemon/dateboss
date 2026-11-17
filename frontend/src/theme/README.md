# thedateboss Design System & Architecture

This design system strictly adheres to the official `thedateboss` **Brand Guide**. Every future page and component in this project should consume these shared tokens and UI components to ensure 100% brand consistency.

---

## 1. Brand Tokens (`frontend/src/theme/`)

```ts
import { brandColors, typography } from '@/theme';
```

### Color Palette
- **Primary Red**: `#9F1E19` (`brand.primary`)
- **Secondary Yellow/Gold**: `#FCB943` (`brand.secondary`)
- **Background (BG)**: `#EFE7DA` (`brand.bg`)
- **Surface**: `#F5F1E6` (`brand.surface`)
- **Black (100)**: `#16120F` (`brand.black`)
- **Muted Gray**: `#6E6A63` (`brand.muted`)
- **Success Green**: `#199F22` (`brand.success`)

### Typography
- **Display & Headings**: `Lora` (Google Fonts: SemiBold Italic / SemiBold)
- **Body & UI**: `Raleway` (Google Fonts: Regular / Medium / SemiBold)

---

## 2. Reusable UI Components (`frontend/src/components/ui/`)

All components can be imported directly:
```tsx
import {
  StepContainer,
  BrandHeader,
  Button,
  Input,
  TextArea,
  SelectionPill,
  Badge,
  LoadingSpinner,
} from '@/components/ui';
```

### Quick Component Examples

#### A. Standard Step / Page Container
Handles responsive layout automatically (mobile edge-to-edge + desktop centered card):
```tsx
<StepContainer onBack={handleBack} maxWidth="md">
  <Badge variant="step">Step 13 of 13</Badge>
  <h1 className="font-serif font-bold text-3xl text-brand-black mt-2">Page Title</h1>
  <p className="text-brand-muted text-sm mt-1">Subtitle description here.</p>
  {/* Content */}
</StepContainer>
```

#### B. Buttons
```tsx
<Button variant="primary">Continue</Button>
<Button variant="secondary">Buy now</Button>
<Button variant="outline">Learn more</Button>
<Button variant="ghost">Back</Button>
```

#### C. Inputs & TextAreas
```tsx
<Input label="Your Name" placeholder="Type here..." />
<TextArea label="Bio" placeholder="Tell us about yourself..." />
```

#### D. Interactive Selection Pills
```tsx
<SelectionPill
  label="Option A"
  selected={isSelected}
  onClick={() => setIsSelected(!isSelected)}
/>
```
