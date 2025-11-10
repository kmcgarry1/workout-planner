<!--
  ActiveWorkoutView.vue
  Main view for executing workouts with real-time tracking, timers, and progress monitoring.
-->
<template>
  <div v-if="!workout" class="text-center py-16">
    <div class="mb-4 flex justify-center">
      <div class="p-4 bg-red-100 dark:bg-red-950 rounded-2xl">
        <Icon
          name="x"
          variant="flat"
          size="xl"
          class="text-red-500 dark:text-red-400"
        />
      </div>
    </div>
    <Text variant="title" class="text-red-600 dark:text-red-400 font-bold mb-2"
      >Workout Not Found</Text
    >
    <Text variant="body" class="text-gray-600 dark:text-gray-400 mb-6">
      The workout you're trying to start could not be found.
    </Text>
    <Button variant="primary" @click="$router.push('/library')">
      <template #leading>
        <Icon name="home" variant="flat" size="sm" />
      </template>
      Back to Library
    </Button>
  </div>

  <div v-else class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <Button
        variant="ghost"
        size="md"
        @click="confirmExit"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="x" variant="flat" size="sm" />
        </template>
        Exit Workout
      </Button>

      <div class="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          @click="togglePause"
          class="font-semibold"
        >
          <template #leading>
            <Icon :name="isPaused ? 'spinner' : 'x'" variant="flat" size="sm" />
          </template>
          {{ isPaused ? "Resume" : "Pause" }}
        </Button>

        <Button
          v-if="workoutCompleted"
          variant="primary"
          size="md"
          @click="finishWorkout"
          class="font-bold"
        >
          <template #leading>
            <Icon name="check" variant="flat" size="sm" />
          </template>
          Finish Workout
        </Button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Progress Sidebar -->
      <div class="xl:col-span-1">
        <WorkoutProgress
          :workout="workout"
          :current-exercise-index="currentExerciseIndex"
          :current-set-index="currentSetIndex"
          :elapsed-time="elapsedTime"
        />
      </div>

      <!-- Main Content -->
      <div class="xl:col-span-3 space-y-6">
        <!-- Current Exercise -->
        <div v-if="currentExercise">
          <Card
            variant="elevated"
            padding="lg"
            rounded="xl"
            shadow="xl"
            bg-class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800"
          >
            <div class="text-center mb-6">
              <div
                class="inline-flex items-center justify-center p-4 mb-4 bg-blue-600 dark:bg-blue-500 rounded-2xl"
              >
                <Icon
                  :name="
                    currentExercise.exercise.icon ||
                    (currentExercise.exercise.type === 'strength'
                      ? 'star'
                      : 'spinner')
                  "
                  variant="fill"
                  size="xl"
                  class="text-white"
                />
              </div>
              <Text
                variant="header"
                class="text-gray-900 dark:text-white font-black mb-2"
              >
                {{ currentExercise.exercise.name }}
              </Text>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 text-lg"
              >
                {{ currentExercise.exercise.category }} • Exercise
                {{ currentExerciseIndex + 1 }} of {{ workout.exercises.length }}
              </Text>
            </div>

            <!-- Exercise Notes -->
            <div
              v-if="currentExercise.notes"
              class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 italic"
              >
                💡 {{ currentExercise.notes }}
              </Text>
            </div>

            <!-- Navigation between exercises -->
            <div class="flex justify-between items-center mb-6">
              <Button
                variant="ghost"
                size="md"
                @click="previousExercise"
                :disabled="currentExerciseIndex === 0"
                class="font-semibold"
              >
                <template #leading>
                  <Icon name="x" variant="flat" size="sm" />
                </template>
                Previous
              </Button>

              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-semibold"
              >
                Set {{ currentSetIndex + 1 }} of
                {{ currentExercise.sets.length }}
              </Text>

              <Button
                variant="ghost"
                size="md"
                @click="nextExercise"
                :disabled="
                  currentExerciseIndex === workout.exercises.length - 1
                "
                class="font-semibold"
              >
                <template #trailing>
                  <Icon name="check" variant="flat" size="sm" />
                </template>
                Next
              </Button>
            </div>
          </Card>
        </div>

        <!-- Current Set Tracker -->
        <div v-if="currentSet && currentExercise">
          <SetTracker
            :set="currentSet"
            :exercise="currentExercise.exercise"
            @complete="handleSetComplete"
            @undo="handleSetUndo"
            @update="handleSetUpdate"
            @rest="startRestTimer"
          />
        </div>

        <!-- Rest Timer -->
        <div v-if="showRestTimer">
          <RestTimer
            :duration="restDuration"
            :auto-start="true"
            @complete="handleRestComplete"
            @skip="handleRestComplete"
            @start="handleRestStart"
          />
        </div>

        <!-- Workout Complete -->
        <div v-if="workoutCompleted" class="text-center py-12">
          <div class="mb-6 flex justify-center">
            <div
              class="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl"
            >
              <Icon name="check" variant="fill" size="xl" class="text-white" />
            </div>
          </div>
          <Text
            variant="header"
            class="text-emerald-600 dark:text-emerald-400 font-black mb-3"
          >
            Workout Complete!
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
          >
            Great job! You've completed all
            {{ workout.exercises.length }} exercises and {{ totalSets }} sets.
          </Text>
          <div class="flex gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              @click="finishWorkout"
              class="font-bold"
            >
              <template #leading>
                <Icon name="check" variant="flat" size="sm" />
              </template>
              Finish & Save
            </Button>
            <Button
              variant="secondary"
              size="lg"
              @click="$router.push('/library')"
              class="font-semibold"
            >
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Card } from "@/components/core/layout";
import { Button, Icon, Text } from "@/components/core/basics";
import {
  WorkoutProgress,
  SetTracker,
  RestTimer,
} from "@/components/core/workout-components";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import type { Workout, WorkoutExercise, ExerciseSet } from "@/types/workout";

interface Props {
  workoutId?: string;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const { getWorkout, saveWorkout } = useWorkoutStorage();

const workout = ref<Workout | null>(null);
const currentExerciseIndex = ref(0);
const currentSetIndex = ref(0);
const elapsedTime = ref(0);
const workoutStartTime = ref<number>(Date.now());
const isPaused = ref(false);
const pausedTime = ref(0);
const pauseStartTime = ref<number | null>(null);
const showRestTimer = ref(false);
const restDuration = ref(60);

// Timer for elapsed time
let elapsedTimeInterval: number | null = null;

const currentExercise = computed((): WorkoutExercise | null => {
  return workout.value?.exercises[currentExerciseIndex.value] || null;
});

const currentSet = computed((): ExerciseSet | null => {
  return currentExercise.value?.sets[currentSetIndex.value] || null;
});

const workoutCompleted = computed(() => {
  if (!workout.value) return false;
  return workout.value.exercises.every((exercise) =>
    exercise.sets.every((set) => set.completed)
  );
});

const totalSets = computed(() => {
  if (!workout.value) return 0;
  return workout.value.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
});

// Load workout and initialize
onMounted(() => {
  const id = props.workoutId || (route.params.workoutId as string);
  if (id) {
    const foundWorkout = getWorkout(id);
    if (foundWorkout) {
      // Create a copy for the active session
      workout.value = {
        ...foundWorkout,
        startedAt: new Date().toISOString(),
      };

      // Find the first incomplete set
      findNextIncompleteSet();

      // Start elapsed time tracking
      startElapsedTimeTracking();
    } else {
      console.error(`Workout with ID ${id} not found`);
    }
  }
});

onUnmounted(() => {
  if (elapsedTimeInterval) {
    clearInterval(elapsedTimeInterval);
  }
});

function startElapsedTimeTracking() {
  elapsedTimeInterval = window.setInterval(() => {
    if (!isPaused.value) {
      const now = Date.now();
      const totalPausedTime =
        pausedTime.value +
        (pauseStartTime.value ? now - pauseStartTime.value : 0);
      elapsedTime.value = Math.floor(
        (now - workoutStartTime.value - totalPausedTime) / 1000
      );
    }
  }, 1000);
}

function findNextIncompleteSet() {
  if (!workout.value) return;

  for (
    let exerciseIdx = 0;
    exerciseIdx < workout.value.exercises.length;
    exerciseIdx++
  ) {
    const exercise = workout.value.exercises[exerciseIdx];
    if (!exercise) continue;

    for (let setIdx = 0; setIdx < exercise.sets.length; setIdx++) {
      if (!exercise.sets[setIdx]?.completed) {
        currentExerciseIndex.value = exerciseIdx;
        currentSetIndex.value = setIdx;
        return;
      }
    }
  }

  // All sets completed - go to last exercise/set
  currentExerciseIndex.value = workout.value.exercises.length - 1;
  const lastExercise = workout.value.exercises[currentExerciseIndex.value];
  currentSetIndex.value = (lastExercise?.sets?.length ?? 1) - 1;
}

function handleSetComplete(data: {
  setNumber: number;
  actualReps?: number;
  actualWeight?: number;
  actualTime?: number;
  notes?: string;
}) {
  if (!workout.value || !currentExercise.value) return;

  const set = currentExercise.value.sets.find(
    (s) => s.setNumber === data.setNumber
  );
  if (set) {
    set.completed = true;
    set.completedAt = new Date().toISOString();
    if (data.actualReps !== undefined) set.actualReps = data.actualReps;
    if (data.actualWeight !== undefined) set.actualWeight = data.actualWeight;
    if (data.actualTime !== undefined) set.actualTime = data.actualTime;

    // Move to next set or exercise
    moveToNextSet();

    // Auto-save progress
    saveProgress();
  }
}

function handleSetUndo(setNumber: number) {
  if (!workout.value || !currentExercise.value) return;

  const set = currentExercise.value.sets.find((s) => s.setNumber === setNumber);
  if (set) {
    set.completed = false;
    delete set.completedAt;
    delete set.actualReps;
    delete set.actualWeight;
    delete set.actualTime;

    // Move back to this set if needed
    currentSetIndex.value = Math.min(currentSetIndex.value, setNumber - 1);

    saveProgress();
  }
}

function handleSetUpdate(data: {
  setNumber: number;
  actualReps?: number;
  actualWeight?: number;
  actualTime?: number;
  notes?: string;
}) {
  // Real-time updates while user is typing - could be used for auto-save
}

function moveToNextSet() {
  if (!currentExercise.value) return;

  // Check if there are more sets in current exercise
  if (currentSetIndex.value < currentExercise.value.sets.length - 1) {
    currentSetIndex.value++;
  } else {
    // Move to next exercise
    nextExercise();
  }
}

function nextExercise() {
  if (!workout.value) return;

  if (currentExerciseIndex.value < workout.value.exercises.length - 1) {
    currentExerciseIndex.value++;
    currentSetIndex.value = 0;
  }
}

function previousExercise() {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--;
    currentSetIndex.value = 0;
  }
}

function startRestTimer(duration: number) {
  restDuration.value = duration;
  showRestTimer.value = true;
}

function handleRestComplete() {
  showRestTimer.value = false;
}

function handleRestStart() {
  // Rest timer started
}

function togglePause() {
  if (isPaused.value) {
    // Resume
    if (pauseStartTime.value) {
      pausedTime.value += Date.now() - pauseStartTime.value;
      pauseStartTime.value = null;
    }
    isPaused.value = false;
  } else {
    // Pause
    pauseStartTime.value = Date.now();
    isPaused.value = true;
  }
}

function saveProgress() {
  if (workout.value) {
    saveWorkout(workout.value);
  }
}

function finishWorkout() {
  if (!workout.value) return;

  workout.value.completed = true;
  workout.value.completedAt = new Date().toISOString();
  workout.value.totalDuration = Math.floor(elapsedTime.value / 60);

  const success = saveWorkout(workout.value);
  if (success) {
    router.push("/library");
  } else {
    alert("Failed to save workout");
  }
}

function confirmExit() {
  const hasProgress = workout.value?.exercises.some((ex) =>
    ex.sets.some((set) => set.completed)
  );

  if (hasProgress) {
    const confirmed = confirm(
      "You have unsaved progress. Do you want to save your workout before exiting?"
    );
    if (confirmed) {
      saveProgress();
    }
  }

  router.push("/library");
}

// Auto-save progress periodically
watch([currentExerciseIndex, currentSetIndex], () => {
  saveProgress();
});
</script>
