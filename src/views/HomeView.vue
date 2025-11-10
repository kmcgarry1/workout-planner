<!--
  HomeView.vue
  Enhanced dashboard/landing page with analytics integration and comprehensive workout overview.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <EnhancedDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EnhancedDashboard } from "@/components/core/workout-components";
</script>
