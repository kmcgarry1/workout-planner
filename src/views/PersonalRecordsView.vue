<!--
  PersonalRecordsView.vue
  View page for personal records tracking and goals management.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <PersonalRecords />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PersonalRecords } from "@/components/core/workout-components";
</script>
