<!--
  SetTracker.vue
  Component for tracking set completion with actual vs planned performance recording.
  
  Usage:
  <SetTracker 
    :set="currentSet" 
    :exercise="exercise" 
    @complete="handleSetComplete" 
    @update="handleSetUpdate" 
  />
-->
<template>
  <Card
    variant="elevated"
    padding="lg"
    rounded="xl"
    shadow="lg"
    :bg-class="
      set.completed
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-300 dark:border-emerald-700'
        : 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800'
    "
    class="transition-all duration-300"
  >
    <div class="space-y-6">
      <!-- Set Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-full font-black text-lg',
              set.completed
                ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                : 'bg-blue-600 text-white dark:bg-blue-500',
            ]"
          >
            {{ set.setNumber }}
          </div>
          <div>
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold"
            >
              Set {{ set.setNumber }}
            </Text>
            <Text variant="body" class="text-gray-600 dark:text-gray-400">
              {{ exercise.name }}
            </Text>
          </div>
        </div>

        <Icon
          v-if="set.completed"
          name="check"
          variant="fill"
          size="lg"
          class="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <!-- Planned vs Actual -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Planned -->
        <div class="space-y-2">
          <Text
            variant="subtitle"
            class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs"
          >
            Planned
          </Text>
          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <!-- Strength Exercise -->
            <template v-if="exercise.type === 'strength'">
              <div class="flex items-center gap-2 mb-2">
                <Icon
                  name="star"
                  variant="flat"
                  size="sm"
                  class="text-gray-500 dark:text-gray-400"
                />
                <Text
                  variant="body"
                  class="font-semibold text-gray-700 dark:text-gray-300"
                >
                  {{ set.reps }} reps
                </Text>
              </div>
              <div v-if="set.weight" class="flex items-center gap-2">
                <span class="w-4 h-4 bg-red-500 rounded-sm"></span>
                <Text
                  variant="body"
                  class="font-semibold text-gray-700 dark:text-gray-300"
                >
                  {{ set.weight }}{{ set.weightUnit || "lbs" }}
                </Text>
              </div>
            </template>

            <!-- Conditioning Exercise -->
            <template v-else>
              <div class="flex items-center gap-2">
                <Icon
                  name="spinner"
                  variant="flat"
                  size="sm"
                  class="text-gray-500 dark:text-gray-400"
                />
                <Text
                  variant="body"
                  class="font-semibold text-gray-700 dark:text-gray-300"
                >
                  {{ formatTime(set.time || 0) }}
                </Text>
              </div>
            </template>
          </div>
        </div>

        <!-- Actual -->
        <div class="space-y-2">
          <Text
            variant="subtitle"
            class="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs"
          >
            Actual
          </Text>
          <div
            class="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <!-- Strength Exercise -->
            <template v-if="exercise.type === 'strength'">
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <Icon
                    name="star"
                    variant="flat"
                    size="sm"
                    class="text-blue-500 dark:text-blue-400"
                  />
                  <Input
                    v-model="actualReps"
                    type="number"
                    :placeholder="String(set.reps || 0)"
                    variant="filled"
                    size="sm"
                    class="flex-1 text-center font-semibold"
                    :disabled="set.completed"
                  />
                  <span
                    class="text-sm text-gray-600 dark:text-gray-400 font-medium"
                    >reps</span
                  >
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 bg-blue-500 rounded-sm"></span>
                  <Input
                    v-model="actualWeight"
                    type="number"
                    :placeholder="String(set.weight || 0)"
                    variant="filled"
                    size="sm"
                    class="flex-1 text-center font-semibold"
                    :disabled="set.completed"
                  />
                  <span
                    class="text-sm text-gray-600 dark:text-gray-400 font-medium"
                    >{{ set.weightUnit || "lbs" }}</span
                  >
                </div>
              </div>
            </template>

            <!-- Conditioning Exercise -->
            <template v-else>
              <div class="flex items-center gap-2">
                <Icon
                  name="spinner"
                  variant="flat"
                  size="sm"
                  class="text-blue-500 dark:text-blue-400"
                />
                <Input
                  v-model="actualTimeMinutes"
                  type="number"
                  placeholder="0"
                  variant="filled"
                  size="sm"
                  class="w-16 text-center font-semibold"
                  :disabled="set.completed"
                />
                <span
                  class="text-sm text-gray-600 dark:text-gray-400 font-medium"
                  >:</span
                >
                <Input
                  v-model="actualTimeSeconds"
                  type="number"
                  placeholder="00"
                  min="0"
                  max="59"
                  variant="filled"
                  size="sm"
                  class="w-16 text-center font-semibold"
                  :disabled="set.completed"
                />
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="!set.completed">
        <label
          class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
        >
          Set Notes (optional)
        </label>
        <textarea
          v-model="setNotes"
          rows="2"
          placeholder="How did this set feel? RPE, form notes..."
          class="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 resize-none"
        />
      </div>

      <div
        v-else-if="setNotes"
        class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <Text
          variant="body"
          class="text-gray-600 dark:text-gray-400 italic text-sm"
        >
          💡 {{ setNotes }}
        </Text>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <Button
          v-if="!set.completed"
          variant="primary"
          size="lg"
          @click="completeSet"
          :disabled="!canComplete"
          class="flex-1 font-bold"
        >
          <template #leading>
            <Icon name="check" variant="flat" size="sm" />
          </template>
          Complete Set
        </Button>

        <Button
          v-else
          variant="secondary"
          size="lg"
          @click="undoSet"
          class="flex-1 font-semibold"
        >
          <template #leading>
            <Icon name="x" variant="flat" size="sm" />
          </template>
          Undo Complete
        </Button>

        <Button
          v-if="set.rest && !set.completed"
          variant="ghost"
          size="lg"
          @click="startRest"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="spinner" variant="flat" size="sm" />
          </template>
          Rest {{ set.rest }}s
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Card } from "../layout";
import { Button, Icon, Text, Input } from "../basics";
import type { ExerciseSet, Exercise } from "../../../types/workout";

interface SetTrackerProps {
  set: ExerciseSet;
  exercise: Exercise;
}

const props = defineProps<SetTrackerProps>();

const emit = defineEmits<{
  (
    e: "complete",
    data: {
      setNumber: number;
      actualReps?: number;
      actualWeight?: number;
      actualTime?: number;
      notes?: string;
    }
  ): void;
  (e: "undo", setNumber: number): void;
  (
    e: "update",
    data: {
      setNumber: number;
      actualReps?: number;
      actualWeight?: number;
      actualTime?: number;
      notes?: string;
    }
  ): void;
  (e: "rest", duration: number): void;
}>();

const actualReps = ref("");
const actualWeight = ref("");
const actualTimeMinutes = ref("");
const actualTimeSeconds = ref("");
const setNotes = ref("");

// Initialize with existing actual values if set is already completed
onMounted(() => {
  if (props.set.actualReps !== undefined) {
    actualReps.value = String(props.set.actualReps);
  }
  if (props.set.actualWeight !== undefined) {
    actualWeight.value = String(props.set.actualWeight);
  }
  if (props.set.actualTime !== undefined) {
    const mins = Math.floor(props.set.actualTime / 60);
    const secs = props.set.actualTime % 60;
    actualTimeMinutes.value = String(mins);
    actualTimeSeconds.value = String(secs);
  }
});

const canComplete = computed(() => {
  if (props.exercise.type === "strength") {
    return actualReps.value !== "" || actualWeight.value !== "";
  } else {
    return actualTimeMinutes.value !== "" || actualTimeSeconds.value !== "";
  }
});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function completeSet() {
  const data: any = {
    setNumber: props.set.setNumber,
    notes: setNotes.value || undefined,
  };

  if (props.exercise.type === "strength") {
    if (actualReps.value) data.actualReps = parseInt(actualReps.value);
    if (actualWeight.value) data.actualWeight = parseFloat(actualWeight.value);
  } else {
    const mins = parseInt(actualTimeMinutes.value) || 0;
    const secs = parseInt(actualTimeSeconds.value) || 0;
    if (mins > 0 || secs > 0) {
      data.actualTime = mins * 60 + secs;
    }
  }

  emit("complete", data);
}

function undoSet() {
  emit("undo", props.set.setNumber);
}

function startRest() {
  if (props.set.rest) {
    emit("rest", props.set.rest);
  }
}

// Emit updates as user types
watch(
  [actualReps, actualWeight, actualTimeMinutes, actualTimeSeconds, setNotes],
  () => {
    const data: any = {
      setNumber: props.set.setNumber,
      notes: setNotes.value || undefined,
    };

    if (props.exercise.type === "strength") {
      if (actualReps.value) data.actualReps = parseInt(actualReps.value);
      if (actualWeight.value)
        data.actualWeight = parseFloat(actualWeight.value);
    } else {
      const mins = parseInt(actualTimeMinutes.value) || 0;
      const secs = parseInt(actualTimeSeconds.value) || 0;
      if (mins > 0 || secs > 0) {
        data.actualTime = mins * 60 + secs;
      }
    }

    emit("update", data);
  }
);
</script>
