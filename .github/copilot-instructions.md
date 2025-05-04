## Copilot Instructions for Vite / React / Tailwind / Nanostores / Astro

> This file provides guidance for using GitHub Copilot (or similar AI assistants) to generate and maintain code with Vite, React, Tailwind CSS, Nanostores, and Astro. Follow these best practices to ensure consistent, performant, and maintainable code.

---

### Table of Contents

1. General Principles
2. Vite Configuration
3. React Patterns
4. Tailwind CSS Usage
5. Nanostores State Management
6. Astro Integration
7. Naming Conventions
8. Accessibility & SEO
9. Testing & Tooling
10. Performance & Optimization

---

### General Principles

- **Consistency**: Leverage existing folder structures and naming conventions.
- **Modularity**: Split code into small, reusable components and modules.
- **Type Safety**: Prefer TypeScript for all new code; annotate props, stores, and configs.
- **Documentation**: Always include JSDoc comments for public APIs and complex logic.
- **Linting & Formatting**: Adhere to ESLint + Prettier config. No inline disabling without justification.


### Vite Configuration

- Use the official `vite.config.ts` template.
- Enable aliasing (`@/` → `src/`) for cleaner imports.
- Activate the plugin ecosystem:
  - React plugin: `@vitejs/plugin-react` (with fast Refresh).
  - Tailwind JIT: ensure `tailwindcss` and `autoprefixer` are in `postcss.config.js`.
  - Nanostores Babel transformer if needed.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  resolve: {
    alias: { '@/': '/src/' },
  },
  plugins: [react()],
  css: {
    postcss: { plugins: [tailwindcss, autoprefixer] },
  },
});
```


### React Patterns

- **Functional Components** only (no class-based components).
- **Hooks**:
  - `useEffect` for side-effects.
  - `useCallback` / `useMemo` for expensive operations.
- **Props**:
  - Always destructure props in the function signature.
  - Validate with `PropTypes` if using plain JS.
- **Folder Layout**:
  - `src/components/*` for shared UI.
  - `src/pages/*` for route-level pages (Astro).

```jsx
export function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded">
      {children}
    </button>
  );
}
```


### Tailwind CSS Usage

- **Utility-First**: prefer Tailwind classes over custom CSS unless truly necessary.
- **Responsive**: use `sm:`, `md:`, `lg:` prefixes.
- **Custom Themes**: extend colors and spacing in Tailwind config, never override core defaults.

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: { primary: '#0d9488' },
    },
  },
};
```


### Nanostores State Management

- **Store Definitions**:
  - Create stores in `src/stores/`.
  - Use `atom`, `map`, `computed` from `nanostores`.

```ts
import { atom } from 'nanostores';

export const userStore = atom<{ name: string }>({ name: '' });
```

- **Usage**:
  - In React, use `useStore` from `nanostores/react`.

```jsx
import { useStore } from 'nanostores/react';
import { userStore } from '@/stores/userStore';

export function UserName() {
  const user = useStore(userStore);
  return <span>{user.name || 'Guest'}</span>;
}
```

- **Best Practices**:
  - Keep stores flat and small.
  - Avoid deep nested structures.
  - Derive computed values instead of manual transforms.


### Astro Integration

- Use `.astro` pages to define routes.
- Embed React components via `<Component client:load />`, `<Component client:idle />`, or `<Component client:visible />` directives.
- Share `src/components` with Astro and React seamlessly.

```astro
---
import { MyWidget } from '@/components/MyWidget';
---
<html>
  <body>
    <MyWidget client:load />
  </body>
</html>
```

- **Static Props**: fetch data in frontmatter, pass to components.


### Naming Conventions

- **Files/Dirs**: kebab-case (`user-profile.tsx`).
- **Components**: PascalCase (`UserProfile.tsx`).
- **Stores**: camelCase with `Store` suffix (`cartStore.ts`).
- **Classes/IDs**: avoid unless absolutely necessary.


### Accessibility & SEO

- Use semantic HTML (e.g., `<header>`, `<nav>`, `<main>`).
- Ensure alt text on images.
- Use `aria-*` attributes where needed.
- Title and meta tags in Astro pages.


### Testing & Tooling

- **Unit Tests**: Jest + React Testing Library.
- **E2E**: Playwright or Cypress.
- **Linting**: ESLint with `eslint-config-airbnb` + `eslint-plugin-tailwindcss`.
- **Type Checking**: `tsc --noEmit` in CI.


### Performance & Optimization

- **Code Splitting**: dynamic `import()` for large modules.
- **Image Optimization**: Astro’s built-in `@astrojs/image`.
- **Lazy Loading**: `loading="lazy"` on images and `<Component client:idle />` for widgets.
- **Minimize Unused CSS**: Tailwind’s purge in production.