<!--
  DataManagementView.vue
  View page for data management, export/import, and backup functionality.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <DataManagement />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataManagement } from "@/components/core/workout-components";
</script>
