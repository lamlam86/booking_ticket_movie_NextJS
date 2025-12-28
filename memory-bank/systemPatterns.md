# System Patterns: Cinemas - Movie Ticket Booking System

*Version: 1.0*
*Updated: 2025-12-28*

## Architecture Overview

Dự án sử dụng **Next.js 15 App Router** với cấu trúc component-based. Kiến trúc theo mô hình:

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│                     Next.js App Router                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │  Layouts    │  │    Components       │  │
│  │  (Server)   │  │  (Server)   │  │ (Client/Server)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Static Assets                             │
│              /public/assets/images/*                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Pages (Server Components by default)
- `app/page.tsx`: Trang chủ - Server Component
- `app/movie/page.tsx`: Danh sách phim - Server Component
- `app/movie/[id]/book/page.tsx`: Đặt vé - Server Component (wrapper)
- `app/login/page.tsx`: Đăng nhập - Client Component
- `app/signup/page.tsx`: Đăng ký - Client Component

### Shared Components
- `Header.tsx`: Server Component (static navigation)
- `Footer.tsx`: Server Component (static content)
- `MovieCard.tsx`: Server Component (static card)
- `BookingWizard.tsx`: **Client Component** (stateful)
- `SeatPicker.tsx`: **Client Component** (interactive)
- `ConcessionPicker.tsx`: **Client Component** (interactive)
- `BannerSlider.tsx`: **Client Component** (Swiper.js)
- `PromoSlider.tsx`: **Client Component** (Swiper.js)
- `MobileMenu.tsx`: **Client Component** (toggle state)

## Design Patterns in Use

### 1. Compound Component Pattern
`BookingWizard` orchestrate nhiều sub-components:

```typescript
<BookingWizard>
  ├── DateSelector (inline)
  ├── TheaterSelector (inline)
  ├── TimeSelector (inline)
  ├── <SeatPicker />
  ├── <ConcessionPicker />
  └── Summary + Actions (inline)
</BookingWizard>
```

### 2. Controlled Component Pattern
State được lift lên parent và pass xuống qua props:

```typescript
// Parent (BookingWizard)
const [st, setSt] = useState<State>({...});

// Child (SeatPicker)
<SeatPicker
  value={st.seats}                    // Controlled value
  onChange={(next) => setSt(...)}     // Callback to parent
  reserved={reserved}                 // Read-only data
/>
```

### 3. Render Props / Callback Pattern
Components nhận callback để xử lý logic:

```typescript
type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};
```

### 4. Type Export Pattern
Export types cùng với component:

```typescript
// ConcessionPicker.tsx
export type ConItem = {...};
export type ConSelection = Record<string, number>;
export default function ConcessionPicker({...}: Props) {...}

// Import usage
import ConcessionPicker, { ConItem, ConSelection } from "./ConcessionPicker";
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BookingWizard State                       │
│  { date, theater, time, seats, concessions }                │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │ DatePicker  │ │ SeatPicker  │ │ConcessionPicker│
  │ (inline)    │ │ (component) │ │  (component)   │
  └─────────────┘ └─────────────┘ └─────────────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
              onChange(newState) → setSt()
```

## Key Technical Decisions

### 1. App Router over Pages Router
- **Rationale**: Server Components by default, better performance, streaming
- **Impact**: Phải đánh dấu `"use client"` cho interactive components

### 2. CSS Modules thay vì styled-components
- **Rationale**: Zero runtime, native CSS support
- **Implementation**: `globals.css` với CSS custom properties

### 3. Swiper.js cho Slider
- **Rationale**: Touch-friendly, responsive breakpoints, autoplay
- **Impact**: Tăng bundle size nhưng UX tốt hơn

### 4. intl-tel-input cho Phone Input
- **Rationale**: Validation phone theo quốc gia, UX quen thuộc
- **Impact**: Dynamic import để giảm initial bundle

### 5. Mock Data thay vì API
- **Rationale**: Phase 1 focus UI/UX, API sẽ integrate sau
- **Location**: Data nằm trong component (useMemo)

## Component Relationships

```
layout.tsx
└── Header
    ├── MobileMenu
    └── (Search form)
    
page.tsx (Home)
├── Header
├── BannerSlider
├── MovieCard[] (Now Showing)
├── PromoSlider
├── MovieCard[] (Coming Soon)
├── Theater Grid
└── Footer

movie/[id]/book/page.tsx
├── (no Header - minimal layout)
├── BookingWizard
│   ├── SeatPicker
│   └── ConcessionPicker
└── (no Footer)

login/page.tsx & signup/page.tsx
├── Header
├── Form (inline)
└── Footer
```

## State Management Strategy

**Không dùng global state (Redux/Zustand)** vì:
- Mỗi page độc lập
- State chỉ cần trong component tree của page đó
- Server Components không support global state

**Local State với useState/useMemo**:
- `BookingWizard`: Quản lý toàn bộ booking flow
- `MobileMenu`: Toggle open/close
- `SeatPicker/ConcessionPicker`: Nhận value từ parent

---

*This document captures the system architecture and design patterns used in the project.*
