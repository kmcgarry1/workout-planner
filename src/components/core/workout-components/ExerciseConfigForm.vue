<!--
  ExerciseConfigForm.vue
  Form for configuring exercise parameters: sets, reps, weight (strength) or time (conditioning).
  
  Usage:
  <ExerciseConfigForm 
    :exercise="selectedExercise" 
    @submit="handleAddToWorkout" 
    @cancel="handleCancel" 
  />
-->
<template>
  <div class="space-y-4">
    <!-- Exercise info header -->
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <Text variant="title" class="text-gray-900 dark:text-white">{{ exercise.name }}</Text>
      <Text variant="subtitle" class="text-gray-600 dark:text-gray-400">
        {{ exercise.type === 'strength' ? 'Strength Training' : 'Conditioning' }}
      </Text>
    </div>

    <!-- Number of sets -->
    <div>
      <Input
        v-model="numSets"
        label="Number of Sets"
        type="number"
        variant="filled"
        size="md"
        placeholder="e.g., 3"
      />
    </div>

    <!-- Strength-specific fields -->
    <div v-if="exercise.type === 'strength'" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <Input
          v-model="reps"
          label="Reps per Set"
          type="number"
          variant="filled"
          size="md"
          placeholder="e.g., 10"
        />
        <Input
          v-model="weight"
          label="Weight"
          type="number"
          variant="filled"
          size="md"
          placeholder="e.g., 135"
        >
          <template #trailing>
            <select
              v-model="weightUnit"
              class="text-sm bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </template>
        </Input>
      </div>
    </div>

    <!-- Conditioning-specific fields -->
    <div v-if="exercise.type === 'conditioning'" class="space-y-4">
      <Input
        v-model="timeSeconds"
        label="Time per Set (seconds)"
        type="number"
        variant="filled"
        size="md"
        placeholder="e.g., 60"
        helper="Enter duration in seconds"
      />
    </div>

    <!-- Rest time (optional) -->
    <div>
      <Input
        v-model="restSeconds"
        label="Rest Between Sets (seconds)"
        type="number"
        variant="filled"
        size="md"
        placeholder="e.g., 90"
        helper="Optional"
      />
    </div>

    <!-- Notes -->
    <div>
      <label class="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">Notes (optional)</label>
      <textarea
        v-model="notes"
        rows="2"
        placeholder="Add any notes about form, tempo, etc."
        class="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
               placeholder:text-gray-400 dark:placeholder:text-gray-500 
               text-gray-900 dark:text-gray-100 
               transition-colors duration-150 resize-none"
      />
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2 pt-2">
      <Button variant="primary" size="md" @click="handleSubmit" class="flex-1">
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Add to Workout
      </Button>
      <Button variant="ghost" size="md" @click="emit('cancel')">
        Cancel
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Input, Button, Icon, Text } from '../basics'
import type { Exercise, ExerciseSet } from '../../../types/workout'

interface ExerciseConfigFormProps {
  exercise: Exercise
}

const props = defineProps<ExerciseConfigFormProps>()

const emit = defineEmits<{
  (e: 'submit', data: { exercise: Exercise; sets: ExerciseSet[]; notes?: string }): void
  (e: 'cancel'): void
}>()

// Form fields
const numSets = ref('3')
const reps = ref('10')
const weight = ref('0')
const weightUnit = ref<'lbs' | 'kg'>('lbs')
const timeSeconds = ref('60')
const restSeconds = ref('60')
const notes = ref('')

function handleSubmit() {
  const sets: ExerciseSet[] = []
  const numSetsInt = parseInt(numSets.value) || 1
  
  for (let i = 0; i < numSetsInt; i++) {
    const set: ExerciseSet = {
      setNumber: i + 1,
      completed: false
    }

    if (props.exercise.type === 'strength') {
      set.reps = parseInt(reps.value) || 0
      const weightNum = parseInt(weight.value) || 0
      if (weightNum > 0) {
        set.weight = weightNum
        set.weightUnit = weightUnit.value
      }
    } else {
      set.time = parseInt(timeSeconds.value) || 0
    }

    const restNum = parseInt(restSeconds.value) || 0
    if (restNum > 0) {
      set.rest = restNum
    }

    sets.push(set)
  }

  emit('submit', {
    exercise: props.exercise,
    sets,
    notes: notes.value || undefined
  })

  // Reset form
  numSets.value = '3'
  reps.value = '10'
  weight.value = '0'
  timeSeconds.value = '60'
  restSeconds.value = '60'
  notes.value = ''
}
</script>
