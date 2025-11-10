<!--
  ComponentDemoView.vue
  Demo view showcasing the new refactored layout components
-->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <!-- Page Header -->
    <DashboardHeader
      title="🏋️ Component Refactor Demo"
      description="Showcasing new layout components for better maintainability"
      icon="star"
      action-text="Docs"
      action-icon="star"
      @action="handleHeaderAction"
    />

    <!-- Stats Grid -->
    <div class="mb-8">
      <QuickStatsGrid
        :stats="demoStats"
        :columns="3"
        variant="gradient"
        gap="md"
      />
    </div>

    <!-- Demo Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Section with content -->
      <DashboardSection
        title="✨ New Layout Components"
        description="Reusable components for dashboard patterns"
        :loading="false"
      >
        <template #content>
          <div class="space-y-3">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Text
                variant="subtitle"
                class="font-semibold text-blue-600 dark:text-blue-400"
              >
                DashboardHeader.vue
              </Text>
              <Text variant="footer" class="text-blue-500 dark:text-blue-300">
                67 lines - Reusable page headers with actions
              </Text>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Text
                variant="subtitle"
                class="font-semibold text-purple-600 dark:text-purple-400"
              >
                QuickStatsGrid.vue
              </Text>
              <Text
                variant="footer"
                class="text-purple-500 dark:text-purple-300"
              >
                143 lines - Configurable metrics display
              </Text>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Text
                variant="subtitle"
                class="font-semibold text-green-600 dark:text-green-400"
              >
                DashboardSection.vue
              </Text>
              <Text variant="footer" class="text-green-500 dark:text-green-300">
                195 lines - Comprehensive section wrapper
              </Text>
            </div>
          </div>
        </template>
      </DashboardSection>

      <!-- Section with empty state -->
      <DashboardSection
        title="🔧 Refactoring Progress"
        description="Breaking down large components"
        :empty-state="refactoringEmptyState"
        @empty-action="handleEmptyAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  DashboardHeader,
  QuickStatsGrid,
  DashboardSection,
} from "../components/core/layout";
import { Text } from "../components/core/basics";
import type { QuickStat } from "../components/core/layout/QuickStatsGrid.vue";

// Demo stats
const demoStats = ref<QuickStat[]>([
  {
    id: "components",
    label: "New Components",
    value: "3",
    color: "blue",
    icon: "star",
    trend: { direction: "up", value: "+3" },
  },
  {
    id: "lines-reduced",
    label: "Lines Refactored",
    value: "2,600+",
    color: "purple",
    icon: "star",
  },
  {
    id: "reusable",
    label: "Reusability",
    value: "100%",
    color: "green",
    icon: "star",
    trend: { direction: "up", value: "Improved" },
  },
]);

const refactoringEmptyState = ref({
  icon: "star",
  title: "Ready for Refactoring",
  description:
    "Use these new components to break down large files like DataManagement.vue (981 lines), UserProfile.vue (833 lines), and PersonalRecords.vue (790 lines)",
  action: {
    id: "start-refactoring",
    label: "Start Refactoring",
    variant: "primary" as const,
    icon: "star",
  },
});

// Event handlers
function handleHeaderAction() {
  console.log("Demo header action");
}

function handleEmptyAction(action: any) {
  console.log("Demo empty action:", action);
}
</script>
