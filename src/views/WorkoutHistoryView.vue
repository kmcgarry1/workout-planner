<!--
  WorkoutHistoryView.vue
  Comprehensive workout history with analytics, filtering, and progress tracking.
-->
<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg"
      >
        <Icon name="star" variant="fill" size="xl" class="text-white" />
      </div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-3 tracking-tight"
      >
        Workout History
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium max-w-2xl mx-auto"
      >
        Track your fitness journey and analyze your progress
      </Text>
    </div>

    <!-- Quick Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800"
      >
        <div class="text-center">
          <div class="p-3 bg-blue-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ workoutStats.total }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Total Workouts
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border-2 border-emerald-200 dark:border-emerald-800"
      >
        <div class="text-center">
          <div class="p-3 bg-emerald-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="check" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ workoutStats.completed }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Completed
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-200 dark:border-purple-800"
      >
        <div class="text-center">
          <div class="p-3 bg-purple-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="spinner" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ workoutStats.thisWeek }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            This Week
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-2 border-orange-200 dark:border-orange-800"
      >
        <div class="text-center">
          <div class="p-3 bg-orange-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ currentStreak }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Day Streak
          </Text>
        </div>
      </Card>
    </div>

    <!-- Filters and Search -->
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex flex-wrap gap-3">
          <Input
            v-model="searchQuery"
            variant="filled"
            size="md"
            placeholder="Search workouts..."
            clearable
            class="min-w-[250px]"
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

          <select
            v-model="statusFilter"
            class="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <select
            v-model="timeFilter"
            class="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div class="flex gap-2">
          <Button
            variant="ghost"
            size="md"
            @click="showCalendarView = !showCalendarView"
            class="font-semibold"
          >
            <template #leading>
              <Icon
                :name="showCalendarView ? 'star' : 'star'"
                variant="flat"
                size="sm"
              />
            </template>
            {{ showCalendarView ? "List View" : "Calendar View" }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Progress Summary Card -->
    <Card
      variant="elevated"
      padding="none"
      rounded="xl"
      shadow="lg"
      bg-class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700"
    >
      <CardHeader
        title="Progress Summary"
        subtitle="Your fitness journey at a glance"
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div
            class="p-2.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg"
          >
            <Icon name="star" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <Text
              variant="subtitle"
              class="text-gray-700 dark:text-gray-300 font-bold"
            >
              Recent Activity
            </Text>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Last workout:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ lastWorkoutDate || "None yet" }}
                </Text>
              </div>
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Avg per week:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ averageWorkoutsPerWeek }}
                </Text>
              </div>
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Best streak:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ bestStreak }} days
                </Text>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Text
              variant="subtitle"
              class="text-gray-700 dark:text-gray-300 font-bold"
            >
              Exercise Breakdown
            </Text>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Strength:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ exerciseBreakdown.strength }}%
                </Text>
              </div>
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Conditioning:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ exerciseBreakdown.conditioning }}%
                </Text>
              </div>
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Most used:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ mostUsedExercise || "None yet" }}
                </Text>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Text
              variant="subtitle"
              class="text-gray-700 dark:text-gray-300 font-bold"
            >
              Goals & Achievements
            </Text>
            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <Text variant="body" class="text-gray-600 dark:text-gray-400"
                  >Monthly goal:</Text
                >
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ monthlyProgress }}/{{ monthlyGoal }}
                </Text>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                  :style="{
                    width: `${Math.min(
                      100,
                      (monthlyProgress / monthlyGoal) * 100
                    )}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>

    <!-- Progress Visualization -->
    <ProgressChart :workouts="workouts" />

    <!-- Workout History List -->
    <Card
      variant="elevated"
      padding="none"
      rounded="xl"
      shadow="lg"
      bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
    >
      <CardHeader
        :title="`Workout History (${filteredWorkouts.length})`"
        :subtitle="
          filteredWorkouts.length === workouts.length
            ? 'All workouts'
            : `Filtered from ${workouts.length} total`
        "
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div class="p-2.5 bg-gray-600 dark:bg-gray-500 rounded-lg">
            <Icon name="star" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <div v-if="filteredWorkouts.length === 0" class="text-center py-12">
          <div class="mb-6 flex justify-center">
            <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
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
            class="text-gray-600 dark:text-gray-400 font-bold mb-3"
            >No workouts found</Text
          >
          <Text
            variant="body"
            class="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto"
          >
            {{
              workouts.length === 0
                ? "Start your fitness journey by creating your first workout!"
                : "Try adjusting your search or filter criteria"
            }}
          </Text>
          <Button
            v-if="workouts.length === 0"
            variant="primary"
            size="lg"
            @click="$router.push('/builder')"
            class="font-bold"
          >
            <template #leading>
              <Icon name="plus" variant="flat" size="sm" />
            </template>
            Create First Workout
          </Button>
        </div>

        <div v-else class="space-y-4">
          <Card
            v-for="workout in filteredWorkouts"
            :key="workout.id"
            variant="outlined"
            padding="none"
            rounded="lg"
            :bg-class="
              workout.completed
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            "
            class="transition-all duration-200 hover:shadow-md"
          >
            <CardHeader
              :title="workout.name"
              :subtitle="`${workout.exercises.length} exercises • ${formatDate(
                workout.date
              )}`"
              padding="lg"
              :divider="false"
            >
              <template #prepend>
                <div
                  :class="[
                    'p-2.5 rounded-lg',
                    workout.completed
                      ? 'bg-green-600 dark:bg-green-500'
                      : 'bg-gray-600 dark:bg-gray-500',
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
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <Text
                      variant="body"
                      :class="
                        workout.completed
                          ? 'text-green-700 dark:text-green-300 font-bold'
                          : 'text-gray-600 dark:text-gray-400 font-medium'
                      "
                    >
                      {{ workout.completed ? "Completed" : "Incomplete" }}
                    </Text>
                    <Text
                      variant="body"
                      class="text-gray-500 dark:text-gray-500 text-sm"
                    >
                      {{
                        workout.totalDuration
                          ? `${workout.totalDuration} min`
                          : "No duration"
                      }}
                    </Text>
                  </div>

                  <div class="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="viewWorkoutDetails(workout)"
                      class="font-semibold"
                    >
                      View
                    </Button>
                    <Button
                      v-if="!workout.completed"
                      variant="primary"
                      size="sm"
                      @click="resumeWorkout(workout)"
                      class="font-semibold"
                    >
                      Resume
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="duplicateWorkout(workout)"
                      class="font-semibold"
                    >
                      <template #leading>
                        <Icon name="plus" variant="flat" size="sm" />
                      </template>
                      Again
                    </Button>
                  </div>
                </div>
              </template>
            </CardHeader>

            <!-- Exercise summary for completed workouts -->
            <CardBody
              v-if="workout.completed && workout.exercises.length > 0"
              padding="lg"
              class="pt-0"
            >
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="exercise in workout.exercises.slice(0, 4)"
                  :key="exercise.id"
                  :class="[
                    'text-xs px-2 py-1 rounded-md font-medium',
                    exercise.exercise.type === 'strength'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
                  ]"
                >
                  {{ exercise.exercise.name }}
                </span>
                <span
                  v-if="workout.exercises.length > 4"
                  class="text-xs px-2 py-1 rounded-md font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  +{{ workout.exercises.length - 4 }} more
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "@/components/core/layout";
import { CardHeader, CardBody } from "@/components/core/layout/card-components";
import { Button, Icon, Text, Input } from "@/components/core/basics";
import { ProgressChart } from "@/components/core/workout-components";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import { useRouter } from "vue-router";

const { workouts, workoutStats, duplicateWorkout, loadFromStorage } =
  useWorkoutStorage();
const router = useRouter();

// Load data on mount
loadFromStorage();

const searchQuery = ref("");
const statusFilter = ref("");
const timeFilter = ref("all");
const showCalendarView = ref(false);

// Computed analytics
const currentStreak = computed(() => {
  const sortedWorkouts = [...workouts]
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedWorkouts.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else if (diffDays === streak + 1) {
      // Allow for 1 day gap to continue streak
      streak++;
    } else {
      break;
    }
  }

  return streak;
});

const bestStreak = computed(() => {
  // Implementation would calculate the best historical streak
  return Math.max(currentStreak.value, 5); // Placeholder
});

const lastWorkoutDate = computed(() => {
  const completedWorkouts = workouts.filter((w) => w.completed);
  if (completedWorkouts.length === 0) return null;

  const latest = completedWorkouts.reduce((latest, current) =>
    new Date(current.date) > new Date(latest.date) ? current : latest
  );

  return formatDate(latest.date);
});

const averageWorkoutsPerWeek = computed(() => {
  const weeks = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date("2025-01-01").getTime()) /
        (1000 * 60 * 60 * 24 * 7)
    )
  );
  return Math.round((workoutStats.value.completed / weeks) * 10) / 10;
});

const exerciseBreakdown = computed(() => {
  const allExercises = workouts.flatMap((w) =>
    w.exercises.map((we) => we.exercise)
  );
  if (allExercises.length === 0) return { strength: 0, conditioning: 0 };

  const strengthCount = allExercises.filter(
    (ex) => ex.type === "strength"
  ).length;
  const conditioningCount = allExercises.filter(
    (ex) => ex.type === "conditioning"
  ).length;

  return {
    strength: Math.round((strengthCount / allExercises.length) * 100),
    conditioning: Math.round((conditioningCount / allExercises.length) * 100),
  };
});

const mostUsedExercise = computed(() => {
  const exerciseCounts = new Map<string, number>();

  workouts.forEach((workout) => {
    workout.exercises.forEach((we) => {
      const current = exerciseCounts.get(we.exercise.name) || 0;
      exerciseCounts.set(we.exercise.name, current + 1);
    });
  });

  if (exerciseCounts.size === 0) return null;

  const [mostUsed] = Array.from(exerciseCounts.entries()).sort(
    ([, a], [, b]) => b - a
  );
  return mostUsed ? mostUsed[0] : null;
});

const monthlyGoal = computed(() => 12); // Could be user-configurable
const monthlyProgress = computed(() => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  return workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    return (
      w.completed &&
      workoutDate.getMonth() === thisMonth &&
      workoutDate.getFullYear() === thisYear
    );
  }).length;
});

const filteredWorkouts = computed(() => {
  let result = [...workouts];

  // Status filter
  if (statusFilter.value) {
    result = result.filter((w) =>
      statusFilter.value === "completed" ? w.completed : !w.completed
    );
  }

  // Time filter
  if (timeFilter.value !== "all") {
    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter.value) {
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    result = result.filter((w) => new Date(w.date) >= filterDate);
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((w) => {
      const searchableText = [
        w.name,
        w.notes,
        ...w.exercises.map((we) => we.exercise.name),
        ...w.exercises.map((we) => we.exercise.category).filter(Boolean),
      ]
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString();
}

function viewWorkoutDetails(workout: any) {
  // Could show a detailed modal or navigate to a detailed view
  router.push(`/workout/${workout.id}`);
}

function resumeWorkout(workout: any) {
  router.push(`/workout/${workout.id}`);
}
</script>
