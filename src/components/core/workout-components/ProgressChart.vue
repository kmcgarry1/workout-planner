<!--
  ProgressChart.vue
  Simple SVG-based progress visualization component for workout analytics.
-->
<template>
  <div class="space-y-4">
    <!-- Chart Type Selector -->
    <div class="flex flex-wrap gap-2">
      <Button
        :variant="chartType === 'frequency' ? 'primary' : 'ghost'"
        size="sm"
        @click="chartType = 'frequency'"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="star" variant="flat" size="sm" />
        </template>
        Frequency
      </Button>
      <Button
        :variant="chartType === 'volume' ? 'primary' : 'ghost'"
        size="sm"
        @click="chartType = 'volume'"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="star" variant="flat" size="sm" />
        </template>
        Volume
      </Button>
      <Button
        :variant="chartType === 'streak' ? 'primary' : 'ghost'"
        size="sm"
        @click="chartType = 'streak'"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="spinner" variant="flat" size="sm" />
        </template>
        Streak
      </Button>
    </div>

    <!-- Chart Container -->
    <Card
      variant="elevated"
      padding="lg"
      rounded="lg"
      shadow="md"
      bg-class="bg-white dark:bg-gray-900"
      class="min-h-[300px]"
    >
      <CardHeader
        :title="chartConfig.title"
        :subtitle="chartConfig.subtitle"
        :divider="true"
        padding="md"
      >
        <template #prepend>
          <div :class="['p-2 rounded-lg', chartConfig.color]">
            <Icon
              :name="chartConfig.icon"
              variant="fill"
              size="md"
              class="text-white"
            />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <!-- Frequency Chart -->
        <div v-if="chartType === 'frequency'" class="space-y-4">
          <div class="h-64 relative">
            <svg viewBox="0 0 400 200" class="w-full h-full">
              <!-- Grid lines -->
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="0.5"
                  />
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(#grid)" />

              <!-- Bars -->
              <g v-for="(item, index) in frequencyData" :key="index">
                <rect
                  :x="index * 40 + 10"
                  :y="200 - (item.value / maxFrequency) * 180"
                  :width="30"
                  :height="(item.value / maxFrequency) * 180"
                  :fill="item.value > 0 ? '#3b82f6' : '#e5e7eb'"
                  rx="2"
                  class="transition-all duration-300 hover:opacity-80"
                />
                <text
                  :x="index * 40 + 25"
                  y="195"
                  text-anchor="middle"
                  class="text-xs fill-gray-600 dark:fill-gray-400"
                  font-family="system-ui"
                >
                  {{ item.label }}
                </text>
              </g>

              <!-- Y-axis labels -->
              <g
                class="text-xs fill-gray-600 dark:fill-gray-400"
                font-family="system-ui"
              >
                <text x="5" y="200" text-anchor="start">0</text>
                <text x="5" y="110" text-anchor="start">
                  {{ Math.round(maxFrequency / 2) }}
                </text>
                <text x="5" y="20" text-anchor="start">{{ maxFrequency }}</text>
              </g>
            </svg>
          </div>
          <div class="flex justify-center">
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm"
            >
              Workouts per {{ timeFrame === "weekly" ? "week" : "month" }} over
              time
            </Text>
          </div>
        </div>

        <!-- Volume Chart -->
        <div v-else-if="chartType === 'volume'" class="space-y-4">
          <div class="h-64 relative">
            <svg viewBox="0 0 400 200" class="w-full h-full">
              <!-- Grid -->
              <rect width="400" height="200" fill="url(#grid)" />

              <!-- Line chart -->
              <polyline
                v-if="volumePoints.length > 1"
                :points="volumePoints"
                fill="none"
                stroke="#10b981"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-all duration-300"
              />

              <!-- Data points -->
              <g v-for="(point, index) in volumeData" :key="index">
                <circle
                  :cx="index * 40 + 25"
                  :cy="200 - (point.value / maxVolume) * 180"
                  r="4"
                  fill="#10b981"
                  class="transition-all duration-300 hover:r-6"
                />
                <text
                  :x="index * 40 + 25"
                  y="195"
                  text-anchor="middle"
                  class="text-xs fill-gray-600 dark:fill-gray-400"
                  font-family="system-ui"
                >
                  {{ point.label }}
                </text>
              </g>

              <!-- Y-axis labels -->
              <g
                class="text-xs fill-gray-600 dark:fill-gray-400"
                font-family="system-ui"
              >
                <text x="5" y="200" text-anchor="start">0</text>
                <text x="5" y="110" text-anchor="start">
                  {{ formatVolume(maxVolume / 2) }}
                </text>
                <text x="5" y="20" text-anchor="start">
                  {{ formatVolume(maxVolume) }}
                </text>
              </g>
            </svg>
          </div>
          <div class="flex justify-center">
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm"
            >
              Total training volume (lbs × reps) over time
            </Text>
          </div>
        </div>

        <!-- Streak Chart -->
        <div v-else-if="chartType === 'streak'" class="space-y-4">
          <div class="grid grid-cols-7 gap-1 p-4">
            <div
              v-for="(day, index) in streakCalendar"
              :key="index"
              :class="[
                'aspect-square rounded text-xs font-medium flex items-center justify-center transition-all duration-200',
                day.hasWorkout
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : day.isToday
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
              ]"
              :title="day.date + (day.hasWorkout ? ' - Workout completed' : '')"
            >
              {{ day.day }}
            </div>
          </div>

          <div class="flex justify-center items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded"></div>
              <Text variant="body" class="text-gray-600 dark:text-gray-400"
                >Workout Day</Text
              >
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <Text variant="body" class="text-gray-600 dark:text-gray-400"
                >Rest Day</Text
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 bg-blue-500 rounded border-2 border-blue-600"
              ></div>
              <Text variant="body" class="text-gray-600 dark:text-gray-400"
                >Today</Text
              >
            </div>
          </div>
        </div>

        <!-- Time frame selector -->
        <div
          class="flex justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <Button
            :variant="timeFrame === 'weekly' ? 'primary' : 'ghost'"
            size="sm"
            @click="timeFrame = 'weekly'"
            class="font-semibold"
          >
            Weekly
          </Button>
          <Button
            :variant="timeFrame === 'monthly' ? 'primary' : 'ghost'"
            size="sm"
            @click="timeFrame = 'monthly'"
            class="font-semibold"
          >
            Monthly
          </Button>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "@/components/core/layout";
import { CardHeader, CardBody } from "@/components/core/layout/card-components";
import { Button, Icon, Text } from "@/components/core/basics";
import type { Workout } from "@/types/workout";

interface ProgressChartProps {
  workouts: Workout[];
}

const props = defineProps<ProgressChartProps>();

const chartType = ref<"frequency" | "volume" | "streak">("frequency");
const timeFrame = ref<"weekly" | "monthly">("weekly");

// Chart configuration
const chartConfig = computed(() => {
  switch (chartType.value) {
    case "frequency":
      return {
        title: "Workout Frequency",
        subtitle: "Track your consistency over time",
        icon: "star",
        color: "bg-blue-600",
      };
    case "volume":
      return {
        title: "Training Volume",
        subtitle: "Monitor your strength progression",
        icon: "star",
        color: "bg-green-600",
      };
    case "streak":
      return {
        title: "Workout Calendar",
        subtitle: "Visualize your workout streak",
        icon: "spinner",
        color: "bg-purple-600",
      };
    default:
      return {
        title: "Progress Chart",
        subtitle: "Track your fitness journey",
        icon: "star",
        color: "bg-gray-600",
      };
  }
});

// Frequency data
const frequencyData = computed(() => {
  const periods = [];
  const now = new Date();
  const periodsToShow = 10;

  for (let i = periodsToShow - 1; i >= 0; i--) {
    const periodStart = new Date();
    if (timeFrame.value === "weekly") {
      periodStart.setDate(now.getDate() - i * 7);
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 7);

      const workoutCount = props.workouts.filter((w) => {
        const workoutDate = new Date(w.date);
        return (
          workoutDate >= periodStart && workoutDate < periodEnd && w.completed
        );
      }).length;

      periods.push({
        label: `W${periodsToShow - i}`,
        value: workoutCount,
        period: `${periodStart.getMonth() + 1}/${periodStart.getDate()}`,
      });
    } else {
      periodStart.setMonth(now.getMonth() - i);
      periodStart.setDate(1);
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodStart.getMonth() + 1);

      const workoutCount = props.workouts.filter((w) => {
        const workoutDate = new Date(w.date);
        return (
          workoutDate >= periodStart && workoutDate < periodEnd && w.completed
        );
      }).length;

      periods.push({
        label: periodStart
          .toLocaleDateString("en-US", { month: "short" })
          .substring(0, 2),
        value: workoutCount,
        period: periodStart.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
      });
    }
  }

  return periods;
});

const maxFrequency = computed(() =>
  Math.max(...frequencyData.value.map((d) => d.value), 1)
);

// Volume data
const volumeData = computed(() => {
  const periods = [];
  const now = new Date();
  const periodsToShow = 10;

  for (let i = periodsToShow - 1; i >= 0; i--) {
    const periodStart = new Date();
    if (timeFrame.value === "weekly") {
      periodStart.setDate(now.getDate() - i * 7);
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 7);

      const volume = props.workouts
        .filter((w) => {
          const workoutDate = new Date(w.date);
          return (
            workoutDate >= periodStart && workoutDate < periodEnd && w.completed
          );
        })
        .reduce((total, workout) => {
          return (
            total +
            workout.exercises.reduce((workoutTotal, we) => {
              return (
                workoutTotal +
                we.sets.reduce((exerciseTotal, set) => {
                  if (
                    we.exercise.type === "strength" &&
                    set.weight &&
                    set.reps
                  ) {
                    return exerciseTotal + set.weight * set.reps;
                  }
                  return exerciseTotal;
                }, 0)
              );
            }, 0)
          );
        }, 0);

      periods.push({
        label: `W${periodsToShow - i}`,
        value: volume,
      });
    } else {
      periodStart.setMonth(now.getMonth() - i);
      periodStart.setDate(1);
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodStart.getMonth() + 1);

      const volume = props.workouts
        .filter((w) => {
          const workoutDate = new Date(w.date);
          return (
            workoutDate >= periodStart && workoutDate < periodEnd && w.completed
          );
        })
        .reduce((total, workout) => {
          return (
            total +
            workout.exercises.reduce((workoutTotal, we) => {
              return (
                workoutTotal +
                we.sets.reduce((exerciseTotal, set) => {
                  if (
                    we.exercise.type === "strength" &&
                    set.weight &&
                    set.reps
                  ) {
                    return exerciseTotal + set.weight * set.reps;
                  }
                  return exerciseTotal;
                }, 0)
              );
            }, 0)
          );
        }, 0);

      periods.push({
        label: periodStart
          .toLocaleDateString("en-US", { month: "short" })
          .substring(0, 2),
        value: volume,
      });
    }
  }

  return periods;
});

const maxVolume = computed(() =>
  Math.max(...volumeData.value.map((d) => d.value), 1000)
);

const volumePoints = computed(() => {
  return volumeData.value
    .map(
      (point, index) =>
        `${index * 40 + 25},${200 - (point.value / maxVolume.value) * 180}`
    )
    .join(" ");
});

// Streak calendar data
const streakCalendar = computed(() => {
  const days = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 41); // Show 6 weeks (42 days)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dateString = date.toISOString().split("T")[0];
    const hasWorkout = props.workouts.some(
      (w) => w.date.split("T")[0] === dateString && w.completed
    );
    const isToday = date.toDateString() === today.toDateString();

    days.push({
      day: date.getDate(),
      date: dateString,
      hasWorkout,
      isToday,
    });
  }

  return days;
});

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}
</script>
