<!--
  EnhancedActiveWorkoutView.vue
  Enhanced workout execution view with real-time performance tracking and analytics.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <div v-if="!workout" class="text-center py-16">
        <div class="mb-6 flex justify-center">
          <div class="p-6 bg-red-100 dark:bg-red-900/30 rounded-3xl">
            <Icon
              name="x"
              variant="flat"
              size="xl"
              class="text-red-500 dark:text-red-400"
            />
          </div>
        </div>
        <Text
          variant="header"
          class="text-gray-900 dark:text-white font-bold mb-4"
        >
          Workout Not Found
        </Text>
        <Text variant="body" class="text-gray-600 dark:text-gray-400 mb-8">
          The requested workout could not be loaded.
        </Text>
        <Button
          variant="primary"
          size="lg"
          @click="$router.push('/')"
          class="font-bold"
        >
          <template #leading>
            <Icon name="home" variant="flat" size="sm" />
          </template>
          Return Home
        </Button>
      </div>

      <div v-else-if="!workoutState.isActive" class="text-center py-16">
        <div class="max-w-md mx-auto space-y-6">
          <div class="mb-6 flex justify-center">
            <div class="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-3xl">
              <Icon
                name="star"
                variant="fill"
                size="xl"
                class="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
          <Text
            variant="header"
            class="text-gray-900 dark:text-white font-bold mb-4"
          >
            Ready to Start?
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 mb-8 text-lg"
          >
            {{ workout.name }} • {{ workout.exercises.length }} exercises • ~{{
              estimatedDuration
            }}
            min
          </Text>

          <!-- Pre-workout checklist -->
          <Card
            variant="outlined"
            padding="lg"
            rounded="xl"
            bg-class="bg-white dark:bg-gray-800"
          >
            <CardBody>
              <div class="space-y-4 text-left">
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-4"
                >
                  Pre-Workout Checklist
                </Text>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preWorkoutChecks.warmup"
                    class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Text variant="body" class="text-gray-700 dark:text-gray-300">
                    Completed warm-up
                  </Text>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preWorkoutChecks.equipment"
                    class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Text variant="body" class="text-gray-700 dark:text-gray-300">
                    Equipment ready and available
                  </Text>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="preWorkoutChecks.hydration"
                    class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Text variant="body" class="text-gray-700 dark:text-gray-300">
                    Hydrated and energized
                  </Text>
                </label>
              </div>
            </CardBody>
          </Card>

          <Button
            variant="primary"
            size="xl"
            @click="startWorkout"
            :disabled="!canStartWorkout"
            class="w-full font-bold text-lg py-4"
          >
            <template #leading>
              <Icon name="star" variant="fill" size="md" />
            </template>
            Start Workout
          </Button>
        </div>
      </div>

      <!-- Active Workout Tracking -->
      <div v-else>
        <EnhancedWorkoutTracking
          :workout="workout"
          :current-exercise-index="workoutState.currentExerciseIndex"
          :is-paused="workoutState.isPaused"
          @pause="pauseWorkout"
          @complete="completeWorkout"
          @update-set="updateSet"
          @next-exercise="nextExercise"
          @previous-exercise="previousExercise"
        />

        <!-- Exit Workout Modal -->
        <div
          v-if="showExitModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div class="w-full max-w-md">
            <Card
              variant="elevated"
              padding="none"
              rounded="xl"
              shadow="xl"
              bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
            >
              <CardHeader
                title="End Workout?"
                subtitle="Your progress will be saved"
                :divider="true"
                padding="lg"
              >
                <template #prepend>
                  <div class="p-2.5 bg-red-600 rounded-lg">
                    <Icon
                      name="x"
                      variant="fill"
                      size="md"
                      class="text-white"
                    />
                  </div>
                </template>
              </CardHeader>

              <CardBody padding="lg">
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  You've completed {{ completedSets }} out of
                  {{ totalSets }} sets. Are you sure you want to end this
                  workout?
                </Text>
              </CardBody>

              <CardActions justify="between" padding="lg">
                <Button
                  variant="ghost"
                  size="md"
                  @click="showExitModal = false"
                  class="font-semibold"
                >
                  Continue Workout
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  @click="confirmEndWorkout"
                  class="font-semibold"
                >
                  End Workout
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Buttons for Active Workout -->
    <div
      v-if="workoutState.isActive"
      class="fixed bottom-6 left-6 flex flex-col gap-3"
    >
      <Button
        variant="outline"
        size="md"
        @click="showExitModal = true"
        class="rounded-full w-14 h-14 shadow-lg"
      >
        <Icon name="x" variant="flat" size="md" />
      </Button>

      <Button
        :variant="workoutState.isPaused ? 'primary' : 'outline'"
        size="md"
        @click="togglePause"
        class="rounded-full w-14 h-14 shadow-lg"
      >
        <Icon
          :name="workoutState.isPaused ? 'star' : 'spinner'"
          variant="flat"
          size="md"
        />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Button, Icon, Text } from "../components/core/basics";
import { Card } from "../components/core/layout";
import {
  CardHeader,
  CardBody,
  CardActions,
} from "../components/core/layout/card-components";
import { EnhancedWorkoutTracking } from "../components/core/workout-components";
import { useWorkoutStorage } from "../composables/useWorkoutStorage";
import type { Workout, ExerciseSet } from "../types/workout";

const router = useRouter();
const route = useRoute();
const { workouts, saveWorkout } = useWorkoutStorage();

// Reactive state
const workout = ref<Workout | null>(null);
const workoutState = ref({
  isActive: false,
  isPaused: false,
  currentExerciseIndex: 0,
  startTime: Date.now(),
});

const preWorkoutChecks = ref({
  warmup: false,
  equipment: false,
  hydration: false,
});

const showExitModal = ref(false);

// Load workout on mount
onMounted(() => {
  const workoutId = route.params.workoutId as string;
  const foundWorkout = workouts.find((w) => w.id === workoutId);

  if (foundWorkout) {
    workout.value = { ...foundWorkout };

    // If workout was already started, restore state
    if (workout.value.startedAt && !workout.value.completed) {
      workoutState.value.isActive = true;
      workoutState.value.startTime = new Date(
        workout.value.startedAt
      ).getTime();
    }
  }
});

// Computed properties
const canStartWorkout = computed(() => {
  return (
    preWorkoutChecks.value.warmup &&
    preWorkoutChecks.value.equipment &&
    preWorkoutChecks.value.hydration
  );
});

const estimatedDuration = computed(() => {
  if (!workout.value) return 0;

  // Estimate based on exercises and sets
  let totalMinutes = 0;
  workout.value.exercises.forEach((exercise) => {
    // ~2 minutes per set for strength, ~1 minute per set for conditioning
    const timePerSet = exercise.exercise.type === "strength" ? 2 : 1;
    totalMinutes += exercise.sets.length * timePerSet;
  });

  return Math.round(totalMinutes);
});

const completedSets = computed(() => {
  if (!workout.value) return 0;
  return workout.value.exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter((set) => set.completed).length;
  }, 0);
});

const totalSets = computed(() => {
  if (!workout.value) return 0;
  return workout.value.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );
});

// Workout control functions
function startWorkout() {
  if (!workout.value) return;

  workoutState.value.isActive = true;
  workoutState.value.startTime = Date.now();

  // Update workout with start time
  workout.value.startedAt = new Date().toISOString();

  saveWorkoutProgress();
}

function pauseWorkout() {
  workoutState.value.isPaused = true;
  saveWorkoutProgress();
}

function togglePause() {
  workoutState.value.isPaused = !workoutState.value.isPaused;
  saveWorkoutProgress();
}

function nextExercise() {
  if (
    workoutState.value.currentExerciseIndex <
    (workout.value?.exercises.length || 0) - 1
  ) {
    workoutState.value.currentExerciseIndex++;
  }
}

function previousExercise() {
  if (workoutState.value.currentExerciseIndex > 0) {
    workoutState.value.currentExerciseIndex--;
  }
}

function updateSet(
  exerciseIndex: number,
  setIndex: number,
  setData: Partial<ExerciseSet>
) {
  if (!workout.value) return;

  const exercise = workout.value.exercises[exerciseIndex];
  if (exercise && exercise.sets[setIndex]) {
    Object.assign(exercise.sets[setIndex], setData);

    if (setData.completed) {
      exercise.sets[setIndex].completedAt = new Date().toISOString();
    }

    saveWorkoutProgress();
  }
}

function completeWorkout() {
  if (!workout.value) return;

  workout.value.completed = true;
  workout.value.completedAt = new Date().toISOString();

  // Calculate performance metrics
  calculateWorkoutMetrics();

  saveWorkoutProgress();

  // Navigate to workout summary or home
  router.push({
    name: "home",
    query: { completed: workout.value.id },
  });
}

function confirmEndWorkout() {
  if (!workout.value) return;

  // Mark workout as completed even if not finished
  workout.value.completed = true;
  workout.value.completedAt = new Date().toISOString();

  calculateWorkoutMetrics();
  saveWorkoutProgress();

  router.push("/");
}

function calculateWorkoutMetrics() {
  if (!workout.value) return;

  const startTime = new Date(workout.value.startedAt!).getTime();
  const endTime = new Date().getTime();
  workout.value.actualDuration = Math.round((endTime - startTime) / 60000); // in minutes

  // Calculate performance score based on actual vs planned
  let totalPlanned = 0;
  let totalActual = 0;

  workout.value.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.completed) {
        if (exercise.exercise.type === "strength" && set.weight && set.reps) {
          const planned = set.weight * set.reps;
          const actual =
            (set.actualWeight || set.weight) * (set.actualReps || set.reps);
          totalPlanned += planned;
          totalActual += actual;
        }
      }
    });
  });

  if (totalPlanned > 0) {
    workout.value.performanceScore = totalActual / totalPlanned;
  }
}

function saveWorkoutProgress() {
  if (!workout.value) return;

  // Save the updated workout
  saveWorkout(workout.value);
}
</script>
