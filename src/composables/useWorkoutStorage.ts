/**
 * useWorkoutStorage.ts
 * Composable for managing workout data persistence via localStorage.
 *
 * Provides methods to save, load, delete, and manage workouts with reactive state.
 */

import { ref, computed } from "vue";
import type { Workout, Exercise } from "@/types/workout";

const WORKOUTS_KEY = "workout-planner-workouts";
const CUSTOM_EXERCISES_KEY = "workout-planner-custom-exercises";
const FAVORITES_KEY = "workout-planner-favorites";

// Reactive state shared across the app
const workouts = ref<Workout[]>([]);
const customExercises = ref<Exercise[]>([]);
const favoriteExerciseIds = ref<Set<string>>(new Set());

export function useWorkoutStorage() {
  // Load data from localStorage on first use
  function loadFromStorage() {
    try {
      const workoutsData = localStorage.getItem(WORKOUTS_KEY);
      const exercisesData = localStorage.getItem(CUSTOM_EXERCISES_KEY);
      const favoritesData = localStorage.getItem(FAVORITES_KEY);

      if (workoutsData) {
        workouts.value = JSON.parse(workoutsData);
      }

      if (exercisesData) {
        customExercises.value = JSON.parse(exercisesData);
      }

      if (favoritesData) {
        favoriteExerciseIds.value = new Set(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      workouts.value = [];
      customExercises.value = [];
      favoriteExerciseIds.value = new Set();
    }
  }

  // Save workouts to localStorage
  function saveWorkoutsToStorage() {
    try {
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts.value));
    } catch (error) {
      console.error("Error saving workouts to localStorage:", error);
    }
  }

  // Save custom exercises to localStorage
  function saveExercisesToStorage() {
    try {
      localStorage.setItem(
        CUSTOM_EXERCISES_KEY,
        JSON.stringify(customExercises.value)
      );
    } catch (error) {
      console.error("Error saving exercises to localStorage:", error);
    }
  }

  // Save favorites to localStorage
  function saveFavoritesToStorage() {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(favoriteExerciseIds.value))
      );
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }

  // Initialize data if not already loaded
  if (workouts.value.length === 0 && customExercises.value.length === 0) {
    loadFromStorage();
  }

  // Workout management methods
  function saveWorkout(workout: Workout): boolean {
    try {
      const existingIndex = workouts.value.findIndex(
        (w) => w.id === workout.id
      );

      if (existingIndex >= 0) {
        // Update existing workout
        workouts.value[existingIndex] = { ...workout };
      } else {
        // Add new workout
        workouts.value.push({ ...workout });
      }

      saveWorkoutsToStorage();
      return true;
    } catch (error) {
      console.error("Error saving workout:", error);
      return false;
    }
  }

  function deleteWorkout(workoutId: string): boolean {
    try {
      const index = workouts.value.findIndex((w) => w.id === workoutId);
      if (index >= 0) {
        workouts.value.splice(index, 1);
        saveWorkoutsToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting workout:", error);
      return false;
    }
  }

  function getWorkout(workoutId: string): Workout | undefined {
    return workouts.value.find((w) => w.id === workoutId);
  }

  function duplicateWorkout(workoutId: string): Workout | null {
    try {
      const original = getWorkout(workoutId);
      if (!original) return null;

      const duplicate: Workout = {
        ...original,
        id: `workout-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        name: `${original.name} (Copy)`,
        date: new Date().toISOString(),
        completed: false,
      };

      // Generate new IDs for workout exercises
      duplicate.exercises = original.exercises.map((we) => ({
        ...we,
        id: `we-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        sets: we.sets.map((set) => ({ ...set, completed: false })),
      }));

      if (saveWorkout(duplicate)) {
        return duplicate;
      }
      return null;
    } catch (error) {
      console.error("Error duplicating workout:", error);
      return null;
    }
  }

  // Exercise management methods
  function saveCustomExercise(exercise: Exercise): boolean {
    try {
      const existingIndex = customExercises.value.findIndex(
        (e) => e.id === exercise.id
      );

      if (existingIndex >= 0) {
        customExercises.value[existingIndex] = { ...exercise };
      } else {
        customExercises.value.push({ ...exercise });
      }

      saveExercisesToStorage();
      return true;
    } catch (error) {
      console.error("Error saving custom exercise:", error);
      return false;
    }
  }

  function deleteCustomExercise(exerciseId: string): boolean {
    try {
      const index = customExercises.value.findIndex((e) => e.id === exerciseId);
      if (index >= 0) {
        customExercises.value.splice(index, 1);
        saveExercisesToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting custom exercise:", error);
      return false;
    }
  }

  // Computed properties for easy access
  const sortedWorkouts = computed(() => {
    return [...workouts.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const completedWorkouts = computed(() =>
    workouts.value.filter((w) => w.completed)
  );

  const recentWorkouts = computed(() => sortedWorkouts.value.slice(0, 5));

  const workoutStats = computed(() => ({
    total: workouts.value.length,
    completed: completedWorkouts.value.length,
    thisWeek: workouts.value.filter((w) => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    }).length,
  }));

  // Clear all data (for reset/debugging)
  function clearAllData() {
    workouts.value = [];
    customExercises.value = [];
    favoriteExerciseIds.value = new Set();
    localStorage.removeItem(WORKOUTS_KEY);
    localStorage.removeItem(CUSTOM_EXERCISES_KEY);
    localStorage.removeItem(FAVORITES_KEY);
  }

  // Toggle favorite status for an exercise
  function toggleExerciseFavorite(exerciseId: string) {
    if (favoriteExerciseIds.value.has(exerciseId)) {
      favoriteExerciseIds.value.delete(exerciseId);
    } else {
      favoriteExerciseIds.value.add(exerciseId);
    }
    saveFavoritesToStorage();
  }

  // Check if exercise is favorited
  function isExerciseFavorite(exerciseId: string): boolean {
    return favoriteExerciseIds.value.has(exerciseId);
  }

  return {
    // Reactive state
    workouts: workouts.value,
    customExercises: customExercises.value,
    favoriteExerciseIds,
    sortedWorkouts,
    completedWorkouts,
    recentWorkouts,
    workoutStats,

    // Workout methods
    saveWorkout,
    deleteWorkout,
    getWorkout,
    duplicateWorkout,

    // Exercise methods
    saveCustomExercise,
    deleteCustomExercise,

    // Favorites methods
    toggleExerciseFavorite,
    isExerciseFavorite,

    // Utility methods
    loadFromStorage,
    clearAllData,
  };
}
