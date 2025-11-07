<!--
  ExerciseLibrary.vue
  Searchable list of available exercises (strength/conditioning) for adding to a workout.
  
  Usage:
  <ExerciseLibrary :exercises="SAMPLE_EXERCISES" @select="handleExerciseSelect" />
-->
<template>
  <div class="space-y-4">
    <!-- Search and filter -->
    <div class="space-y-2">
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
      <div class="flex gap-2">
        <Button
          :variant="filterType === 'all' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'all'"
        >
          All
        </Button>
        <Button
          :variant="filterType === 'strength' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'strength'"
        >
          Strength
        </Button>
        <Button
          :variant="filterType === 'conditioning' ? 'primary' : 'ghost'"
          size="sm"
          @click="filterType = 'conditioning'"
        >
          Conditioning
        </Button>
      </div>
    </div>

    <!-- Exercise list -->
    <div v-if="filteredExercises.length" class="space-y-2 max-h-96 overflow-y-auto">
      <ListCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :title="exercise.name"
        :subtitle="`${exercise.category || exercise.type} ${exercise.description ? '• ' + exercise.description : ''}`"
        :leading-icon="exercise.icon || (exercise.type === 'strength' ? 'star' : 'spinner')"
        leading-icon-variant="fill"
        trailing-icon="plus"
        trailing-icon-variant="flat"
        bg-class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        :divider="false"
        padding="md"
        rounded="md"
        :hoverable="true"
        gap-class="gap-3"
        @click="selectExercise(exercise)"
      />
    </div>

    <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
      No exercises match your search.
    </p>
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
