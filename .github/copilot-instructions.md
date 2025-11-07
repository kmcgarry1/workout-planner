# Workout Planner - AI Coding Agent Instructions

## Project Overview
Vue 3 SPA for workout planning using TypeScript, Tailwind CSS, and Vite. No router or state management yet—pure component architecture focused on building a reusable core component library first.

## Tech Stack & Build
- **Framework**: Vue 3 with `<script setup>` Composition API (TypeScript)
- **Styling**: Tailwind CSS utility-first (configured in `tailwind.config.js`)
- **Build**: Vite with hot reload
- **Type Checking**: `vue-tsc` (run via `npm run type-check`)
- **Dev Server**: `npm run dev` (runs with `--host` flag for network access)
- **Production**: `npm run build` (runs type-check + vite build via `npm-run-all2`)

## Component Architecture

### Core Component Library (`src/components/core/`)
Building a custom design system with two categories:

1. **Basics** (`core/basics/`): Atomic components
   - `Icon.vue`: SVG icon system with variants (outline/fill/flat/ghost), sizes (xs/sm/md/lg/xl or px), built-in icons (check, x, menu, search, home, plus, minus, star), rotation/flip support
   - `Text.vue`: Typography component with semantic variants (header/subheader/title/subtitle/body/footer), auto-maps to HTML tags (h1/h2/h3/h4/p/small), responsive text sizing

2. **Layout** (`core/layout/`): Structural components
   - `Card.vue`: Currently empty (work in progress)
   - `card-components/CardHeader.vue`: Currently empty (work in progress)

**Index Pattern**: `core/index.ts` exists but is empty—likely intended for barrel exports of all core components.

### Card Component Guidelines (Planned)
When implementing the Card component system, follow these patterns:

**Card.vue** (container):
- Accept slots for flexible content composition: `default`, `header`, `footer`
- Props: `variant` (default/outlined/elevated), `padding` (none/sm/md/lg), `rounded` (sm/md/lg/xl), `shadow` (none/sm/md/lg/xl)
- Use `bgClass` prop for background customization (e.g., `bg-white`, `bg-gray-50`)
- Build classes with computed properties following `Icon.vue` pattern
- Default to responsive padding (e.g., `p-4 md:p-6`)

**CardHeader.vue** (composition component):
- Should be usable inside Card's header slot OR as standalone
- Accept slots: `default` (title content), `actions` (buttons/icons), `subtitle`
- Props: `title`, `subtitle`, `divider` (boolean for bottom border)
- Use `Text.vue` component for title/subtitle with appropriate variants
- Example: `<Text variant="title">{{ title }}</Text>`

**Composition Pattern**:
```vue
<Card>
  <template #header>
    <CardHeader title="Workout Plan" subtitle="Week 1" />
  </template>
  <!-- card content -->
</Card>
```

Follow the same prop-driven color/style pattern from Icon/Text to maintain consistency across the design system.

### Component Conventions
- Use `<script setup lang="ts">` for all Vue components
- Props: Use `defineProps()` with object syntax for runtime + type validation (see `Icon.vue`, `Text.vue`) OR TypeScript interface syntax for compile-time only (see `HelloWorld.vue`)
- **No `ref()` usage yet**—components are currently stateless with computed properties only
- Slots: Check with `useSlots()` and conditional rendering (see `Icon.vue`)
- Attrs: Use `useAttrs()` to forward attributes while filtering out duplicates (see `Icon.vue` `attrsNoClass` pattern)

### Styling Patterns
- **Tailwind-first**: All styling via utility classes, no `<style>` blocks except imports
- **Dynamic classes**: Build via computed properties returning arrays/strings (see `Text.vue` `classes` computed)
- **Prop-driven colors**: Accept Tailwind color classes as props (`colorClass`, `bgClass`) for safe CSS purging—avoid dynamic class generation
- **Responsive defaults**: Use responsive modifiers in base variants (e.g., `text-4xl md:text-5xl`)
- **CSS variables**: `src/assets/base.css` defines semantic color variables (`--color-background`, `--color-text`) with dark mode support via `prefers-color-scheme`

## File Organization
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`)
- **Assets**: `src/assets/main.css` imports `base.css` then Tailwind directives
- **Types**: `env.d.ts` declares ambient types for Vite

## Key Development Patterns

### When creating new components:
1. Place in appropriate `core/` subdirectory (basics vs layout)
2. Use TypeScript with `<script setup lang="ts">`
3. Define props with runtime validation (object syntax) + TypeScript types
4. Build classes with computed properties, not string templates
5. Accept color/styling via props (e.g., `colorClass`) rather than hardcoding
6. Export from `core/index.ts` barrel file for clean imports

### Tailwind safelist considerations:
- Arbitrary values (e.g., `rotate-[${n}deg]`) require Tailwind config additions
- Pass static Tailwind classes via props to ensure they're detected by purge scanner
- Document required color classes in component prop descriptions

## Current State
- **Active development**: Core component library (Icon, Text complete; Card in progress)
- **No routing**: Single-page app without Vue Router yet
- **No state management**: No Pinia/Vuex yet
- **No testing setup**: No Vitest/Cypress/Playwright configured yet
- **Main app**: `App.vue` shows simple header + HelloWorld demo

## Critical Details
- Node version requirement: `^20.19.0 || >=22.12.0` (see `package.json` engines)
- Vite DevTools plugin active in dev mode
- CSS reset in `base.css` includes box-sizing and font stack (Inter primary)
- Dark mode handled via CSS media query, not manual toggle yet
