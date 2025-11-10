<!--
  EnhancedDashboard.vue
  Comprehensive dashboard with analytics integration and enhanced workout overview.
-->
<template>
  <div class="space-y-8">
    <!-- Welcome Header with Quick Actions -->
    <div class="text-center relative">
      <div
        class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
      >
        <Icon name="star" variant="fill" size="xl" class="text-white" />
      </div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-3 tracking-tight"
      >
        Fitness Dashboard
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium max-w-2xl mx-auto mb-6"
      >
        Your complete fitness tracking hub with analytics and progress insights
      </Text>

      <!-- Quick Action Buttons -->
      <div class="flex justify-center gap-4 mb-8">
        <Button
          variant="primary"
          size="lg"
          @click="$router.push('/builder')"
          class="font-bold"
        >
          <template #leading>
            <Icon name="plus" variant="flat" size="sm" />
          </template>
          New Workout
        </Button>
        <Button
          variant="outline"
          size="lg"
          @click="startLastWorkout"
          class="font-bold"
        >
          <template #leading>
            <Icon name="star" variant="flat" size="sm" />
          </template>
          Quick Start
        </Button>
      </div>
    </div>

    <!-- Analytics Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Current Streak -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800"
      >
        <div class="text-center">
          <div class="p-3 bg-green-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl mb-1"
          >
            {{ analytics.currentStreak }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Day Streak
          </Text>
          <Text
            variant="body"
            class="text-green-600 dark:text-green-400 text-xs font-semibold mt-1"
          >
            {{ analytics.workoutsThisWeek.value.length > 0 ? "+" : ""
            }}{{ analytics.workoutsThisWeek.value.length }} this week
          </Text>
        </div>
      </Card>

      <!-- Total Workouts -->
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
            class="text-gray-900 dark:text-white font-bold text-2xl mb-1"
          >
            {{ analytics.totalWorkouts }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Total Workouts
          </Text>
          <Text
            variant="body"
            class="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-1"
          >
            {{ analytics.workoutsThisMonth }} this month
          </Text>
        </div>
      </Card>

      <!-- Personal Records -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-200 dark:border-purple-800"
      >
        <div class="text-center">
          <div class="p-3 bg-purple-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl mb-1"
          >
            {{ analytics.personalRecords.value.length }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Personal Records
          </Text>
          <Text
            variant="body"
            class="text-yellow-600 dark:text-yellow-400 text-xs font-semibold mt-1"
          >
            {{ analytics.personalRecords.value.length }} recent PRs
          </Text>
        </div>
      </Card>

      <!-- Average Duration -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-2 border-orange-200 dark:border-orange-800"
      >
        <div class="text-center">
          <div class="p-3 bg-orange-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="check" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl mb-1"
          >
            {{ Math.round(analytics.averageWorkoutDuration.value) }}m
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Avg Duration
          </Text>
          <Text
            variant="body"
            class="text-orange-600 dark:text-orange-400 text-xs font-semibold mt-1"
          >
            {{
              Math.round(
                (analytics.totalWorkouts.value *
                  analytics.averageWorkoutDuration.value) /
                  60
              )
            }}h total
          </Text>
        </div>
      </Card>
    </div>

    <!-- Progress Overview Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Weekly Progress Chart -->
      <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
        <CardHeader
          title="Weekly Progress"
          subtitle="Your workout frequency this week"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-blue-600 rounded-lg">
              <Icon name="star" variant="fill" size="md" class="text-white" />
            </div>
          </template>
          <template #append>
            <Button variant="ghost" size="sm" @click="$router.push('/history')">
              View All
            </Button>
          </template>
        </CardHeader>
        <CardBody padding="lg">
          <div
            class="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <Text variant="body" class="text-gray-500 dark:text-gray-400">
              Progress Chart Coming Soon
            </Text>
          </div>
        </CardBody>
      </Card>

      <!-- Recent Activity -->
      <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
        <CardHeader
          title="Recent Activity"
          subtitle="Your latest workouts and achievements"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-green-600 rounded-lg">
              <Icon name="check" variant="fill" size="md" class="text-white" />
            </div>
          </template>
        </CardHeader>
        <CardBody padding="sm">
          <div v-if="recentActivities.length === 0" class="text-center py-8">
            <Icon
              name="star"
              variant="flat"
              size="lg"
              class="text-gray-300 dark:text-gray-600 mb-3"
            />
            <Text variant="body" class="text-gray-500 dark:text-gray-500">
              No recent activity
            </Text>
          </div>
          <div v-else class="space-y-1">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold',
                  activity.type === 'workout'
                    ? 'bg-blue-500'
                    : activity.type === 'pr'
                    ? 'bg-purple-500'
                    : 'bg-green-500',
                ]"
              >
                <Icon
                  :name="
                    activity.type === 'workout'
                      ? 'star'
                      : activity.type === 'pr'
                      ? 'star'
                      : 'check'
                  "
                  variant="fill"
                  size="sm"
                />
              </div>
              <div class="flex-1">
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{ activity.title }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  {{ activity.description }} •
                  {{ formatRelativeDate(activity.date) }}
                </Text>
              </div>
              <Button
                v-if="activity.action"
                variant="ghost"
                size="sm"
                @click="activity.action.handler"
                class="text-xs"
              >
                {{ activity.action.label }}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>

    <!-- Quick Access Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Workout Library -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        class="cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
        @click="$router.push('/library')"
      >
        <div class="text-center">
          <div
            class="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl mb-4 w-fit mx-auto"
          >
            <Icon name="star" variant="fill" size="xl" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold mb-2"
          >
            Workout Library
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium mb-4"
          >
            Browse {{ workoutStats.total }} saved workouts
          </Text>
          <Button variant="primary" size="md" class="w-full font-semibold">
            <template #leading>
              <Icon name="star" variant="flat" size="sm" />
            </template>
            Browse Library
          </Button>
        </div>
      </Card>

      <!-- Personal Records -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        class="cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
        @click="$router.push('/records')"
      >
        <div class="text-center">
          <div
            class="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 w-fit mx-auto"
          >
            <Icon name="star" variant="fill" size="xl" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold mb-2"
          >
            Personal Records
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium mb-4"
          >
            Track your {{ analytics.personalRecords.value.length }} achievements
          </Text>
          <Button variant="primary" size="md" class="w-full font-semibold">
            <template #leading>
              <Icon name="star" variant="fill" size="sm" />
            </template>
            View Records
          </Button>
        </div>
      </Card>

      <!-- Exercise Management -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        class="cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
        @click="$router.push('/exercises')"
      >
        <div class="text-center">
          <div
            class="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl mb-4 w-fit mx-auto"
          >
            <Icon name="star" variant="fill" size="xl" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold mb-2"
          >
            Exercise Library
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium mb-4"
          >
            Manage {{ exerciseStats.total }} exercises
          </Text>
          <Button variant="primary" size="md" class="w-full font-semibold">
            <template #leading>
              <Icon name="star" variant="fill" size="sm" />
            </template>
            Manage Exercises
          </Button>
        </div>
      </Card>
    </div>

    <!-- Today's Recommendations -->
    <Card
      v-if="recommendations.length > 0"
      variant="elevated"
      padding="none"
      rounded="xl"
      shadow="lg"
    >
      <CardHeader
        title="Today's Recommendations"
        subtitle="Personalized suggestions based on your progress"
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div class="p-2.5 bg-yellow-600 rounded-lg">
            <Icon name="star" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>
      <CardBody padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="rec in recommendations"
            :key="rec.id"
            class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-yellow-600 rounded-lg">
                <Icon name="star" variant="fill" size="sm" class="text-white" />
              </div>
              <div class="flex-1">
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  {{ rec.title }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm mb-3"
                >
                  {{ rec.description }}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  @click="rec.action"
                  class="text-xs font-semibold"
                >
                  {{ rec.actionLabel }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody } from "../layout/card-components";
import { Button, Icon, Text } from "../basics";
import { useWorkoutStorage } from "../../../composables/useWorkoutStorage";
import { useWorkoutAnalytics } from "../../../composables/useWorkoutAnalytics";
import { useRouter } from "vue-router";

const router = useRouter();
const { workouts, customExercises, workoutStats, loadFromStorage } =
  useWorkoutStorage();
const analytics = useWorkoutAnalytics(workouts);

// Load data on component mount
onMounted(() => {
  loadFromStorage();
});

// Computed properties
const exerciseStats = computed(() => ({
  total: customExercises.length,
  recent: customExercises.filter((ex) => {
    if (!ex.createdAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(ex.createdAt) > weekAgo;
  }).length,
}));

const recentActivities = computed(() => {
  const activities: any[] = [];

  // Add recent workouts
  const recentWorkouts = workouts.slice(-5).reverse();
  recentWorkouts.forEach((workout) => {
    if (workout.completed) {
      activities.push({
        id: `workout-${workout.id}`,
        type: "workout",
        title: `Completed ${workout.name}`,
        description: `${workout.exercises.length} exercises`,
        date: workout.completedAt || workout.date,
        action: {
          label: "View",
          handler: () => router.push(`/history`),
        },
      });
    }
  });

  // Add recent PRs
  const recentPRs = analytics.personalRecords.value
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  recentPRs.forEach((pr) => {
    activities.push({
      id: `pr-${pr.exercise}-${pr.date}`,
      type: "pr",
      title: `New PR: ${pr.exercise}`,
      description: `${pr.weight} lbs × ${pr.reps} reps`,
      date: pr.date,
      action: {
        label: "View PRs",
        handler: () => router.push("/records"),
      },
    });
  });

  // Sort by date and limit to 5 most recent
  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

// Calculate days since last workout
const daysSinceLastWorkout = computed(() => {
  const lastWorkout = analytics.completedWorkouts.value[0];
  if (!lastWorkout) return 0;
  const lastDate = new Date(lastWorkout.date);
  const today = new Date();
  return Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );
});

const recommendations = computed(() => {
  const recs: any[] = [];

  // Recommend workout if user hasn't worked out in a while
  if (daysSinceLastWorkout.value > 2) {
    recs.push({
      id: "workout-reminder",
      title: "Time for a Workout!",
      description: `It's been ${daysSinceLastWorkout.value} days since your last session`,
      actionLabel: "Start Workout",
      action: () => router.push("/builder"),
    });
  }

  // Recommend setting goals if user has PRs but no goals
  if (analytics.personalRecords.value.length > 0) {
    recs.push({
      id: "set-goals",
      title: "Set New Goals",
      description: "Challenge yourself with specific strength targets",
      actionLabel: "Set Goals",
      action: () => router.push("/records"),
    });
  }

  return recs;
});

// Helper functions
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function startLastWorkout() {
  const lastWorkout = workouts[workouts.length - 1];
  if (lastWorkout) {
    // Create a copy of the last workout for a new session
    router.push(`/builder?template=${lastWorkout.id}`);
  } else {
    router.push("/builder");
  }
}
</script>
