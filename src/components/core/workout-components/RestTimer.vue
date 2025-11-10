<!--
  RestTimer.vue
  Timer component for rest periods between sets with start/pause/skip functionality.
  
  Usage:
  <RestTimer :duration="90" @complete="handleRestComplete" @skip="handleSkip" />
-->
<template>
  <Card
    variant="elevated"
    padding="lg"
    rounded="xl"
    shadow="xl"
    :bg-class="
      isActive
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-300 dark:border-blue-700'
        : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
    "
    class="text-center transition-all duration-300"
  >
    <div class="space-y-6">
      <!-- Timer Display -->
      <div class="relative">
        <!-- Circular Progress -->
        <div class="relative w-32 h-32 mx-auto">
          <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
            <!-- Background circle -->
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              :class="
                isActive
                  ? 'text-blue-100 dark:text-blue-900/50'
                  : 'text-gray-200 dark:text-gray-700'
              "
              stroke-width="8"
              fill="none"
            />
            <!-- Progress circle -->
            <circle
              cx="72"
              cy="72"
              r="64"
              :stroke="isActive ? '#3B82F6' : '#9CA3AF'"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              class="transition-all duration-1000 ease-linear"
            />
          </svg>

          <!-- Center content -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div>
              <div
                :class="[
                  'text-3xl font-black tracking-wider transition-colors duration-300',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400',
                ]"
              >
                {{ formatTime(remaining) }}
              </div>
              <div
                :class="[
                  'text-xs font-bold uppercase tracking-widest mt-1',
                  isActive
                    ? 'text-blue-500 dark:text-blue-500'
                    : 'text-gray-500 dark:text-gray-500',
                ]"
              >
                {{ isActive ? "Rest" : "Ready" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timer Info -->
      <div class="space-y-2">
        <Text
          variant="title"
          :class="[
            'font-bold',
            isActive
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300',
          ]"
        >
          {{ isActive ? "Rest Period" : "Rest Ready" }}
        </Text>
        <Text variant="body" class="text-gray-600 dark:text-gray-400">
          {{
            isActive
              ? "Take your time to recover"
              : `${formatTime(duration)} rest between sets`
          }}
        </Text>
      </div>

      <!-- Controls -->
      <div class="flex gap-3 justify-center">
        <Button
          v-if="!isActive"
          variant="primary"
          size="lg"
          @click="startTimer"
          class="font-bold px-8"
        >
          <template #leading>
            <Icon name="spinner" variant="flat" size="sm" />
          </template>
          Start Rest
        </Button>

        <template v-else>
          <Button
            variant="secondary"
            size="lg"
            @click="togglePause"
            class="font-bold"
          >
            <template #leading>
              <Icon
                :name="isPaused ? 'spinner' : 'x'"
                variant="flat"
                size="sm"
              />
            </template>
            {{ isPaused ? "Resume" : "Pause" }}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            @click="skipRest"
            class="font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <template #leading>
              <Icon name="check" variant="flat" size="sm" />
            </template>
            Skip Rest
          </Button>
        </template>
      </div>

      <!-- Quick Adjust (when not active) -->
      <div v-if="!isActive" class="flex gap-2 justify-center">
        <Button
          v-for="preset in [30, 60, 90, 120]"
          :key="preset"
          variant="ghost"
          size="sm"
          @click="setDuration(preset)"
          :class="
            duration === preset
              ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
              : ''
          "
          class="font-semibold"
        >
          {{ preset }}s
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Card } from "../layout";
import { Button, Icon, Text } from "../basics";

interface RestTimerProps {
  duration: number; // rest duration in seconds
  autoStart?: boolean;
}

const props = withDefaults(defineProps<RestTimerProps>(), {
  autoStart: false,
});

const emit = defineEmits<{
  (e: "complete"): void;
  (e: "skip"): void;
  (e: "start"): void;
}>();

const remaining = ref(props.duration);
const isActive = ref(false);
const isPaused = ref(false);
const startTime = ref<number | null>(null);
const pausedTime = ref(0);
const intervalId = ref<number | null>(null);

// Circle geometry for progress indicator
const circumference = 2 * Math.PI * 64;

const strokeDashoffset = computed(() => {
  if (props.duration === 0) return 0;
  const progress = remaining.value / props.duration;
  return circumference * (1 - progress);
});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setDuration(newDuration: number) {
  if (!isActive.value) {
    remaining.value = newDuration;
  }
}

function startTimer() {
  if (remaining.value <= 0) return;

  isActive.value = true;
  isPaused.value = false;
  startTime.value = Date.now();
  pausedTime.value = 0;

  emit("start");

  intervalId.value = window.setInterval(() => {
    if (isPaused.value || !startTime.value) return;

    const elapsed = Math.floor(
      (Date.now() - startTime.value - pausedTime.value) / 1000
    );
    remaining.value = Math.max(0, props.duration - elapsed);

    if (remaining.value === 0) {
      completeTimer();
    }
  }, 100);
}

function togglePause() {
  if (!isActive.value) return;

  if (isPaused.value) {
    // Resume
    pausedTime.value += Date.now() - (startTime.value || Date.now());
    startTime.value = Date.now();
    isPaused.value = false;
  } else {
    // Pause
    isPaused.value = true;
  }
}

function skipRest() {
  stopTimer();
  emit("skip");
}

function completeTimer() {
  stopTimer();
  emit("complete");
}

function stopTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  isActive.value = false;
  isPaused.value = false;
  remaining.value = props.duration;
  startTime.value = null;
  pausedTime.value = 0;
}

// Auto-start if requested
onMounted(() => {
  if (props.autoStart) {
    startTimer();
  }
});

// Cleanup
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

// Reset when duration prop changes
function resetTimer() {
  stopTimer();
  remaining.value = props.duration;
}

// Watch for duration changes
defineExpose({
  startTimer,
  stopTimer,
  resetTimer,
  isActive: computed(() => isActive.value),
});
</script>
