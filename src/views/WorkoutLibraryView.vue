<!--
  WorkoutLibraryView.vue
  View for managing saved workouts - view, edit, delete, duplicate.
-->
<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg"
      >
        <Icon name="star" variant="fill" size="xl" class="text-white" />
      </div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-3 tracking-tight"
      >
        Workout Library
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium max-w-2xl mx-auto"
      >
        Manage your saved workout collection
      </Text>
    </div>

    <!-- Quick Actions -->
    <div class="flex justify-between items-center">
      <div>
        <Text variant="title" class="text-gray-900 dark:text-white font-bold">
          {{ workouts.length }}
          {{ workouts.length === 1 ? "Workout" : "Workouts" }}
        </Text>
      </div>
      <Button
        variant="primary"
        size="lg"
        @click="$router.push('/builder')"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        New Workout
      </Button>
    </div>

    <!-- Search and Filters -->
    <div class="space-y-4">
      <Input
        v-model="searchQuery"
        variant="filled"
        size="lg"
        placeholder="Search workouts..."
        clearable
      >
        <template #leading>
          <Icon
            name="search"
            variant="flat"
            size="sm"
            class="text-gray-400 dark:text-gray-500"
          />
        </template>
      </Input>

      <!-- Filter buttons -->
      <div class="flex gap-3">
        <Button
          :variant="filter === 'all' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'all'"
          class="font-semibold"
        >
          All ({{ workouts.length }})
        </Button>
        <Button
          :variant="filter === 'completed' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'completed'"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="check" variant="flat" size="sm" />
          </template>
          Completed ({{ completedWorkouts.length }})
        </Button>
        <Button
          :variant="filter === 'draft' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'draft'"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="flat" size="sm" />
          </template>
          Drafts ({{ workouts.length - completedWorkouts.length }})
        </Button>
      </div>
    </div>

    <!-- Workouts Grid -->
    <div
      v-if="filteredWorkouts.length === 0 && workouts.length === 0"
      class="text-center py-16"
    >
      <div class="mb-6 flex justify-center">
        <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
          <Icon
            name="star"
            variant="flat"
            size="xl"
            class="text-gray-300 dark:text-gray-600"
          />
        </div>
      </div>
      <Text
        variant="title"
        class="text-gray-600 dark:text-gray-400 font-bold mb-3"
        >No workouts yet</Text
      >
      <Text
        variant="body"
        class="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto"
      >
        Start building your first workout to see it appear in your library
      </Text>
      <Button
        variant="primary"
        size="lg"
        @click="$router.push('/builder')"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Create First Workout
      </Button>
    </div>

    <div v-else-if="filteredWorkouts.length === 0" class="text-center py-16">
      <div class="mb-4 flex justify-center">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <Icon
            name="search"
            variant="flat"
            size="xl"
            class="text-gray-300 dark:text-gray-600"
          />
        </div>
      </div>
      <Text
        variant="title"
        class="text-gray-600 dark:text-gray-400 font-bold mb-2"
        >No matching workouts</Text
      >
      <Text variant="body" class="text-gray-500 dark:text-gray-500">
        Try adjusting your search or filter criteria
      </Text>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card
        v-for="workout in filteredWorkouts"
        :key="workout.id"
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="lg"
        :bg-class="
          workout.completed
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800'
        "
        class="transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      >
        <CardHeader
          :title="workout.name || 'Untitled Workout'"
          :subtitle="formatDate(workout.date)"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div
              :class="[
                'p-2.5 rounded-lg',
                workout.completed
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-blue-600 dark:bg-blue-500',
              ]"
            >
              <Icon
                :name="workout.completed ? 'check' : 'star'"
                variant="fill"
                size="md"
                class="text-white"
              />
            </div>
          </template>
          <template #append>
            <span
              :class="[
                'inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
                workout.completed
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
              ]"
            >
              {{ workout.completed ? "Done" : "Draft" }}
            </span>
          </template>
        </CardHeader>

        <CardBody padding="lg" class="bg-white/50 dark:bg-gray-900/50">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Icon
                name="star"
                variant="flat"
                size="sm"
                class="text-gray-500 dark:text-gray-400"
              />
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-medium"
              >
                {{ workout.exercises.length }}
                {{ workout.exercises.length === 1 ? "exercise" : "exercises" }}
              </Text>
            </div>

            <!-- Exercise preview -->
            <div v-if="workout.exercises.length > 0" class="space-y-1">
              <div
                v-for="(exercise, idx) in workout.exercises.slice(0, 3)"
                :key="exercise.id"
                class="text-sm text-gray-600 dark:text-gray-400"
              >
                {{ idx + 1 }}. {{ exercise.exercise.name }}
              </div>
              <div
                v-if="workout.exercises.length > 3"
                class="text-xs text-gray-500 dark:text-gray-500 italic"
              >
                +{{ workout.exercises.length - 3 }} more...
              </div>
            </div>

            <div
              v-if="workout.notes"
              class="pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 text-sm italic line-clamp-2"
              >
                💡 {{ workout.notes }}
              </Text>
            </div>
          </div>
        </CardBody>

        <CardActions
          justify="between"
          padding="lg"
          class="bg-gray-50 dark:bg-gray-800/50"
        >
          <div class="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              @click="startWorkout(workout.id)"
              class="font-bold"
            >
              <template #leading>
                <Icon name="spinner" variant="flat" size="sm" />
              </template>
              Start
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="editWorkout(workout.id)"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="star" variant="flat" size="sm" />
              </template>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="duplicateWorkout(workout.id)"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="plus" variant="flat" size="sm" />
              </template>
              Copy
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="confirmDeleteWorkout(workout)"
            class="font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <template #leading>
              <Icon name="x" variant="flat" size="sm" />
            </template>
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Card } from "@/components/core/layout";
import {
  CardHeader,
  CardBody,
  CardActions,
} from "@/components/core/layout/card-components";
import { Button, Icon, Text, Input } from "@/components/core/basics";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import type { Workout } from "@/types/workout";

const router = useRouter();
const {
  workouts,
  completedWorkouts,
  deleteWorkout,
  duplicateWorkout: duplicateWorkoutFn,
} = useWorkoutStorage();

const searchQuery = ref("");
const filter = ref<"all" | "completed" | "draft">("all");

const filteredWorkouts = computed(() => {
  let result = [...workouts];

  // Apply filter
  if (filter.value === "completed") {
    result = result.filter((w) => w.completed);
  } else if (filter.value === "draft") {
    result = result.filter((w) => !w.completed);
  }

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((workout) => {
      const searchableText = [
        workout.name,
        workout.notes,
        ...workout.exercises.map((e) => e.exercise.name),
        ...workout.exercises.map((e) => e.exercise.category),
        ...workout.exercises.map((e) => e.notes),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }

  // Sort by date (newest first)
  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function editWorkout(workoutId: string) {
  router.push(`/builder/${workoutId}`);
}

function startWorkout(workoutId: string) {
  router.push(`/workout/${workoutId}`);
}

function duplicateWorkout(workoutId: string) {
  const duplicate = duplicateWorkoutFn(workoutId);
  if (duplicate) {
    // Optionally navigate to edit the duplicate
    router.push(`/builder/${duplicate.id}`);
  } else {
    alert("Failed to duplicate workout");
  }
}

function confirmDeleteWorkout(workout: Workout) {
  const confirmMsg = `Delete "${
    workout.name || "Untitled Workout"
  }"?\n\nThis action cannot be undone.`;
  if (confirm(confirmMsg)) {
    const success = deleteWorkout(workout.id);
    if (!success) {
      alert("Failed to delete workout");
    }
  }
}
</script>
