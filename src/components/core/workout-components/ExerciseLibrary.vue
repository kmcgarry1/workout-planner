<!--
  ExerciseLibrary.vue
  Searchable list of available exercises (strength/conditioning) for adding to a workout.
  
  Usage:
  <ExerciseLibrary :exercises="SAMPLE_EXERCISES" @select="handleExerciseSelect" />
-->
<template>
  <div class="space-y-4">
    <!-- Search and filter -->
    <div class="space-y-3">
      <Input
        v-model="search"
        variant="filled"
        size="md"
        placeholder="Search exercises..."
        clearable
      >
        <template #leading>
          <Icon name="search" variant="flat" size="sm" class="text-gray-400 dark:text-gray-500" />
        </template>
      </Input>

      <!-- Type filter tabs -->
      <div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Button
          :variant="filterType === 'all' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'all'"
          class="flex-1 font-semibold"
        >
          All
        </Button>
        <Button
          :variant="filterType === 'strength' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'strength'"
          class="flex-1 font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="flat" size="xs" />
          </template>
          Strength
        </Button>
        <Button
          :variant="filterType === 'conditioning' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'conditioning'"
          class="flex-1 font-semibold"
        >
          <template #leading>
            <Icon name="spinner" variant="flat" size="xs" />
          </template>
          Cardio
        </Button>
      </div>
    </div>

    <!-- Exercise list -->
    <div v-if="filteredExercises.length" class="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
      <ListCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :title="exercise.name"
        :subtitle="exercise.category || exercise.type"
        :leading-icon="exercise.icon || (exercise.type === 'strength' ? 'star' : 'spinner')"
        leading-icon-variant="fill"
        trailing-icon="plus"
        trailing-icon-variant="flat"
        :bg-class="exercise.type === 'strength' 
          ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800' 
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-800'"
        :divider="false"
        padding="md"
        rounded="lg"
        :hoverable="true"
        gap-class="gap-3"
        @click="selectExercise(exercise)"
      >
        <template #append>
          <div class="text-right">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
              exercise.type === 'strength' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
            ]">
              {{ exercise.type === 'strength' ? 'STR' : 'CON' }}
            </span>
          </div>
        </template>
      </ListCard>
    </div>

    <div v-else class="text-center py-8">
      <Icon name="search" variant="flat" size="xl" class="text-gray-300 dark:text-gray-700 mx-auto mb-2" />
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        No exercises match your search
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input, Icon, Button } from '../basics'
import { ListCard } from '../layout'
import type { Exercise, ExerciseType } from '../../../types/workout'

interface ExerciseLibraryProps {
  exercises: Exercise[]
}

const props = defineProps<ExerciseLibraryProps>()

const emit = defineEmits<{
  (e: 'select', exercise: Exercise): void
}>()

const search = ref('')
const filterType = ref<'all' | ExerciseType>('all')

const filteredExercises = computed(() => {
  let result = props.exercises

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter(ex => ex.type === filterType.value)
  }

  // Filter by search
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(ex => {
      return [ex.name, ex.category, ex.description, ex.type]
        .filter(Boolean)
        .some(field => String(field).toLowerCase().includes(q))
    })
  }

  return result
})

function selectExercise(exercise: Exercise) {
  emit('select', exercise)
}
</script>
