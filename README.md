# Workout Planner

A comprehensive fitness tracking and social engagement platform built with Vue 3, TypeScript, and Tailwind CSS. Track workouts, analyze progress, share with the community, and join fitness challenges.

## ✨ Features

### 🏋️ Core Workout Features

- **Exercise Library**: Browse 50+ strength and conditioning exercises with categories and filtering
- **Workout Builder**: Create custom workouts with drag-and-drop exercise configuration
- **Live Tracking**: Real-time workout execution with rest timers and performance recording
- **Workout History**: Complete log of all workouts with search and detailed views

### 📊 Analytics & Progress Tracking

- **Progress Charts**: Visual analytics showing volume, frequency, and performance trends
- **Personal Records**: Automatic PR detection and celebration for strength exercises
- **Enhanced Dashboard**: Unified view of recent workouts, progress, and quick actions
- **Data Management**: Import/export functionality with backup and restore capabilities

### 👥 Social & Community Features

- **User Profiles**: Customizable profiles with achievements and social scoring
- **Workout Sharing**: Share workouts publicly or privately with the community
- **Community Library**: Browse thousands of shared workouts with one-click import
- **Workout Collections**: Organize saved workouts into custom collections
- **Fitness Challenges**: Join challenges with progress tracking, streaks, and rewards

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript with complete coverage
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Vite** - Fast build tool and dev server with HMR
- **Local Storage** - Client-side persistence with import/export capabilities

## 🏗️ Architecture

### Component Library

- **Core Basics**: Icon, Text, Button, Input components with variant systems
- **Layout Components**: Card system with flexible slots and responsive design
- **Workout Components**: 19+ specialized components for fitness tracking and social features

### Data Management

- **Composables**: `useWorkoutStorage`, `useWorkoutAnalytics`, `useUserProfile`, `useWorkoutSharing`, `useChallenges`
- **Type Definitions**: Complete TypeScript interfaces for workouts, social features, and challenges
- **Local Persistence**: Robust localStorage system with data validation and backup

### Views & Features

- **Enhanced Dashboard**: Comprehensive fitness overview with analytics
- **Community Library**: Social workout discovery and sharing platform
- **Challenges System**: Fitness challenges with progress tracking and rewards

## 💡 Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Additional VS Code Extensions

- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

## 🌐 Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 🔧 Development

### Project Structure

```
src/
├── components/core/          # Reusable component library
│   ├── basics/              # Atomic components (Button, Icon, Text)
│   ├── layout/              # Layout components (Card, ListCard)
│   └── workout-components/  # Feature-specific components (19+ components)
├── composables/             # Vue 3 composables for state management
├── types/                   # TypeScript type definitions
├── views/                   # Page-level components
└── assets/                  # Styles and static assets
```

### Code Style

- **TypeScript**: Complete type coverage with strict mode
- **Vue 3**: Composition API with `<script setup>` syntax
- **Tailwind**: Utility-first styling with custom design system
- **Relative Imports**: Preferred for TypeScript compatibility

## 🤝 Contributing

This is a personal project showcasing modern Vue 3 development patterns, but feedback and suggestions are welcome!

## 📄 Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## ⚙️ Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for build customization options.

---

**Built with ❤️ using modern web technologies**

## 🚀 Getting Started

### Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone https://github.com/kmcgarry1/workout-planner.git
cd workout-planner

# Install dependencies
npm install
```

### Development

```sh
# Start development server with hot reload
npm run dev
```

Visit `http://localhost:5173` (or the port shown in terminal) to view the app.

### Production Build

```sh
# Type-check, compile and minify for production
npm run build
```

### Type Checking

```sh
# Run TypeScript type checking
npm run type-check
```

## 🎯 Development Status

- ✅ **Phase 1-2**: Core workout features (exercise library, builder, tracking)
- ✅ **Phase 3-4**: Analytics & progress tracking (charts, PRs, dashboard)
- 🚧 **Phase 5**: Social features (4/7 complete)
  - ✅ User profiles and achievements
  - ✅ Workout sharing system
  - ✅ Community workout library
  - ✅ Fitness challenges system
  - 🔄 Workout buddy system (in progress)
  - ⏳ Achievement framework
  - ⏳ Social activity feed
