<!--
  WorkoutBuilderView.vue
  Dedicated view for building/editing workouts with navigation support.
-->
<template>
  <div>
    <!-- Back Navigation -->
    <div class="mb-6">
      <Button
        variant="ghost"
        size="md"
        @click="$router.back()"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="x" variant="flat" size="sm" />
        </template>
        Back
      </Button>
    </div>

    <!-- Page Header -->
    <div class="mb-8 text-center">
      <div
        class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
      >
        <Icon name="plus" variant="fill" size="xl" class="text-white" />
      </div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-3 tracking-tight"
      >
        {{ isEditing ? "Edit Workout" : "Build New Workout" }}
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium max-w-2xl mx-auto"
      >
        {{
          isEditing
            ? "Modify your existing workout"
            : "Create a custom workout with strength and conditioning exercises"
        }}
      </Text>
    </div>

    <!-- Workout Builder Component -->
    <WorkoutBuilder
      :initial-workout="initialWorkout"
      @save="handleWorkoutSave"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button, Icon, Text } from "@/components/core/basics";
import { WorkoutBuilder } from "@/components/core/workout-components";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import type { Workout } from "@/types/workout";

interface Props {
  workoutId?: string;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const { getWorkout, saveWorkout } = useWorkoutStorage();

const initialWorkout = ref<Workout | null>(null);

// Check if we're editing an existing workout
const isEditing = computed(() => {
  return !!(props.workoutId || route.params.workoutId);
});

// Load existing workout if editing
onMounted(() => {
  const id = props.workoutId || (route.params.workoutId as string);
  if (id) {
    const workout = getWorkout(id);
    if (workout) {
      initialWorkout.value = workout;
    } else {
      // Workout not found, redirect to builder
      console.warn(`Workout with ID ${id} not found`);
      router.replace("/builder");
    }
  }
});

function handleWorkoutSave(workout: Workout) {
  const success = saveWorkout(workout);
  if (success) {
    // Navigate to library after successful save
    router.push("/library");
  } else {
    alert("Failed to save workout. Please try again.");
  }
}
</script>
