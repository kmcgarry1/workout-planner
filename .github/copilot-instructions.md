# Workout Planner - AI Coding Agent Instructions

## Project overview

Vue 3 + TypeScript + Tailwind SPA for comprehensive fitness tracking and social engagement. Originally started as a simple workout builder, it has evolved into a full-featured fitness platform with workout tracking, analytics, social features, and community challenges. Built on a robust component library (design system) with complete TypeScript coverage. Local storage persistence handles all data with import/export capabilities.

## App features

### Core Workout Features (Phases 1-2)

- **Exercise library**: Browse and search 50+ strength and conditioning exercises with categories, muscle groups, equipment tags
- **Workout builder**: Add exercises to a workout, configure sets/reps/weight (strength) or time/rounds (conditioning)
- **Workout execution**: Live workout tracking with rest timers, set completion, and performance recording
- **Workout summary**: View final workout with all exercises, sets, and parameters in printable/exportable format

### Advanced Tracking & Analytics (Phase 3-4)

- **Workout history**: Complete log of all workouts with search, filtering, and detailed views
- **Progress analytics**: Visual charts showing volume, frequency, and performance trends over time
- **Personal records**: Automatic PR detection and celebration for strength exercises
- **Data management**: Import/export functionality, data validation, and backup/restore capabilities
- **Enhanced dashboard**: Unified view of recent workouts, progress charts, PRs, and quick actions

### Social Features (Phase 5)

- **User profiles**: Customizable profiles with avatars, achievements, social scoring, and privacy controls
- **Workout sharing**: Share workouts publicly or privately with descriptions, tags, and difficulty ratings
- **Community library**: Browse thousands of shared workouts with search, filtering, and one-click import
- **Workout collections**: Organize saved workouts into custom collections (favorites, to-try, custom themes)
- **Challenge system**: Join fitness challenges with progress tracking, streaks, leaderboards, and rewards

## Tech stack and build

- Framework: Vue 3 using `<script setup lang="ts">` Composition API
- Styling: Tailwind CSS (see `tailwind.config.js`), semantic CSS variables in `src/assets/base.css`
- State Management: Composables pattern with localStorage persistence (no external state library)
- Data Layer: Complete local storage system with import/export, backup/restore capabilities
- Build: Vite with HMR
- Type checking: `vue-tsc` (npm run type-check)
- Dev server: `npm run dev` (served with `--host`)
- Production build: `npm run build` (runs type-check + vite build via `npm-run-all2`)

## Component architecture

### Core component library (`src/components/core/`)

Custom design system organized by basics, layout, and feature-specific components.

1. Basics (`core/basics/`) – atomic building blocks

- `Icon.vue`: SVG icon system with variants (`outline` | `fill` | `flat` | `ghost`), sizes (`xs|sm|md|lg|xl` or numeric), rotation/flip support; built-ins include check, x, menu, search, home, plus, minus, star, spinner, sun, moon.
- `Text.vue`: Semantic typography with variants (`header|subheader|title|subtitle|body|footer`) mapped to tags (h1–h4, p, small) and responsive sizes.
- `Button.vue`: Variants (primary, secondary, ghost, outline, danger, subtle), loading state, optional leading/trailing icons using `Icon.vue` and `Text.vue`.
- `Input.vue`: Basic text input following Tailwind-first styling (used where needed).

2. Layout (`core/layout/`) – structural composition

- `Card.vue`: Container with slots: `image`, `header`, default (body), and `actions`. Props include `variant` (default|outlined|elevated|flat), `padding` (none|sm|md|lg|xl), `rounded`, `shadow`, and `bgClass`. Tailwind classes are built via computed properties; responsive padding defaults used.
- `card-components/`
  - `CardHeader.vue`: Title/subtitle (uses `Text.vue`), optional prepend icon and append slot, optional divider.
  - `CardBody.vue`: Padded content container with configurable spacing.
  - `CardActions.vue`: Footer/action row with flexible alignment and gaps.
  - `CardImage.vue`: Media area with aspect ratios and rounded controls.
- `ListCard.vue`: Compact row card for lists. Supports prepend image/icon slot, title/subtitle content, and trailing icon/slot. Emits `click` for selection or navigation. Props for padding, rounded, hoverable, `bgClass`, and dividers.

3. Workout components (`core/workout-components/`)

- `WorkoutList.vue`: Selectable list built from `ListCard.vue` that emits the current selection to parents
- `ExerciseLibrary.vue`: Browse and search exercises with filtering, categories, and favorites
- `ExerciseConfigForm.vue`: Configure exercise parameters (sets, reps, weight, time)
- `WorkoutBuilder.vue`: Complete workout creation interface with drag-and-drop
- `WorkoutSummary.vue`: Display completed workout with export and sharing options
- `EnhancedWorkoutTracking.vue`: Live workout execution with timers and progress tracking
- `RestTimer.vue`: Configurable countdown timer for rest periods between sets
- `SetTracker.vue`: Individual set completion tracking with performance recording
- `WorkoutProgress.vue`: Real-time workout progress visualization during execution
- `ProgressChart.vue`: Advanced analytics charts for workout data visualization
- `PersonalRecords.vue`: PR tracking and celebration interface
- `DataManagement.vue`: Import/export interface with backup/restore capabilities
- `EnhancedDashboard.vue`: Comprehensive dashboard with analytics, recent workouts, and quick actions
- `UserProfile.vue`: User profile management with achievements, privacy settings, and onboarding
- `WorkoutSharingModal.vue`: Share workouts with privacy controls and community features
- `SharedWorkoutBrowser.vue`: Browse and import community shared workouts
- `WorkoutCollections.vue`: Organize saved workouts into collections and favorites
- `SharedWorkoutCard.vue`: Enhanced display card for shared workouts with metadata
- `ChallengeCard.vue`: Display workout challenges with progress tracking and actions

Barrel exports: Index files exist for basics (`core/basics/index.ts`), layout (`core/layout/index.ts`), card subcomponents (`core/layout/card-components/index.ts`), and workout components (`core/workout-components/index.ts`). Prefer importing via these barrels where available.

## Data layer and composables

### Core composables (`src/composables/`)

- `useWorkoutStorage.ts`: Complete workout CRUD operations with localStorage persistence
- `useWorkoutAnalytics.ts`: Advanced analytics, progress tracking, and PR detection
- `useUserProfile.ts`: User profile management with achievements and social scoring
- `useWorkoutSharing.ts`: Workout sharing workflow with community features
- `useChallenges.ts`: Challenge system with progress tracking, streaks, and rewards

### Type definitions (`src/types/`)

- `workout.ts`: Core workout, exercise, and set interfaces with enhanced tracking features
- `social.ts`: User profiles, shared workouts, achievements, and social interaction types
- `challenges.ts`: Challenge system interfaces including progress, leaderboards, and notifications

### Views (`src/views/`)

- `CommunityLibraryView.vue`: Community workout discovery with trending and categories
- `ChallengesView.vue`: Challenge discovery, progress tracking, and leaderboards

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
- Color scheme: Feature-specific gradients (purple for workouts, orange for challenges, blue for analytics) with dark mode variants.
- Animations: Smooth hover effects, loading states, and progress animations using CSS transitions.

## Dark mode

- Strategy: Class-based (`dark:`) with a toggle in `App.vue` that persists to `localStorage` and respects system preference on first load.
- Usage: Apply paired classes, e.g., `bg-white dark:bg-gray-800`, `text-gray-900 dark:text-gray-100`. Keep transitions subtle (`transition-colors duration-200`).

## File organization

- Path alias: `@/` → `src/`
- CSS: `src/assets/main.css` imports `base.css` then Tailwind directives.
- Types: `env.d.ts` provides Vite ambient types.
- Relative imports preferred for TypeScript compatibility (avoid `@/` in imports).
- Composables pattern for state management with localStorage persistence.

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
- Feature components: 16+ specialized components including new social features.
- App shell: `App.vue` header includes a dark/light toggle (sun/moon icons) with persisted preference.
- Demo: `HelloWorld.vue` renders a responsive 3-column dashboard of cards showcasing components.

## Phase completion status

- **Phase 1-2 (Core Workout Features)**: ✅ Complete
  - Exercise library, workout builder, execution, summary
- **Phase 3-4 (Analytics & Tracking)**: ✅ Complete
  - Workout history, progress charts, personal records, enhanced dashboard, data management
- **Phase 5 (Social Features)**: 🚧 4/7 Complete
  - ✅ User profile system with achievements and social scoring
  - ✅ Workout sharing system with modal and browser components
  - ✅ Community workout library with collections and enhanced cards
  - ✅ Challenge system with types, progress tracking, and leaderboards
  - 🔄 Workout buddy system (in progress)
  - ⏳ Achievement system framework
  - ⏳ Social activity feed

## Critical details

- Node engine: `^20.19.0 || >=22.12.0` (see `package.json`)
- Vite DevTools enabled in dev
- CSS reset and font stack in `src/assets/base.css` (Inter primary)

## Integration tips for WorkoutList

- Render `WorkoutList` inside a `Card` body (`<Card><CardBody>…</CardBody></Card>`).
- Bind a `selected` array via `v-model:selected` or listen for `update:selected` to sync selection to parent state.
- Customize row visuals by forwarding `bgClass`/`hoverable` as needed to `ListCard`.

## Integration tips for social features

- UserProfile component can be integrated into settings/profile views
- WorkoutSharingModal works with existing workout data structures
- SharedWorkoutBrowser provides discovery UI with one-click import
- ChallengeCard integrates with challenge progress tracking system
- All social components follow the established Tailwind + TypeScript patterns

## Agent workflow quick checklist

- Read the component and its barrel exports before editing.
- Make small, focused patches; keep public APIs stable.
- After edits, run `npm run type-check`. For visual changes, start `npm run dev`.
- Prefer adding/adjusting usage comments at the top of new/changed components.
- Use relative imports for TypeScript compatibility (avoid `@/` paths).
- Follow established composables pattern for state management.
