<!--
  WorkoutProgress.vue
  Component showing current workout progress including exercise, set, and overall completion.
  
  Usage:
  <WorkoutProgress 
    :workout="workout" 
    :current-exercise-index="0" 
    :current-set-index="0"
    :elapsed-time="1200" 
  />
-->
<template>
  <Card
    variant="elevated"
    padding="lg"
    rounded="xl"
    shadow="lg"
    bg-class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800"
    class="sticky top-6"
  >
    <div class="space-y-6">
      <!-- Header -->
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center p-3 mb-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl"
        >
          <Icon name="star" variant="fill" size="lg" class="text-white" />
        </div>
        <Text variant="title" class="text-gray-900 dark:text-white font-bold">
          {{ workout.name || "Active Workout" }}
        </Text>
        <Text variant="body" class="text-gray-600 dark:text-gray-400">
          {{ formatElapsedTime(elapsedTime) }} elapsed
        </Text>
      </div>

      <!-- Overall Progress -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Text
            variant="subtitle"
            class="text-gray-700 dark:text-gray-300 font-semibold"
          >
            Overall Progress
          </Text>
          <Text
            variant="body"
            class="text-purple-600 dark:text-purple-400 font-bold"
          >
            {{ completedSets }}/{{ totalSets }} sets
          </Text>
        </div>

        <!-- Progress bar -->
        <div
          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>

        <div class="text-center">
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            {{ Math.round(overallProgress) }}% complete
          </Text>
        </div>
      </div>

      <!-- Current Exercise -->
      <div class="space-y-3">
        <Text
          variant="subtitle"
          class="text-gray-700 dark:text-gray-300 font-semibold"
        >
          Current Exercise
        </Text>

        <div
          v-if="currentExercise"
          class="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-700"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Icon
                :name="
                  currentExercise.exercise.icon ||
                  (currentExercise.exercise.type === 'strength'
                    ? 'star'
                    : 'spinner')
                "
                variant="fill"
                size="md"
                class="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div class="flex-1">
              <Text
                variant="title"
                class="text-gray-900 dark:text-white font-bold mb-1"
              >
                {{ currentExerciseIndex + 1 }}.
                {{ currentExercise.exercise.name }}
              </Text>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 mb-2"
              >
                {{ currentExercise.exercise.category }}
              </Text>

              <!-- Set progress for current exercise -->
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="font-semibold text-purple-600 dark:text-purple-400"
                >
                  Set {{ currentSetIndex + 1 }} of
                  {{ currentExercise.sets.length }}
                </span>
                <div class="flex gap-1">
                  <div
                    v-for="(set, idx) in currentExercise.sets"
                    :key="set.setNumber"
                    :class="[
                      'w-2 h-2 rounded-full',
                      set.completed
                        ? 'bg-emerald-500'
                        : idx === currentSetIndex
                        ? 'bg-purple-500'
                        : 'bg-gray-300 dark:bg-gray-600',
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exercise List -->
      <div class="space-y-3">
        <Text
          variant="subtitle"
          class="text-gray-700 dark:text-gray-300 font-semibold"
        >
          Exercises ({{ currentExerciseIndex + 1 }}/{{
            workout.exercises.length
          }})
        </Text>

        <div class="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
          <div
            v-for="(exercise, idx) in workout.exercises"
            :key="exercise.id"
            :class="[
              'p-3 rounded-lg border-2 transition-all duration-200',
              idx === currentExerciseIndex
                ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/30'
                : exerciseCompleted(exercise)
                ? 'border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                  idx === currentExerciseIndex
                    ? 'bg-purple-600 text-white dark:bg-purple-500'
                    : exerciseCompleted(exercise)
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300',
                ]"
              >
                {{ exerciseCompleted(exercise) ? "✓" : idx + 1 }}
              </div>

              <div class="flex-1">
                <Text
                  variant="body"
                  :class="[
                    'font-semibold',
                    idx === currentExerciseIndex
                      ? 'text-purple-700 dark:text-purple-300'
                      : exerciseCompleted(exercise)
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300',
                  ]"
                >
                  {{ exercise.exercise.name }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-500 dark:text-gray-400 text-sm"
                >
                  {{ exercise.sets.filter((s) => s.completed).length }}/{{
                    exercise.sets.length
                  }}
                  sets
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div
        class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="text-center">
          <Text
            variant="body"
            class="text-2xl font-black text-purple-600 dark:text-purple-400"
          >
            {{ completedExercises }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 text-sm font-semibold"
          >
            Exercises Done
          </Text>
        </div>
        <div class="text-center">
          <Text
            variant="body"
            class="text-2xl font-black text-pink-600 dark:text-pink-400"
          >
            {{ workout.exercises.length - completedExercises }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 text-sm font-semibold"
          >
            Remaining
          </Text>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Card } from "../layout";
import { Icon, Text } from "../basics";
import type { Workout, WorkoutExercise } from "../../../types/workout";

interface WorkoutProgressProps {
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  elapsedTime: number; // in seconds
}

const props = defineProps<WorkoutProgressProps>();

const currentExercise = computed(() => {
  return props.workout.exercises[props.currentExerciseIndex] || null;
});

const totalSets = computed(() => {
  return props.workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
});

const completedSets = computed(() => {
  return props.workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter((set) => set.completed).length;
  }, 0);
});

const overallProgress = computed(() => {
  if (totalSets.value === 0) return 0;
  return (completedSets.value / totalSets.value) * 100;
});

const completedExercises = computed(() => {
  return props.workout.exercises.filter((exercise) =>
    exercise.sets.every((set) => set.completed)
  ).length;
});

function exerciseCompleted(exercise: WorkoutExercise): boolean {
  return exercise.sets.every((set) => set.completed);
}

function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
</script>
