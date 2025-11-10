/**
 * useWorkoutSharing.ts
 * Composable for managing workout sharing functionality with templates, descriptions, and tags.
 */

import { ref, computed, readonly } from "vue";
import type { Workout } from "@/types/workout";
import type { SharedWorkout, WorkoutShareSettings } from "@/types/social";
import { useWorkoutStorage } from "./useWorkoutStorage";

const SHARED_WORKOUTS_KEY = "shared_workouts";
const RECEIVED_WORKOUTS_KEY = "received_workouts";

// Global state
const sharedWorkouts = ref<SharedWorkout[]>([]);
const receivedWorkouts = ref<Workout[]>([]);
const shareHistory = ref<
  { workoutId: string; sharedAt: string; shareId: string }[]
>([]);

export function useWorkoutSharing() {
  const { workouts, saveWorkout } = useWorkoutStorage();

  // Load shared workouts from storage
  function loadSharedWorkouts() {
    try {
      const stored = localStorage.getItem(SHARED_WORKOUTS_KEY);
      if (stored) {
        sharedWorkouts.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading shared workouts:", error);
      sharedWorkouts.value = [];
    }
  }

  // Load received workouts from storage
  function loadReceivedWorkouts() {
    try {
      const stored = localStorage.getItem(RECEIVED_WORKOUTS_KEY);
      if (stored) {
        receivedWorkouts.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading received workouts:", error);
      receivedWorkouts.value = [];
    }
  }

  // Save shared workouts to storage
  function saveSharedWorkouts() {
    try {
      localStorage.setItem(
        SHARED_WORKOUTS_KEY,
        JSON.stringify(sharedWorkouts.value)
      );
    } catch (error) {
      console.error("Error saving shared workouts:", error);
    }
  }

  // Save received workouts to storage
  function saveReceivedWorkouts() {
    try {
      localStorage.setItem(
        RECEIVED_WORKOUTS_KEY,
        JSON.stringify(receivedWorkouts.value)
      );
    } catch (error) {
      console.error("Error saving received workouts:", error);
    }
  }

  // Create a shareable workout template
  function createShareableWorkout(
    workout: Workout,
    settings: WorkoutShareSettings
  ): SharedWorkout {
    const shareId = `share_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const sharedWorkout: SharedWorkout = {
      id: shareId,
      originalWorkoutId: workout.id,
      name: settings.title || workout.name || "Shared Workout",
      description: settings.description || "",
      tags: settings.tags || [],
      sharedBy: settings.sharedBy || "Anonymous",
      sharedAt: new Date().toISOString(),
      isPublic: settings.isPublic ?? true,
      isTemplate: settings.isTemplate ?? true,
      exercises: workout.exercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        exercise: ex.exercise,
        sets: ex.sets.map((set) => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight,
          duration: set.duration,
          distance: set.distance,
          rest: set.rest,
          completed: false, // Reset completion status for templates
          notes: set.notes,
        })),
        notes: ex.notes,
        order: ex.order,
        restBetweenSets: ex.restBetweenSets,
      })),
      metadata: {
        category: settings.category || "General",
        difficulty: settings.difficulty || "Intermediate",
        estimatedDuration:
          settings.estimatedDuration || calculateWorkoutDuration(workout),
        targetMuscleGroups: extractMuscleGroups(workout),
        equipmentNeeded: extractEquipment(workout),
      },
      stats: {
        downloads: 0,
        likes: 0,
        rating: 0,
        totalRatings: 0,
      },
      versions: [
        {
          version: 1,
          createdAt: new Date().toISOString(),
          changes: "Initial version",
        },
      ],
    };

    return sharedWorkout;
  }

  // Share a workout
  function shareWorkout(
    workout: Workout,
    settings: WorkoutShareSettings
  ): { success: boolean; shareId?: string; shareUrl?: string; error?: string } {
    try {
      const sharedWorkout = createShareableWorkout(workout, settings);

      // Add to shared workouts
      sharedWorkouts.value.push(sharedWorkout);
      saveSharedWorkouts();

      // Add to share history
      shareHistory.value.push({
        workoutId: workout.id,
        sharedAt: new Date().toISOString(),
        shareId: sharedWorkout.id,
      });

      // Generate share URL (in a real app, this would be a proper URL)
      const shareUrl = `${window.location.origin}/shared/${sharedWorkout.id}`;

      return {
        success: true,
        shareId: sharedWorkout.id,
        shareUrl,
      };
    } catch (error) {
      console.error("Error sharing workout:", error);
      return {
        success: false,
        error: "Failed to share workout",
      };
    }
  }

  // Import a shared workout
  function importSharedWorkout(sharedWorkout: SharedWorkout): {
    success: boolean;
    workoutId?: string;
    error?: string;
  } {
    try {
      // Create a new workout from the shared template
      const newWorkout: Workout = {
        id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${sharedWorkout.name} (Imported)`,
        date: new Date().toISOString(),
        exercises: sharedWorkout.exercises.map((ex) => ({
          ...ex,
          id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sets: ex.sets.map((set) => ({
            ...set,
            id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            completed: false,
          })),
        })),
        completed: false,
        tags: sharedWorkout.tags,
        notes: `Imported from: ${sharedWorkout.sharedBy}\n\n${sharedWorkout.description}`,
        totalDuration: sharedWorkout.metadata.estimatedDuration,
      };

      // Save the new workout
      saveWorkout(newWorkout);

      // Add to received workouts for tracking
      receivedWorkouts.value.push(newWorkout);
      saveReceivedWorkouts();

      // Update download count (in a real app, this would be on the server)
      const sharedIndex = sharedWorkouts.value.findIndex(
        (sw) => sw.id === sharedWorkout.id
      );
      if (sharedIndex !== -1) {
        sharedWorkouts.value[sharedIndex].stats.downloads++;
        saveSharedWorkouts();
      }

      return {
        success: true,
        workoutId: newWorkout.id,
      };
    } catch (error) {
      console.error("Error importing workout:", error);
      return {
        success: false,
        error: "Failed to import workout",
      };
    }
  }

  // Get shared workout by ID
  function getSharedWorkout(shareId: string): SharedWorkout | null {
    return sharedWorkouts.value.find((sw) => sw.id === shareId) || null;
  }

  // Search shared workouts
  function searchSharedWorkouts(
    query: string,
    tags?: string[]
  ): SharedWorkout[] {
    return sharedWorkouts.value.filter((workout) => {
      if (!workout.isPublic) return false;

      const matchesQuery =
        !query ||
        workout.name.toLowerCase().includes(query.toLowerCase()) ||
        workout.description.toLowerCase().includes(query.toLowerCase()) ||
        workout.sharedBy.toLowerCase().includes(query.toLowerCase());

      const matchesTags =
        !tags?.length || tags.some((tag) => workout.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  }

  // Rate a shared workout
  function rateSharedWorkout(shareId: string, rating: number): boolean {
    const workoutIndex = sharedWorkouts.value.findIndex(
      (sw) => sw.id === shareId
    );
    if (workoutIndex === -1 || rating < 1 || rating > 5) return false;

    const workout = sharedWorkouts.value[workoutIndex];
    const totalRating =
      workout.stats.rating * workout.stats.totalRatings + rating;
    workout.stats.totalRatings++;
    workout.stats.rating =
      Math.round((totalRating / workout.stats.totalRatings) * 10) / 10;

    saveSharedWorkouts();
    return true;
  }

  // Like/unlike a shared workout
  function toggleLike(shareId: string): boolean {
    const workoutIndex = sharedWorkouts.value.findIndex(
      (sw) => sw.id === shareId
    );
    if (workoutIndex === -1) return false;

    // In a real app, you'd track individual user likes
    // For now, just increment/decrement
    sharedWorkouts.value[workoutIndex].stats.likes++;
    saveSharedWorkouts();
    return true;
  }

  // Delete shared workout
  function deleteSharedWorkout(shareId: string): boolean {
    const index = sharedWorkouts.value.findIndex((sw) => sw.id === shareId);
    if (index === -1) return false;

    sharedWorkouts.value.splice(index, 1);
    saveSharedWorkouts();
    return true;
  }

  // Generate share link for native sharing
  function generateShareLink(sharedWorkout: SharedWorkout): string {
    return `${window.location.origin}/shared/${sharedWorkout.id}`;
  }

  // Share via Web Share API or fallback
  async function shareViaWebApi(
    sharedWorkout: SharedWorkout
  ): Promise<boolean> {
    const shareData = {
      title: sharedWorkout.name,
      text: sharedWorkout.description || "Check out this workout!",
      url: generateShareLink(sharedWorkout),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.log("Share cancelled or failed:", error);
        return false;
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        return true;
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
      }
    }
  }

  // Helper functions
  function calculateWorkoutDuration(workout: Workout): number {
    // Estimate workout duration based on exercises and sets
    let totalDuration = 0;

    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.duration) {
          totalDuration += set.duration;
        } else {
          // Estimate time per set based on exercise type
          if (exercise.exercise.type === "strength") {
            totalDuration += 45; // 45 seconds per strength set
          } else {
            totalDuration += 180; // 3 minutes for conditioning
          }
        }

        // Add rest time
        totalDuration += set.rest || 60;
      });
    });

    return Math.round(totalDuration / 60); // Convert to minutes
  }

  function extractMuscleGroups(workout: Workout): string[] {
    const muscleGroups = new Set<string>();

    workout.exercises.forEach((exercise) => {
      exercise.exercise.muscleGroups?.forEach((mg) => muscleGroups.add(mg));
    });

    return Array.from(muscleGroups);
  }

  function extractEquipment(workout: Workout): string[] {
    const equipment = new Set<string>();

    workout.exercises.forEach((exercise) => {
      exercise.exercise.equipment?.forEach((eq) => equipment.add(eq));
    });

    return Array.from(equipment);
  }

  // Computed properties
  const mySharedWorkouts = computed(() =>
    sharedWorkouts.value.filter((sw) => sw.isPublic)
  );

  const recentlyShared = computed(() =>
    sharedWorkouts.value
      .sort(
        (a, b) =>
          new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      )
      .slice(0, 5)
  );

  const popularWorkouts = computed(() =>
    sharedWorkouts.value
      .filter((sw) => sw.isPublic)
      .sort(
        (a, b) =>
          b.stats.downloads +
          b.stats.likes -
          (a.stats.downloads + a.stats.likes)
      )
      .slice(0, 10)
  );

  const shareStats = computed(() => ({
    totalShared: sharedWorkouts.value.length,
    totalDownloads: sharedWorkouts.value.reduce(
      (sum, sw) => sum + sw.stats.downloads,
      0
    ),
    totalLikes: sharedWorkouts.value.reduce(
      (sum, sw) => sum + sw.stats.likes,
      0
    ),
    averageRating:
      sharedWorkouts.value.length > 0
        ? sharedWorkouts.value.reduce((sum, sw) => sum + sw.stats.rating, 0) /
          sharedWorkouts.value.length
        : 0,
  }));

  // Initialize data
  loadSharedWorkouts();
  loadReceivedWorkouts();

  return {
    // State
    sharedWorkouts: readonly(sharedWorkouts),
    receivedWorkouts: readonly(receivedWorkouts),
    shareHistory: readonly(shareHistory),

    // Actions
    shareWorkout,
    importSharedWorkout,
    getSharedWorkout,
    searchSharedWorkouts,
    rateSharedWorkout,
    toggleLike,
    deleteSharedWorkout,
    shareViaWebApi,
    generateShareLink,

    // Computed
    mySharedWorkouts,
    recentlyShared,
    popularWorkouts,
    shareStats,

    // Utilities
    loadSharedWorkouts,
    loadReceivedWorkouts,
  };
}
