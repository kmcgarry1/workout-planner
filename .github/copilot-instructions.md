# Workout Planner - AI Coding Agent Instructions

## Project overview
Vue 3 + TypeScript + Tailwind SPA for creating custom workouts. Users select exercises (strength or conditioning), configure sets/reps/weight or time, and generate a complete workout plan. Built on a reusable core component library (design system). No router or state management yet. Dark/light mode supported with a header toggle and persisted preference.

## App features
- **Exercise library**: Browse and search strength and conditioning exercises
- **Workout builder**: Add exercises to a workout, configure sets/reps/weight (strength) or time/rounds (conditioning)
- **Workout summary**: View final workout with all exercises, sets, and parameters in a printable/exportable format
- **Lightweight UX**: Simple input-driven flow for quick workout creation

## Tech stack and build
- Framework: Vue 3 using `<script setup lang="ts">` Composition API
- Styling: Tailwind CSS (see `tailwind.config.js`), semantic CSS variables in `src/assets/base.css`
- Build: Vite with HMR
- Type checking: `vue-tsc` (npm run type-check)
- Dev server: `npm run dev` (served with `--host`)
- Production build: `npm run build` (runs type-check + vite build via `npm-run-all2`)

## Component architecture

### Core component library (`src/components/core/`)
Custom design system organized by basics, layout, and feature-specific components.

1) Basics (`core/basics/`) – atomic building blocks
- `Icon.vue`: SVG icon system with variants (`outline` | `fill` | `flat` | `ghost`), sizes (`xs|sm|md|lg|xl` or numeric), rotation/flip support; built-ins include check, x, menu, search, home, plus, minus, star, spinner, sun, moon.
- `Text.vue`: Semantic typography with variants (`header|subheader|title|subtitle|body|footer`) mapped to tags (h1–h4, p, small) and responsive sizes.
- `Button.vue`: Variants (primary, secondary, ghost, outline, danger, subtle), loading state, optional leading/trailing icons using `Icon.vue` and `Text.vue`.
- `Input.vue`: Basic text input following Tailwind-first styling (used where needed).

2) Layout (`core/layout/`) – structural composition
- `Card.vue`: Container with slots: `image`, `header`, default (body), and `actions`. Props include `variant` (default|outlined|elevated|flat), `padding` (none|sm|md|lg|xl), `rounded`, `shadow`, and `bgClass`. Tailwind classes are built via computed properties; responsive padding defaults used.
- `card-components/`
  - `CardHeader.vue`: Title/subtitle (uses `Text.vue`), optional prepend icon and append slot, optional divider.
  - `CardBody.vue`: Padded content container with configurable spacing.
  - `CardActions.vue`: Footer/action row with flexible alignment and gaps.
  - `CardImage.vue`: Media area with aspect ratios and rounded controls.
- `ListCard.vue`: Compact row card for lists. Supports prepend image/icon slot, title/subtitle content, and trailing icon/slot. Emits `click` for selection or navigation. Props for padding, rounded, hoverable, `bgClass`, and dividers.

3) Workout components (`core/workout-components/`)
- `WorkoutList.vue`: Selectable list built from `ListCard.vue` that emits the current selection to parents. Intended for use inside a `Card` body. (See integration guidance below.)

Barrel exports: Index files exist for basics (`core/basics/index.ts`), layout (`core/layout/index.ts`) and card subcomponents (`core/layout/card-components/index.ts`). Prefer importing via these barrels where available.

## Conventions
- Always use `<script setup lang="ts">` and TypeScript types for props/emit contracts.
- Props: Prefer `withDefaults(defineProps<Interface>(), {...})` or object syntax with types when runtime validation is needed.
- State: Components are primarily stateless; use computed props for class assembly. Use `ref` only where local state is required (e.g., dark mode toggle in `App.vue`).
- Slots: Check named slots via `useSlots()`; render conditionally.
- Attrs: Forward attributes via `useAttrs()` and filter out `class` when classes are computed (`attrsNoClass` pattern in `Icon.vue`/`ListCard.vue`).

## Styling patterns
- Tailwind-first: Avoid `<style>` blocks unless necessary; rely on utilities.
- Dynamic classes are built in computed getters returning arrays/strings (see `Text.vue`).
- Pass color via props (`colorClass`, `bgClass`) using static Tailwind class names to satisfy purge/safelist.
- Responsive defaults: Incorporate `md:`/`lg:` modifiers in base variants where helpful.
- Color scheme: Prefer cool/cold accents (blue/cyan/teal/indigo) with dark mode variants.

## Dark mode
- Strategy: Class-based (`dark:`) with a toggle in `App.vue` that persists to `localStorage` and respects system preference on first load.
- Usage: Apply paired classes, e.g., `bg-white dark:bg-gray-800`, `text-gray-900 dark:text-gray-100`. Keep transitions subtle (`transition-colors duration-200`).

## File organization
- Path alias: `@/` → `src/`
- CSS: `src/assets/main.css` imports `base.css` then Tailwind directives.
- Types: `env.d.ts` provides Vite ambient types.

## How to build new components
1. Choose directory (basics vs layout vs feature) under `src/components/core/`.
2. Use TypeScript with `<script setup>`.
3. Define a clear prop/emit contract and document it briefly in a top comment with a one-line usage example.
4. Build Tailwind classes via computed properties. Avoid arbitrary values unless safelisted in Tailwind config.
5. Expose color overrides via `colorClass`/`bgClass` props where sensible.
6. Add to barrel export (`index.ts`) when a directory provides one.

### Tailwind safelist notes
- Arbitrary utilities like `rotate-[Ndeg]` or dynamic color tokens require safelisting; prefer static class names in props.
- When absolutely necessary, update `tailwind.config.js` safelist and document it in the component comment.

## Current state snapshot
- Core basics complete: Icon, Text, Button, Input.
- Card system complete: Card container + CardHeader/CardBody/CardActions/CardImage + ListCard.
- Feature: `WorkoutList` component designed for selection inside cards.
- App shell: `App.vue` header includes a dark/light toggle (sun/moon icons) with persisted preference.
- Demo: `HelloWorld.vue` renders a responsive 3-column dashboard of cards showcasing components.

## Critical details
- Node engine: `^20.19.0 || >=22.12.0` (see `package.json`)
- Vite DevTools enabled in dev
- CSS reset and font stack in `src/assets/base.css` (Inter primary)

## Integration tips for WorkoutList
- Render `WorkoutList` inside a `Card` body (`<Card><CardBody>…</CardBody></Card>`).
- Bind a `selected` array via `v-model:selected` or listen for `update:selected` to sync selection to parent state.
- Customize row visuals by forwarding `bgClass`/`hoverable` as needed to `ListCard`.

## Agent workflow quick checklist
- Read the component and its barrel exports before editing.
- Make small, focused patches; keep public APIs stable.
- After edits, run `npm run type-check`. For visual changes, start `npm run dev`.
- Prefer adding/adjusting usage comments at the top of new/changed components.
