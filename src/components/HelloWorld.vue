<script setup lang="ts">
import { WorkoutBuilder } from './core/workout-components/index'
import { Text, Icon } from './core/basics'

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="mb-10 text-center">
      <div class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
        <Icon name="star" variant="fill" size="xl" class="text-white" />
      </div>
      <Text variant="header" color-class="text-gray-900 dark:text-white" class="font-black mb-3 tracking-tight">
        {{ msg }}
      </Text>
      <Text variant="body" color-class="text-gray-600 dark:text-gray-400" class="text-lg font-medium max-w-2xl mx-auto">
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
