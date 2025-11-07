<script setup lang="ts">
import { WorkoutBuilder } from './core/workout-components/index'
import { Text } from './core/basics'

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8 text-center">
      <Text variant="header" color-class="text-gray-900 dark:text-white">
        {{ msg }}
      </Text>
      <Text variant="body" color-class="text-gray-600 dark:text-gray-400" class="mt-2">
        Build custom workouts with strength and conditioning exercises
      </Text>
    </div>

    <!-- Workout Builder -->
    <WorkoutBuilder />
  </div>
</template>

<style scoped>
/* All styling handled by component system */
</style>
