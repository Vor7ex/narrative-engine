# Narrative Engine - Agent Guidelines

## Build & Development Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint on entire codebase
```

**Running a single test** (when tests are added):
```bash
npm test -- --testPathPattern="filename.test.ts"  # Jest
npm run test -- filename.spec.ts                  # Vitest
```

## TypeScript Configuration

- **Strict mode**: `strict: true` is enabled in `tsconfig.json`
- **Path aliases**: `@/*` maps to `./src/*`
- **Module resolution**: `bundler` mode
- **JSX**: `react-jsx` transform

### TypeScript Guidelines

1. **Prefer explicit types** over inference for function parameters and return types
2. **Use `import type`** for type-only imports to enable tree-shaking
3. **Avoid `any`** - use `unknown` when type is truly unknown
4. **Use interface** for object shapes, type for unions/primitives
5. **Strict null checks** - always handle null/undefined cases

```typescript
// Good
interface UserProps {
  name: string;
  age: number;
}
const greet = (user: UserProps): string => `Hello, ${user.name}`;

// Bad
const greet = (user: any): any => `Hello, ${user.name}`;
```

## Next.js 16 App Router Conventions

### This is NOT the Next.js you know

Next.js 16 has breaking changes. Read `node_modules/next/dist/docs/` before writing code.

### Server Components (Default)

- All components in `src/app/` are Server Components by default
- Add `'use client'` at the top of files only when client-side interactivity is needed
- Keep client components as leaves in the component tree

### File Conventions

```
src/app/
├── layout.tsx      # Root layout (must export metadata)
├── page.tsx        # Homepage route
├── globals.css     # Global styles
└── [slug]/         # Dynamic route segment
```

### Data Fetching

- Use async/await directly in Server Components
- Prefer `fetch()` with extended options over utility functions
- Use `Suspense` for streaming and loading states

## Code Style Guidelines

### Import Order

1. TypeScript types (`import type`)
2. Next.js built-ins (Image, Link, etc.)
3. React hooks/functions
4. Third-party packages
5. Internal aliases (`@/...`)
6. Relative imports

```typescript
import type { Metadata } from 'next';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './styles.css';
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase with descriptive suffixes (`UserProps`, `ApiResponse`)
- **Constants**: SCREAMING_SNAKE_CASE for global constants
- **Files**: kebab-case or PascalCase for components

### React Component Structure

```typescript
import type { PropsWithChildren } from 'react';

// 1. Props interface (if needed)
interface ComponentProps {
  title: string;
  children?: PropsWithChildren;
}

// 2. Component definition (async if data fetching)
export default async function Component({ title, children }: ComponentProps) {
  // 3. Early returns (guards)
  if (!title) return null;

  // 4. Hooks (client components only)
  // 'use client' required above

  // 5. Data fetching (server components)

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Error Handling

- Use `try/catch` with specific error types
- Create custom error classes for domain-specific errors
- Always handle async errors in Server Components with error.tsx files
- Use `null` coalescing and optional chaining for safe property access

```typescript
// Server Component error handling
// Create error.tsx in same directory for granular error boundaries

try {
  const data = await fetchUser(id);
  return <UserProfile data={data} />;
} catch (error) {
  if (error instanceof NotFoundError) {
    notFound();
  }
  throw error; // Re-throw for error.tsx boundary
}
```

## Tailwind CSS v4 Guidelines

- Use `@tailwindcss/postcss` plugin (v4 syntax)
- Use CSS variables for theme values
- Prefer utility classes over custom CSS
- Use `dark:` prefix for dark mode variants
- Use `group-` variants for nested interactions

```tsx
<div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900">
  <span className="text-sm text-zinc-500 dark:text-zinc-400" />
</div>
```

### Responsive Design

- Mobile-first approach
- Use `sm:`, `md:`, `lg:`, `xl:` prefixes
- Avoid hardcoding breakpoints - use Tailwind's defaults

## Project Structure

```
src/
├── app/              # Next.js App Router (root, pages, layouts)
├── content/          # Static assets (characters, backgrounds, lottie)
│   ├── characters/
│   ├── backgrounds/
│   └── lottie/
├── components/       # Reusable React components (future)
├── lib/             # Utilities and helpers (future)
└── types/           # Shared TypeScript types (future)
```

## Content Asset Management

When adding character sprites, backgrounds, or animations:
1. Place assets in appropriate `src/content/` subdirectory
2. Use descriptive, lowercase filenames with hyphens: `penguin.png`, `forest-day.jpg`
3. Import assets using Next.js Image component for optimization

## Linting

```bash
npm run lint   # Runs ESLint with flat config (eslint.config.mjs)
```

ESLint config uses `eslint-config-next` with TypeScript support. Do not disable rules without strong justification.

## Accessibility

- Use semantic HTML elements
- Add `alt` text to all images
- Ensure color contrast meets WCAG AA standards
- Use `aria-*` attributes when semantic HTML is insufficient

## Performance

- Mark static images with `priority` prop
- Use `next/image` for automatic optimization
- Prefer Server Components over Client Components when possible
- Lazy load heavy components with `dynamic()` and `ssr: false`