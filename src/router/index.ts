/**
 * Router configuration for the Workout Planner app
 */

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Dashboard",
      },
    },
    {
      path: "/library",
      name: "library",
      component: () => import("@/views/WorkoutLibraryView.vue"),
      meta: {
        title: "Workout Library",
      },
    },
    {
      path: "/history",
      name: "history",
      component: () => import("@/views/WorkoutHistoryView.vue"),
      meta: {
        title: "Workout History",
      },
    },
    {
      path: "/records",
      name: "records",
      component: () => import("@/views/PersonalRecordsView.vue"),
      meta: {
        title: "Personal Records",
      },
    },
    {
      path: "/data",
      name: "data",
      component: () => import("@/views/DataManagementView.vue"),
      meta: {
        title: "Data Management",
      },
    },
    {
      path: "/exercises",
      name: "exercises",
      component: () => import("@/views/ExerciseManagementView.vue"),
      meta: {
        title: "Exercise Management",
      },
    },
    {
      path: "/builder",
      name: "builder",
      component: () => import("@/views/WorkoutBuilderView.vue"),
      meta: {
        title: "Workout Builder",
      },
    },
    {
      path: "/builder/:workoutId?",
      name: "edit-workout",
      component: () => import("@/views/WorkoutBuilderView.vue"),
      meta: {
        title: "Edit Workout",
      },
      props: true,
    },
    {
      path: "/workout/:workoutId",
      name: "active-workout",
      component: () => import("@/views/ActiveWorkoutView.vue"),
      meta: {
        title: "Active Workout",
      },
      props: true,
    },
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/ComponentDemoView.vue"),
      meta: {
        title: "Component Demo",
      },
    },
  ],
});

// Update document title based on route
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} - Workout Planner`
    : "Workout Planner";
});

export default router;
