<!--
  DashboardDemo.vue
  Demo component showcasing our new layout components for refactoring
  Usage: <DashboardDemo /> - Shows DashboardHeader, QuickStatsGrid, DashboardSection patterns
-->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <!-- Page Header -->
    <DashboardHeader
      title="🏋️ Fitness Dashboard"
      description="Track your progress and achieve your fitness goals"
      icon="star"
      action-text="View All"
      action-icon="plus"
      @action="handleHeaderAction"
    />

    <!-- Stats Grid -->
    <div class="mb-8">
      <QuickStatsGrid
        :stats="fitnessStats"
        :columns="4"
        variant="gradient"
        gap="md"
      />
    </div>

    <!-- Dashboard Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Activity -->
      <DashboardSection
        title="🎯 Recent Activity"
        description="Your latest workouts and achievements"
        :header-actions="recentActions"
        :loading="false"
        @header-action="handleSectionAction"
      >
        <template #content>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div
                :class="`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`"
              >
                <Icon :name="activity.icon" size="sm" class="text-white" />
              </div>
              <div class="flex-1">
                <Text variant="subtitle" class="font-semibold">
                  {{ activity.title }}
                </Text>
                <Text variant="footer" class="text-gray-500">
                  {{ activity.description }}
                </Text>
              </div>
              <Text variant="footer" class="text-gray-400">
                {{ activity.time }}
              </Text>
            </div>
          </div>
        </template>
      </DashboardSection>

      <!-- Quick Actions -->
      <DashboardSection
        title="⚡ Quick Actions"
        description="Start your workout or track progress"
        :actions="quickActionButtons"
        @action="handleAction"
      >
        <div class="grid grid-cols-2 gap-4">
          <Button
            v-for="action in quickActions"
            :key="action.id"
            :variant="action.variant"
            class="p-6 h-auto flex-col gap-2"
          >
            <Icon :name="action.icon" size="lg" />
            <Text variant="subtitle" class="font-semibold">
              {{ action.title }}
            </Text>
            <Text variant="footer" class="text-gray-500">
              {{ action.description }}
            </Text>
          </Button>
        </div>
      </DashboardSection>
    </div>

    <!-- Full-width section with empty state -->
    <DashboardSection
      title="📈 Progress Analytics"
      description="Detailed insights into your fitness journey"
      :empty-state="analyticsEmptyState"
      :header-actions="analyticsActions"
      @empty-action="handleEmptyAction"
      @header-action="handleSectionAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  DashboardHeader,
  QuickStatsGrid,
  DashboardSection,
} from "./core/layout";
import { Button, Icon, Text } from "./core/basics";
import type { QuickStat } from "./core/layout/QuickStatsGrid.vue";

// Sample data for demo
const fitnessStats = ref<QuickStat[]>([
  {
    id: "workouts",
    label: "Workouts",
    value: "24",
    change: "+12%",
    trend: "up",
    color: "blue",
    icon: "star",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "7",
    unit: "days",
    change: "+2",
    trend: "up",
    color: "green",
    icon: "star",
  },
  {
    id: "calories",
    label: "Calories Burned",
    value: "2,430",
    change: "+8%",
    trend: "up",
    color: "orange",
    icon: "star",
  },
  {
    id: "prs",
    label: "Personal Records",
    value: "12",
    change: "+3",
    trend: "up",
    color: "purple",
    icon: "star",
  },
]);

const recentActivity = ref([
  {
    id: "1",
    title: "Morning Strength Training",
    description: "Completed full-body workout",
    time: "2h ago",
    icon: "star",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "New Personal Record",
    description: "Deadlift: 315 lbs",
    time: "1d ago",
    icon: "star",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Weekly Goal Achieved",
    description: "5 workouts completed",
    time: "2d ago",
    icon: "star",
    color: "bg-green-500",
  },
]);

const quickActions = ref([
  {
    id: "start",
    title: "Start Workout",
    description: "Begin tracking",
    variant: "primary" as const,
    icon: "plus",
  },
  {
    id: "history",
    title: "View History",
    description: "Past workouts",
    variant: "outline" as const,
    icon: "star",
  },
  {
    id: "progress",
    title: "Progress",
    description: "View analytics",
    variant: "outline" as const,
    icon: "star",
  },
  {
    id: "profile",
    title: "Profile",
    description: "Settings & goals",
    variant: "ghost" as const,
    icon: "star",
  },
]);

// Section actions
const recentActions = ref([
  {
    id: "view-all",
    label: "View All",
    variant: "ghost" as const,
    icon: "star",
  },
]);

const quickActionButtons = ref([
  {
    id: "customize",
    label: "Customize",
    variant: "primary" as const,
    icon: "star",
  },
]);

const analyticsActions = ref([
  {
    id: "export",
    label: "Export",
    variant: "outline" as const,
    icon: "star",
  },
  {
    id: "settings",
    label: "Settings",
    variant: "ghost" as const,
    icon: "star",
  },
]);

const analyticsEmptyState = ref({
  icon: "star",
  title: "No Analytics Yet",
  description: "Complete more workouts to see detailed progress analytics",
  action: {
    id: "start-workout",
    label: "Start First Workout",
    variant: "primary" as const,
    icon: "plus",
  },
});

// Event handlers
function handleHeaderAction() {
  console.log("Header action clicked");
}

function handleSectionAction(action: any) {
  console.log("Section action:", action);
}

function handleAction(action: any) {
  console.log("Action:", action);
}

function handleEmptyAction(action: any) {
  console.log("Empty state action:", action);
}
</script>
