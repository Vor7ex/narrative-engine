# Narrative Engine - Agent Guidelines

## Build & Development Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint with flat config (eslint.config.mjs)
npm test           # Run Vitest tests
npm test -- --run  # Run Vitest once (CI mode)
```

**Running a single test file:**
```bash
npm test -- src/path/to/file.spec.ts      # Vitest
```

## Import Architecture - Strict Boundaries

### Rules

1. **`src/engine/`** (pure engine) is **data-blind**:
   - NEVER import from `@/content/`
   - Only receives data via props or Zustand store

2. **`src/content/`** (game data) depends on engine:
   - Only import public types and helpers re-exported from `@/engine`
   - Never import rendering logic or engine internals

3. **Barrel exports** - Use `index.ts` files to define public API:
   - `@/engine` exports the engine's public API
   - `@/content` exports dialogues and scenes

### Valid Import Structure

```
✓ src/engine/renderers/... → @/engine/types
✓ src/content/... → @/engine/types
✓ src/app/... → @/engine (public API)
✓ src/engine → @/content (NEVER)
```

## TypeScript Configuration

- **Strict mode**: `strict: true` in `tsconfig.json`
- **Path aliases**: `@/*` maps to `./src/*`
- **Module resolution**: `bundler` mode
- **JSX**: `react-jsx` transform

### TypeScript Guidelines

1. Prefer explicit types over inference for function parameters and return types
2. Use `import type` for type-only imports
3. Avoid `any` - use `unknown` when type is truly unknown
4. Use `interface` for object shapes, `type` for unions/primitives
5. Always handle null/undefined cases (strict null checks)

```typescript
// Good
interface UserProps { name: string; age: number; }
const greet = (user: UserProps): string => `Hello, ${user.name}`;

// Bad
const greet = (user: any): any => `Hello, ${user.name}`;
```

## Next.js 16 App Router

### Server Components (Default)
- All components in `src/app/` are Server Components by default
- Add `'use client'` at top of files only when client-side interactivity needed
- Keep client components as leaves in component tree

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
- Prefer `fetch()` with extended options
- Use `Suspense` for streaming and loading states

## Code Style

### Import Order
1. TypeScript types (`import type`)
2. Next.js built-ins (Image, Link, etc.)
3. React hooks/functions
4. Third-party packages
5. Internal aliases (`@/...`)
6. Relative imports

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase with suffixes (`UserProps`, `ApiResponse`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Files**: kebab-case or PascalCase for components

### React Component Structure
```typescript
import type { PropsWithChildren } from 'react';

interface ComponentProps {
  title: string;
  children?: PropsWithChildren;
}

export default async function Component({ title, children }: ComponentProps) {
  if (!title) return null;
  // Hooks (client components only, 'use client' required above)
  // Data fetching (server components)
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
- Handle async errors in Server Components with `error.tsx` files
- Use `null` coalescing and optional chaining for safe property access

## Tailwind CSS v4
- Use `@tailwindcss/postcss` plugin (v4 syntax)
- Use CSS variables for theme values
- Prefer utility classes over custom CSS
- Use `dark:` prefix for dark mode variants
- Mobile-first approach with `sm:`, `md:`, `lg:`, `xl:` prefixes

```tsx
<div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900">
  <span className="text-sm text-zinc-500 dark:text-zinc-400" />
</div>
```

## Project Structure
```
src/
├── app/              # Next.js App Router
├── content/          # Static assets (characters, backgrounds, lottie)
│   ├── characters/
│   ├── backgrounds/
│   └── lottie/
├── components/       # Reusable React components
├── lib/             # Utilities and helpers
└── types/           # Shared TypeScript types
```

## Linting
ESLint uses `eslint-config-next` with TypeScript support. Do not disable rules without strong justification.

## Accessibility
- Use semantic HTML elements
- Add `alt` text to all images
- Ensure color contrast meets WCAG AA standards
- Use `aria-*` attributes when semantic HTML is insufficient

## Performance
- Mark static images with `priority` prop
- Use `next/image` for automatic optimization
- Prefer Server Components over Client Components
- Lazy load heavy components with `dynamic()` and `ssr: false`
