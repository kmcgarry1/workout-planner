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
  <div class="space-y-5">
    <!-- Exercise info header -->
    <div class="pb-4 border-b-2 border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <div :class="[
          'p-3 rounded-xl',
          exercise.type === 'strength' 
            ? 'bg-red-100 dark:bg-red-950' 
            : 'bg-emerald-100 dark:bg-emerald-950'
        ]">
          <Icon 
            :name="exercise.icon || (exercise.type === 'strength' ? 'star' : 'spinner')" 
            variant="fill" 
            size="lg" 
            :class="[
              exercise.type === 'strength'
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            ]"
          />
        </div>
        <div class="flex-1">
          <Text variant="title" class="text-gray-900 dark:text-white font-bold mb-1">{{ exercise.name }}</Text>
          <div class="flex items-center gap-2">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
              exercise.type === 'strength' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
            ]">
              {{ exercise.type === 'strength' ? 'Strength' : 'Conditioning' }}
            </span>
            <Text variant="subtitle" class="text-gray-600 dark:text-gray-400">
              {{ exercise.category }}
            </Text>
          </div>
        </div>
      </div>
    </div>

    <!-- Number of sets -->
    <div>
      <Input
        v-model="numSets"
        label="Number of Sets"
        type="number"
        variant="filled"
        size="lg"
        placeholder="e.g., 3"
        class="font-semibold"
      >
        <template #leading>
          <span class="text-gray-600 dark:text-gray-400 font-bold">#</span>
        </template>
      </Input>
    </div>

    <!-- Strength-specific fields -->
    <div v-if="exercise.type === 'strength'" class="space-y-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border-2 border-red-200 dark:border-red-900/50">
      <div class="grid grid-cols-2 gap-3">
        <Input
          v-model="reps"
          label="Reps per Set"
          type="number"
          variant="filled"
          size="lg"
          placeholder="e.g., 10"
          class="font-semibold"
        />
        <Input
          v-model="weight"
          label="Weight"
          type="number"
          variant="filled"
          size="lg"
          placeholder="e.g., 135"
          class="font-semibold"
        >
          <template #trailing>
            <select
              v-model="weightUnit"
              class="text-sm font-bold bg-transparent border-none focus:ring-0 text-red-700 dark:text-red-300 cursor-pointer pr-1"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </template>
        </Input>
      </div>
    </div>

    <!-- Conditioning-specific fields -->
    <div v-if="exercise.type === 'conditioning'" class="space-y-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50">
      <Input
        v-model="timeSeconds"
        label="Time per Set (seconds)"
        type="number"
        variant="filled"
        size="lg"
        placeholder="e.g., 60"
        helper="Duration for each set"
        class="font-semibold"
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
        helper="Recovery time between sets"
      />
    </div>

    <!-- Notes -->
    <div>
      <label class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300">Notes (optional)</label>
      <textarea
        v-model="notes"
        rows="3"
        placeholder="Add notes about form, tempo, RPE..."
        class="w-full px-3 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
               placeholder:text-gray-400 dark:placeholder:text-gray-500 
               text-gray-900 dark:text-gray-100 
               transition-all duration-150 resize-none"
      />
    </div>

    <!-- Action buttons -->
    <div class="flex gap-3 pt-3">
      <Button variant="primary" size="lg" @click="handleSubmit" class="flex-1 font-bold shadow-lg">
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Add to Workout
      </Button>
      <Button variant="ghost" size="lg" @click="emit('cancel')" class="font-semibold">
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
