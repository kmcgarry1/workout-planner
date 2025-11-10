<!--
  EnhancedWorkoutTracking.vue
  Advanced workout tracking component with actual vs planned performance, completion times, and difficulty ratings.
-->
<template>
  <div class="space-y-6">
    <!-- Workout Overview Header -->
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <Text
            variant="header"
            color-class="text-gray-900 dark:text-white"
            class="font-bold mb-2"
          >
            {{ workout.name }}
          </Text>
          <Text
            variant="body"
            color-class="text-gray-600 dark:text-gray-400"
            class="font-medium"
          >
            Started {{ formatTime(workoutStartTime) }} •
            {{ formatDuration(elapsedTime) }} elapsed
          </Text>
        </div>
        <div class="flex items-center gap-4">
          <!-- Overall Progress -->
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ Math.round(overallProgress) }}%
            </div>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Complete
            </Text>
          </div>
          <!-- Circular Progress -->
          <div class="relative w-16 h-16">
            <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <!-- Background circle -->
              <circle
                cx="32"
                cy="32"
                r="28"
                class="fill-none stroke-gray-200 dark:stroke-gray-700"
                stroke-width="6"
              />
              <!-- Progress circle -->
              <circle
                cx="32"
                cy="32"
                r="28"
                class="fill-none stroke-blue-600 dark:stroke-blue-400 transition-all duration-300"
                stroke-width="6"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - overallProgress / 100)"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ completedSets }}
          </div>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            Sets Done
          </Text>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ totalSets }}
          </div>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            Total Sets
          </Text>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentDifficulty }}/10
          </div>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            Difficulty
          </Text>
        </div>
        <div class="text-center">
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ estimatedTimeRemaining }}
          </div>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            Est. Remaining
          </Text>
        </div>
      </div>
    </div>

    <!-- Exercise Progress List -->
    <div class="space-y-4">
      <div
        v-for="(exercise, index) in workout.exercises"
        :key="exercise.id"
        :class="[
          'transition-all duration-300 rounded-xl border-2',
          currentExerciseIndex === index
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg scale-[1.02]'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        ]"
      >
        <div class="p-6">
          <!-- Exercise Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <!-- Exercise Status Icon -->
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
                  getExerciseStatusClass(exercise),
                ]"
              >
                {{ index + 1 }}
              </div>

              <div>
                <Text
                  variant="title"
                  color-class="text-gray-900 dark:text-white"
                  class="font-bold mb-1"
                >
                  {{ exercise.exercise.name }}
                </Text>
                <Text
                  variant="body"
                  color-class="text-gray-600 dark:text-gray-400"
                  class="font-medium"
                >
                  {{ getExerciseProgressText(exercise) }}
                </Text>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Exercise Progress Bar -->
              <div class="w-24">
                <div
                  class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"
                >
                  <div
                    :class="[
                      'h-3 rounded-full transition-all duration-300',
                      getExerciseProgressBarClass(exercise),
                    ]"
                    :style="{ width: `${getExerciseProgress(exercise)}%` }"
                  ></div>
                </div>
                <Text
                  variant="body"
                  class="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center"
                >
                  {{ Math.round(getExerciseProgress(exercise)) }}%
                </Text>
              </div>

              <!-- Performance vs Plan Indicator -->
              <div
                v-if="hasActualPerformance(exercise)"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold',
                  getPerformanceIndicatorClass(exercise),
                ]"
              >
                {{ getPerformanceIndicatorText(exercise) }}
              </div>
            </div>
          </div>

          <!-- Sets Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div
              v-for="(set, setIndex) in exercise.sets"
              :key="setIndex"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200',
                getSetClass(exercise, setIndex),
              ]"
            >
              <div class="flex items-center justify-between mb-3">
                <Text
                  variant="body"
                  class="font-bold text-gray-900 dark:text-white"
                >
                  Set {{ set.setNumber }}
                </Text>
                <div
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    set.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  <Icon
                    v-if="set.completed"
                    name="check"
                    variant="flat"
                    size="sm"
                  />
                  <span v-else>{{ setIndex + 1 }}</span>
                </div>
              </div>

              <!-- Planned vs Actual Performance -->
              <div class="space-y-2">
                <!-- Weight -->
                <div
                  v-if="exercise.exercise.type === 'strength'"
                  class="flex justify-between items-center"
                >
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    Weight:
                  </Text>
                  <div class="text-sm">
                    <span class="text-gray-900 dark:text-white font-semibold">
                      {{ set.actualWeight || set.weight || 0 }} lbs
                    </span>
                    <span
                      v-if="set.actualWeight && set.actualWeight !== set.weight"
                      :class="[
                        'ml-2 text-xs',
                        set.actualWeight > (set.weight || 0)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400',
                      ]"
                    >
                      ({{ set.actualWeight > (set.weight || 0) ? "+" : ""
                      }}{{ set.actualWeight - (set.weight || 0) }})
                    </span>
                  </div>
                </div>

                <!-- Reps -->
                <div
                  v-if="exercise.exercise.type === 'strength'"
                  class="flex justify-between items-center"
                >
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    Reps:
                  </Text>
                  <div class="text-sm">
                    <span class="text-gray-900 dark:text-white font-semibold">
                      {{ set.actualReps || set.reps || 0 }}
                    </span>
                    <span
                      v-if="set.actualReps && set.actualReps !== set.reps"
                      :class="[
                        'ml-2 text-xs',
                        set.actualReps > (set.reps || 0)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400',
                      ]"
                    >
                      ({{ set.actualReps > (set.reps || 0) ? "+" : ""
                      }}{{ set.actualReps - (set.reps || 0) }})
                    </span>
                  </div>
                </div>

                <!-- Time for conditioning -->
                <div
                  v-if="exercise.exercise.type === 'conditioning'"
                  class="flex justify-between items-center"
                >
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    Time:
                  </Text>
                  <div class="text-sm">
                    <span class="text-gray-900 dark:text-white font-semibold">
                      {{ formatSeconds(set.actualTime || set.time || 0) }}
                    </span>
                    <span
                      v-if="set.actualTime && set.actualTime !== set.time"
                      :class="[
                        'ml-2 text-xs',
                        set.actualTime < (set.time || 0)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400',
                      ]"
                    >
                      ({{ set.actualTime < (set.time || 0) ? "-" : "+"
                      }}{{ Math.abs(set.actualTime - (set.time || 0)) }}s)
                    </span>
                  </div>
                </div>

                <!-- Set Duration -->
                <div
                  v-if="set.completed && set.completedAt"
                  class="flex justify-between items-center"
                >
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    Duration:
                  </Text>
                  <Text
                    variant="body"
                    class="text-gray-900 dark:text-white text-sm font-semibold"
                  >
                    {{ getSetDuration(set) }}
                  </Text>
                </div>
              </div>

              <!-- Performance Rating for completed sets -->
              <div
                v-if="set.completed"
                class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              >
                <div class="flex justify-between items-center">
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm font-medium"
                  >
                    Feel:
                  </Text>
                  <div class="flex gap-1">
                    <div
                      v-for="rating in 5"
                      :key="rating"
                      :class="[
                        'w-4 h-4 rounded-full border-2 transition-colors duration-150',
                        (set.difficultyRating || 0) >= rating
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'border-gray-300 dark:border-gray-600',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 sticky bottom-6">
      <Button
        variant="outline"
        size="lg"
        @click="pauseWorkout"
        :disabled="isPaused"
        class="flex-1 font-bold"
      >
        <template #leading>
          <Icon name="spinner" variant="flat" size="sm" />
        </template>
        {{ isPaused ? "Paused" : "Pause" }}
      </Button>

      <Button
        variant="primary"
        size="lg"
        @click="completeWorkout"
        :disabled="!canCompleteWorkout"
        class="flex-1 font-bold"
      >
        <template #leading>
          <Icon name="check" variant="flat" size="sm" />
        </template>
        Complete Workout
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Button, Icon, Text } from "../basics";
import type {
  Workout,
  WorkoutExercise,
  ExerciseSet,
} from "../../../types/workout";

interface Props {
  workout: Workout;
  currentExerciseIndex: number;
  isPaused: boolean;
}

const props = defineProps<Props>();

// Time tracking
const workoutStartTime = ref(Date.now());
const elapsedTime = ref(0);
const currentDifficulty = ref(5);
const circumference = 2 * Math.PI * 28;

// Update elapsed time every second
let timeInterval: number | undefined;

onMounted(() => {
  if (props.workout.startedAt) {
    workoutStartTime.value = new Date(props.workout.startedAt).getTime();
  }

  timeInterval = window.setInterval(() => {
    if (!props.isPaused) {
      elapsedTime.value = Date.now() - workoutStartTime.value;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

// Computed properties
const completedSets = computed(() => {
  return props.workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.filter((set) => set.completed).length;
  }, 0);
});

const totalSets = computed(() => {
  return props.workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );
});

const overallProgress = computed(() => {
  return totalSets.value > 0
    ? (completedSets.value / totalSets.value) * 100
    : 0;
});

const canCompleteWorkout = computed(() => {
  return overallProgress.value >= 80; // Allow completion at 80% progress
});

const estimatedTimeRemaining = computed(() => {
  const avgSetTime = elapsedTime.value / Math.max(completedSets.value, 1);
  const remainingSets = totalSets.value - completedSets.value;
  const remaining = avgSetTime * remainingSets;
  return formatDuration(remaining);
});

// Helper functions
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds}s`;
}

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;
}

function getExerciseProgress(exercise: WorkoutExercise): number {
  const completed = exercise.sets.filter((set) => set.completed).length;
  return exercise.sets.length > 0
    ? (completed / exercise.sets.length) * 100
    : 0;
}

function getExerciseProgressText(exercise: WorkoutExercise): string {
  const completed = exercise.sets.filter((set) => set.completed).length;
  return `${completed}/${exercise.sets.length} sets completed`;
}

function getExerciseStatusClass(exercise: WorkoutExercise): string {
  const progress = getExerciseProgress(exercise);
  if (progress === 100) return "bg-green-500";
  if (progress > 0) return "bg-blue-500";
  return "bg-gray-400 dark:bg-gray-600";
}

function getExerciseProgressBarClass(exercise: WorkoutExercise): string {
  const progress = getExerciseProgress(exercise);
  if (progress === 100) return "bg-green-500";
  if (progress > 0) return "bg-blue-500";
  return "bg-gray-300";
}

function hasActualPerformance(exercise: WorkoutExercise): boolean {
  return exercise.sets.some(
    (set) =>
      set.actualWeight !== undefined ||
      set.actualReps !== undefined ||
      set.actualTime !== undefined
  );
}

function getPerformanceIndicatorClass(exercise: WorkoutExercise): string {
  const performance = calculatePerformanceScore(exercise);
  if (performance > 1.05)
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (performance < 0.95)
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
}

function getPerformanceIndicatorText(exercise: WorkoutExercise): string {
  const performance = calculatePerformanceScore(exercise);
  if (performance > 1.05) return "Above Plan";
  if (performance < 0.95) return "Below Plan";
  return "On Target";
}

function calculatePerformanceScore(exercise: WorkoutExercise): number {
  let totalPlanned = 0;
  let totalActual = 0;
  let hasData = false;

  exercise.sets.forEach((set) => {
    if (exercise.exercise.type === "strength" && set.weight && set.reps) {
      const plannedVolume = set.weight * set.reps;
      const actualVolume =
        (set.actualWeight || set.weight) * (set.actualReps || set.reps);
      totalPlanned += plannedVolume;
      totalActual += actualVolume;
      hasData = true;
    } else if (exercise.exercise.type === "conditioning" && set.time) {
      // For conditioning, lower time is better performance
      totalPlanned += set.time;
      totalActual += set.actualTime || set.time;
      hasData = true;
    }
  });

  if (!hasData || totalPlanned === 0) return 1;

  if (exercise.exercise.type === "conditioning") {
    // For conditioning, invert the ratio since lower time = better performance
    return totalPlanned / totalActual;
  }

  return totalActual / totalPlanned;
}

function getSetClass(exercise: WorkoutExercise, setIndex: number): string {
  const set = exercise.sets[setIndex];
  const isCurrentExercise = props.currentExerciseIndex === exercise.order - 1;

  if (set.completed) {
    return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30";
  }
  if (isCurrentExercise) {
    return "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30";
  }
  return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50";
}

function getSetDuration(set: ExerciseSet): string {
  if (!set.completedAt) return "-";

  // Calculate duration from start of set to completion
  // This would need to track when each set started
  return "45s"; // Placeholder - would need actual timing
}

function pauseWorkout() {
  // Emit pause event to parent
}

function completeWorkout() {
  // Emit complete event to parent
}
</script>
