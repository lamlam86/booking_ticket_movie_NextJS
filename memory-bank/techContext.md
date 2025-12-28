# Technical Context: Cinemas - Movie Ticket Booking System

*Version: 1.0*
*Updated: 2025-12-28*

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.3 | React framework với App Router |
| React | 19.1.0 | UI component library |
| TypeScript | ^5 | Type-safe JavaScript |
| Tailwind CSS | ^4 | Utility-first CSS framework |

### UI Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| Swiper | 12.0.2 | Touch slider (banner, promo) |
| Lucide React | 0.552.0 | Icon library |
| intl-tel-input | 25.12.4 | International phone input |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Turbopack | (bundled) | Fast development bundler |
| PostCSS | (bundled) | CSS processing |
| @tailwindcss/postcss | ^4 | Tailwind PostCSS plugin |

## Development Environment Setup

### Prerequisites
```bash
# Required
node --version  # >= 18.x
npm --version   # >= 9.x

# Optional
yarn --version  # >= 1.22.x
```

### Installation Steps
```bash
# 1. Clone repository
git clone <repo-url>
cd workspace

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → http://localhost:3000
```

### Available Scripts
```json
{
  "dev": "next dev --turbopack",    // Development with Turbopack
  "build": "next build --turbopack", // Production build
  "start": "next start"              // Start production server
}
```

## Dependencies

### Production Dependencies
```json
{
  "next": "15.5.3",           // Core framework
  "react": "19.1.0",          // React library
  "react-dom": "19.1.0",      // React DOM renderer
  "swiper": "^12.0.2",        // Slider component
  "lucide-react": "^0.552.0", // Icons
  "intl-tel-input": "^25.12.4" // Phone input
}
```

### Dev Dependencies
```json
{
  "@tailwindcss/postcss": "^4",  // Tailwind PostCSS
  "tailwindcss": "^4",          // Tailwind CSS
  "@types/node": "^20",         // Node.js types
  "@types/react": "^19",        // React types
  "@types/react-dom": "^19",    // React DOM types
  "typescript": "^5"            // TypeScript compiler
}
```

## Technical Constraints

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features used
- CSS Grid, Flexbox required

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Limitations
- No IE11 support
- Requires JavaScript enabled
- Mobile-first responsive design

## Build and Deployment

### Build Process
```bash
# Production build
npm run build

# Output structure
.next/
├── static/           # Static assets
├── server/           # Server bundles
└── cache/            # Build cache
```

### Environment Variables
```env
# .env.local (if needed)
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Deployment Options
- **Vercel**: Recommended (zero-config)
- **Docker**: Dockerfile available
- **Static Export**: `next export` for static hosting

## Testing Approach

### Current Status
- No automated tests implemented yet

### Planned Testing Strategy
```
Unit Testing:
- Jest + React Testing Library
- Component unit tests
- Utility function tests

Integration Testing:
- Playwright or Cypress
- User flow testing
- Form validation testing

E2E Testing:
- Full booking flow
- Authentication flow
```

## File Structure Conventions

### Naming
- Components: `PascalCase.tsx` (e.g., `MovieCard.tsx`)
- Pages: `page.tsx` (Next.js convention)
- Styles: `globals.css` (single global file)
- Images: `kebab-case.ext` (e.g., `ic-ticket.svg`)

### Import Aliases
```typescript
// tsconfig.json paths
"@/*": ["./*"]

// Usage
import Header from "@/components/Header";
import "./globals.css";
```

## Code Style

### TypeScript
```typescript
// Type definitions inline or exported
type Props = {
  id: string;
  title: string;
  img: string;
  age?: string;  // Optional with ?
};

// Function components with type annotation
export default function MovieCard({ id, title, img, age }: Props) {
  // ...
}
```

### CSS Conventions
```css
/* BEM-like naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* CSS Custom Properties for theming */
:root {
  --green: #17C769;
}

/* Utility classes from Tailwind (v4) */
```

### Component Pattern
```typescript
"use client"; // Only when needed

import { useState, useMemo } from "react";

type Props = { /* ... */ };

export default function ComponentName({ prop1, prop2 }: Props) {
  // Hooks first
  const [state, setState] = useState();
  
  // Memoized values
  const computed = useMemo(() => /* ... */, [deps]);
  
  // Handlers
  const handleClick = () => { /* ... */ };
  
  // Render
  return (
    <div className="class-name">
      {/* JSX */}
    </div>
  );
}
```

---

*This document describes the technologies used in the project and how they're configured.*
