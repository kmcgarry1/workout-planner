<!--
    WorkoutList.vue
    Selectable workout list built from ListCard with search filtering.
    Usage:
    <WorkoutList v-model="selected" :workouts="workouts" />
    <WorkoutList v-model="selected" :workouts="workouts" />
    Supports searching by title, subtitle, duration, focus, intensity.
-->
<template>
    <div class="space-y-4">
        <!-- Search input -->
        <Input
            v-model="search"
            variant="filled"
            size="sm"
            placeholder="Search workouts..."
            clearable
            wrapper-class="w-full"
        >
            <template #leading>
                <Icon name="search" variant="flat" size="sm" class="text-gray-400" />
            </template>
        </Input>

        <div class="space-y-2" v-if="filteredWorkouts.length">
            <ListCard
                v-for="workout in filteredWorkouts"
                :key="workout.id"
                :title="workout.title"
                :subtitle="workout.subtitle"
                :leading-icon="workout.icon || 'star'"
                leading-icon-variant="fill"
                :trailing-icon="isSelected(workout.id) ? 'check' : undefined"
                trailing-icon-variant="fill"
                :bg-class="cardBackground(workout.id)"
                :divider="true"
                padding="sm"
                rounded="md"
                :hoverable="true"
                gap-class="gap-3"
                @click="toggleSelection(workout.id)"
            >
                <template v-if="workout.duration || workout.focus || workout.intensity" #append>
                    <div class="text-right text-xs text-gray-500 dark:text-gray-400">
                        <p v-if="workout.duration" class="font-semibold text-gray-900 dark:text-white">
                            {{ workout.duration }}
                        </p>
                        <p v-if="workout.focus">{{ workout.focus }}</p>
                        <p v-if="workout.intensity" class="uppercase tracking-wide">
                            {{ workout.intensity }}
                        </p>
                    </div>
                </template>
            </ListCard>
        </div>

        <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic">No workouts match "{{ search }}".</p>

        <p class="text-sm text-gray-600 dark:text-gray-300">{{ selectionMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ListCard } from '../layout'
import { Input, Icon } from '../basics'

export interface WorkoutListItem {
    id: string
    title: string
    subtitle?: string
    duration?: string
    focus?: string
    intensity?: string
    icon?: string
}

const props = withDefaults(
    defineProps<{
        workouts: WorkoutListItem[]
        modelValue?: string[]
    }>(),
    {
        modelValue: () => []
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
    (e: 'change', value: string[]): void
}>()

// Track selection in a Set for O(1) lookups when rendering the list.
const selection = ref<Set<string>>(new Set(props.modelValue))

watch(
    () => props.modelValue,
    (newValue) => {
        selection.value = new Set(newValue ?? [])
    }
)

const search = ref('')

const filteredWorkouts = computed(() => {
    if (!search.value.trim()) return props.workouts
    const q = search.value.toLowerCase()
    return props.workouts.filter(w => {
        return [w.title, w.subtitle, w.duration, w.focus, w.intensity]
            .filter(Boolean)
            .some(field => String(field).toLowerCase().includes(q))
    })
})

const selectedWorkouts = computed(() => props.workouts.filter(workout => selection.value.has(workout.id)))

const selectionMessage = computed(() => {
    if (!selectedWorkouts.value.length) {
        return 'Select workouts to build your plan.'
    }

    const names = selectedWorkouts.value.map((workout) => workout.title).join(', ')
    return `Selected (${selectedWorkouts.value.length}): ${names}`
})

function toggleSelection(id: string) {
    const next = new Set(selection.value)
    if (next.has(id)) {
        next.delete(id)
    } else {
        next.add(id)
    }

    selection.value = next
    const payload = Array.from(next)
    emit('update:modelValue', payload)
    emit('change', payload)
}

function isSelected(id: string) {
    return selection.value.has(id)
}

function cardBackground(id: string) {
    if (isSelected(id)) {
        return 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-400 dark:border-indigo-400 ring-1 ring-indigo-400'
    }

    return 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'
}
</script>
