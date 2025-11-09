<!--
  WorkoutSummary.vue
  Displays the complete workout with all exercises, sets, reps, and parameters.
  
  Usage:
  <WorkoutSummary :workout="currentWorkout" />
-->
<template>
  <div class="space-y-4">
    <div v-if="workout.exercises.length === 0" class="text-center py-12">
      <div class="mb-4 flex justify-center">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <Icon name="star" variant="flat" size="xl" class="text-gray-300 dark:text-gray-600" />
        </div>
      </div>
      <Text variant="title" class="text-gray-600 dark:text-gray-400 font-bold mb-2">No exercises yet</Text>
      <Text variant="body" class="text-gray-500 dark:text-gray-500">Select exercises from the library to start building your workout</Text>
    </div>

    <div v-else class="space-y-3">
      <!-- Each exercise card -->
      <Card
        v-for="(workoutEx, idx) in workout.exercises"
        :key="workoutEx.id"
        variant="elevated"
        padding="none"
        rounded="lg"
        shadow="md"
        :class="[
          'transition-all duration-200 hover:shadow-lg',
          workoutEx.exercise.type === 'strength' 
            ? 'border-l-4 border-l-red-500 dark:border-l-red-400' 
            : 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400'
        ]"
      >
        <CardHeader
          :title="`${idx + 1}. ${workoutEx.exercise.name}`"
          :subtitle="workoutEx.exercise.category || workoutEx.exercise.type"
          :divider="true"
          padding="md"
        >
          <template #prepend>
            <div :class="[
              'p-2 rounded-lg',
              workoutEx.exercise.type === 'strength'
                ? 'bg-red-100 dark:bg-red-950'
                : 'bg-emerald-100 dark:bg-emerald-950'
            ]">
              <Icon 
                :name="workoutEx.exercise.icon || (workoutEx.exercise.type === 'strength' ? 'star' : 'spinner')" 
                variant="fill" 
                size="sm" 
                :class="[
                  workoutEx.exercise.type === 'strength'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                ]"
              />
            </div>
          </template>
          <template #append>
            <Button
              variant="ghost"
              size="sm"
              @click="emit('remove', workoutEx.id)"
              aria-label="Remove exercise"
              class="hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <template #leading>
                <Icon name="x" variant="flat" size="sm" class="text-red-500 dark:text-red-400" />
              </template>
            </Button>
          </template>
        </CardHeader>

        <CardBody padding="md" space-y="sm">
          <!-- Sets display -->
          <div class="space-y-1.5">
            <div
              v-for="set in workoutEx.sets"
              :key="set.setNumber"
              class="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-750"
            >
              <span class="flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs">
                {{ set.setNumber }}
              </span>
              
              <!-- Strength format -->
              <template v-if="workoutEx.exercise.type === 'strength'">
                <span class="text-gray-900 dark:text-gray-100 font-semibold">
                  {{ set.reps }} reps
                </span>
                <span v-if="set.weight" :class="[
                  'font-bold px-2 py-0.5 rounded',
                  'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                ]">
                  {{ set.weight }}{{ set.weightUnit || 'lbs' }}
                </span>
              </template>
              
              <!-- Conditioning format -->
              <template v-else>
                <span :class="[
                  'font-bold px-2 py-0.5 rounded',
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                ]">
                  {{ formatTime(set.time || 0) }}
                </span>
              </template>

              <span v-if="set.rest" class="ml-auto text-gray-500 dark:text-gray-400 text-xs font-medium">
                Rest {{ set.rest }}s
              </span>
            </div>
          </div>

          <!-- Notes -->
          <p v-if="workoutEx.notes" class="text-sm text-gray-600 dark:text-gray-400 italic mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 px-1">
            💡 {{ workoutEx.notes }}
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
