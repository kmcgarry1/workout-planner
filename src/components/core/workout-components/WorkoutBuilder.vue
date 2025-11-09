<!--
  WorkoutBuilder.vue
  Main workout building interface orchestrating exercise selection, configuration, and summary.
  
  Usage:
  <WorkoutBuilder />
-->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
    <!-- Exercise Library Column -->
    <div class="lg:col-span-1">
      <Card 
        variant="elevated" 
        padding="none" 
        rounded="xl" 
        shadow="lg"
        bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
      >
        <CardHeader
          title="Exercise Library"
          subtitle="Browse & select exercises"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Icon name="search" variant="fill" size="md" class="text-blue-600 dark:text-blue-400" />
            </div>
          </template>
        </CardHeader>

        <CardBody padding="lg">
          <ExerciseLibrary
            :exercises="exercises"
            @select="handleExerciseSelect"
          />
        </CardBody>
      </Card>
    </div>

    <!-- Configure Exercise Column (when exercise selected) -->
    <div class="lg:col-span-1" v-if="selectedExercise">
      <Card 
        variant="elevated" 
        padding="none" 
        rounded="xl" 
        shadow="xl" 
        bg-class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800"
      >
        <CardHeader
          title="Configure Exercise"
          subtitle="Set parameters"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-blue-600 dark:bg-blue-500 rounded-lg">
              <Icon name="plus" variant="fill" size="md" class="text-white" />
            </div>
          </template>
        </CardHeader>

        <CardBody padding="lg" class="bg-white/50 dark:bg-gray-900/50">
          <ExerciseConfigForm
            :exercise="selectedExercise"
            @submit="handleAddExercise"
            @cancel="selectedExercise = null"
          />
        </CardBody>
      </Card>
    </div>

    <!-- Workout Summary Column -->
    <div :class="selectedExercise ? 'lg:col-span-1' : 'lg:col-span-2'">
      <Card 
        variant="elevated" 
        padding="none" 
        rounded="xl" 
        shadow="lg"
        bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
      >
        <CardHeader
          :title="workoutName || 'My Workout'"
          :subtitle="`${currentWorkout.exercises.length} ${currentWorkout.exercises.length === 1 ? 'exercise' : 'exercises'}`"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Icon name="star" variant="fill" size="md" class="text-white" />
            </div>
          </template>
          <template #append>
            <Button
              v-if="currentWorkout.exercises.length > 0"
              variant="primary"
              size="md"
              @click="handleSaveWorkout"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="check" variant="flat" size="sm" />
              </template>
              Save Workout
            </Button>
          </template>
        </CardHeader>

        <CardBody padding="lg">
          <!-- Workout name input -->
          <div class="mb-5" v-if="currentWorkout.exercises.length > 0">
            <Input
              v-model="workoutName"
              variant="filled"
              size="md"
              placeholder="Name your workout..."
              class="font-medium"
            >
              <template #leading>
                <Icon name="star" variant="flat" size="sm" class="text-gray-400 dark:text-gray-500" />
              </template>
            </Input>
          </div>

          <WorkoutSummary
            :workout="currentWorkout"
            @remove="handleRemoveExercise"
          />
        </CardBody>

        <CardActions
          v-if="currentWorkout.exercises.length > 0"
          justify="between"
          padding="lg"
          class="bg-gray-50 dark:bg-gray-800/50"
        >
          <div class="flex items-center gap-2">
            <Icon name="check" variant="flat" size="sm" class="text-indigo-600 dark:text-indigo-400" />
            <Text variant="body" class="text-gray-700 dark:text-gray-300 font-medium">
              {{ currentWorkout.exercises.length }} {{ currentWorkout.exercises.length === 1 ? 'exercise' : 'exercises' }}
            </Text>
          </div>
          <Button
            variant="danger"
            size="sm"
            @click="handleClearWorkout"
          >
            <template #leading>
              <Icon name="x" variant="flat" size="sm" />
            </template>
            Clear All
          </Button>
        </CardActions>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Card, ListCard } from '../layout'
import { CardHeader, CardBody, CardActions } from '../layout/card-components'
import { Button, Icon, Text, Input } from '../basics'
import { ExerciseLibrary, ExerciseConfigForm, WorkoutSummary } from './index'
import { SAMPLE_EXERCISES } from '../../../types/workout'
import type { Exercise, WorkoutExercise, Workout, ExerciseSet } from '../../../types/workout'

const exercises = ref(SAMPLE_EXERCISES)
const selectedExercise = ref<Exercise | null>(null)
const workoutName = ref('')

const currentWorkout = reactive<Workout>({
  id: `workout-${Date.now()}`,
  name: '',
  date: new Date().toISOString(),
  exercises: [],
  completed: false
})

function handleExerciseSelect(exercise: Exercise) {
  selectedExercise.value = exercise
}

function handleAddExercise(data: { exercise: Exercise; sets: ExerciseSet[]; notes?: string }) {
  const workoutExercise: WorkoutExercise = {
    id: `we-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    exerciseId: data.exercise.id,
    exercise: data.exercise,
    sets: data.sets,
    notes: data.notes,
    order: currentWorkout.exercises.length
  }

  currentWorkout.exercises.push(workoutExercise)
  selectedExercise.value = null
}

function handleRemoveExercise(exerciseId: string) {
  const index = currentWorkout.exercises.findIndex(we => we.id === exerciseId)
  if (index !== -1) {
    currentWorkout.exercises.splice(index, 1)
    // Reorder remaining exercises
    currentWorkout.exercises.forEach((we, idx) => {
      we.order = idx
    })
  }
}

function handleClearWorkout() {
  if (confirm('Clear all exercises from this workout?')) {
    currentWorkout.exercises = []
    workoutName.value = ''
  }
}

function handleSaveWorkout() {
  currentWorkout.name = workoutName.value || 'Untitled Workout'
  // In a real app, this would save to localStorage or a backend
  alert(`Workout "${currentWorkout.name}" saved with ${currentWorkout.exercises.length} exercises!`)
  console.log('Saved workout:', JSON.stringify(currentWorkout, null, 2))
}
</script>
