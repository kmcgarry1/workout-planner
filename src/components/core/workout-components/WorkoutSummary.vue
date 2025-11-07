<!--
  WorkoutSummary.vue
  Displays the complete workout with all exercises, sets, reps, and parameters.
  
  Usage:
  <WorkoutSummary :workout="currentWorkout" />
-->
<template>
  <div class="space-y-4">
    <div v-if="workout.exercises.length === 0" class="text-center py-8">
      <Icon name="star" variant="flat" size="xl" class="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <Text variant="title" class="text-gray-500 dark:text-gray-400">No exercises yet</Text>
      <Text variant="body" class="text-gray-400 dark:text-gray-500">Add exercises to build your workout</Text>
    </div>

    <div v-else class="space-y-3">
      <!-- Each exercise card -->
      <Card
        v-for="(workoutEx, idx) in workout.exercises"
        :key="workoutEx.id"
        variant="outlined"
        padding="md"
        rounded="lg"
        class="border-l-4"
        :class="workoutEx.exercise.type === 'strength' ? 'border-l-blue-500' : 'border-l-cyan-500'"
      >
        <CardHeader
          :title="`${idx + 1}. ${workoutEx.exercise.name}`"
          :subtitle="workoutEx.exercise.type === 'strength' ? 'Strength' : 'Conditioning'"
          :divider="true"
        >
          <template #append>
            <Button
              variant="ghost"
              size="sm"
              @click="emit('remove', workoutEx.id)"
              aria-label="Remove exercise"
            >
              <template #leading>
                <Icon name="x" variant="flat" size="sm" class="text-red-500" />
              </template>
            </Button>
          </template>
        </CardHeader>

        <CardBody padding="md" space-y="sm">
          <!-- Sets table -->
          <div class="space-y-2">
            <div
              v-for="set in workoutEx.sets"
              :key="set.setNumber"
              class="flex items-center gap-3 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded text-sm"
            >
              <span class="font-semibold text-gray-600 dark:text-gray-400 w-12">Set {{ set.setNumber }}</span>
              
              <!-- Strength format -->
              <template v-if="workoutEx.exercise.type === 'strength'">
                <span class="text-gray-900 dark:text-gray-100">
                  {{ set.reps }} reps
                  <span v-if="set.weight" class="text-blue-600 dark:text-blue-400 font-semibold">
                    @ {{ set.weight }}{{ set.weightUnit || 'lbs' }}
                  </span>
                </span>
              </template>
              
              <!-- Conditioning format -->
              <template v-else>
                <span class="text-cyan-600 dark:text-cyan-400 font-semibold">
                  {{ formatTime(set.time || 0) }}
                </span>
              </template>

              <span v-if="set.rest" class="ml-auto text-gray-500 dark:text-gray-400 text-xs">
                Rest: {{ set.rest }}s
              </span>
            </div>
          </div>

          <!-- Notes -->
          <p v-if="workoutEx.notes" class="text-sm text-gray-600 dark:text-gray-400 italic mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {{ workoutEx.notes }}
          </p>
        </CardBody>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, ListCard } from '../layout'
import { CardHeader, CardBody } from '../layout/card-components'
import { Button, Icon, Text } from '../basics'
import type { Workout } from '../../../types/workout'

interface WorkoutSummaryProps {
  workout: Workout
}

defineProps<WorkoutSummaryProps>()

const emit = defineEmits<{
  (e: 'remove', exerciseId: string): void
}>()

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}
</script>
