<!--
  WorkoutBuilder.vue
  Main workout building interface orchestrating exercise selection, configuration, and summary.
  
  Usage:
  <WorkoutBuilder />
-->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Exercise Library Column -->
    <div class="lg:col-span-1">
      <Card variant="outlined" padding="none" rounded="lg" shadow="md">
        <CardHeader
          title="Exercise Library"
          subtitle="Select exercises to add"
          :divider="true"
          padding="md"
        >
          <template #prepend>
            <Icon name="search" variant="fill" size="md" class="text-blue-500" />
          </template>
        </CardHeader>

        <CardBody padding="md">
          <ExerciseLibrary
            :exercises="exercises"
            @select="handleExerciseSelect"
          />
        </CardBody>
      </Card>
    </div>

    <!-- Configure Exercise Column (when exercise selected) -->
    <div class="lg:col-span-1" v-if="selectedExercise">
      <Card variant="elevated" padding="none" rounded="lg" shadow="lg" bg-class="bg-blue-50 dark:bg-blue-900/20">
        <CardHeader
          title="Configure Exercise"
          subtitle="Set reps, weight, or time"
          :divider="true"
          padding="md"
        />

        <CardBody padding="md">
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
      <Card variant="outlined" padding="none" rounded="lg" shadow="md">
        <CardHeader
          :title="workoutName || 'My Workout'"
          :subtitle="`${currentWorkout.exercises.length} exercises`"
          :divider="true"
          padding="md"
        >
          <template #prepend>
            <Icon name="star" variant="fill" size="md" class="text-indigo-500" />
          </template>
          <template #append>
            <Button
              v-if="currentWorkout.exercises.length > 0"
              variant="primary"
              size="sm"
              @click="handleSaveWorkout"
            >
              Save Workout
            </Button>
          </template>
        </CardHeader>

        <CardBody padding="md">
          <!-- Workout name input -->
          <div class="mb-4" v-if="currentWorkout.exercises.length > 0">
            <Input
              v-model="workoutName"
              variant="filled"
              size="sm"
              placeholder="Name your workout..."
            />
          </div>

          <WorkoutSummary
            :workout="currentWorkout"
            @remove="handleRemoveExercise"
          />
        </CardBody>

        <CardActions
          v-if="currentWorkout.exercises.length > 0"
          justify="between"
          padding="md"
        >
          <Text variant="body" class="text-gray-600 dark:text-gray-400">
            Total: {{ currentWorkout.exercises.length }} exercises
          </Text>
          <Button
            variant="danger"
            size="sm"
            @click="handleClearWorkout"
          >
            Clear All
          </Button>
        </CardActions>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Card } from '../layout'
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
    id: `we-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
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
