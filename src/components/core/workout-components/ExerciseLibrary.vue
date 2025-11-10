<!--
  ExerciseLibrary.vue
  Enhanced searchable exercise library with favorites, custom exercises, and advanced filtering.
  
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
          <Icon
            name="search"
            variant="flat"
            size="sm"
            class="text-gray-400 dark:text-gray-500"
          />
        </template>
      </Input>

      <!-- Type and category filters -->
      <div class="flex flex-wrap gap-2">
        <div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            :variant="filterType === 'all' ? 'primary' : 'ghost'"
            size="sm"
            @click="filterType = 'all'"
            class="font-semibold"
          >
            All
          </Button>
          <Button
            :variant="filterType === 'strength' ? 'primary' : 'ghost'"
            size="sm"
            @click="filterType = 'strength'"
            class="font-semibold"
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
            class="font-semibold"
          >
            <template #leading>
              <Icon name="spinner" variant="flat" size="xs" />
            </template>
            Cardio
          </Button>
        </div>

        <div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Button
            :variant="filterSource === 'all' ? 'primary' : 'ghost'"
            size="sm"
            @click="filterSource = 'all'"
            class="font-semibold"
          >
            All Sources
          </Button>
          <Button
            :variant="filterSource === 'favorites' ? 'primary' : 'ghost'"
            size="sm"
            @click="filterSource = 'favorites'"
            class="font-semibold"
          >
            <template #leading>
              <Icon name="star" variant="fill" size="xs" />
            </template>
            Favorites ({{ favoriteCount }})
          </Button>
          <Button
            :variant="filterSource === 'custom' ? 'primary' : 'ghost'"
            size="sm"
            @click="filterSource = 'custom'"
            class="font-semibold"
          >
            <template #leading>
              <Icon name="plus" variant="flat" size="xs" />
            </template>
            Custom ({{ customCount }})
          </Button>
        </div>
      </div>

      <!-- Advanced filters -->
      <div
        v-if="showAdvancedFilters"
        class="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700"
      >
        <div class="flex flex-wrap gap-2">
          <select
            v-model="categoryFilter"
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <select
            v-model="muscleGroupFilter"
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Muscle Groups</option>
            <option
              v-for="muscle in availableMuscleGroups"
              :key="muscle"
              :value="muscle"
            >
              {{ muscle }}
            </option>
          </select>

          <select
            v-model="equipmentFilter"
            class="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Equipment</option>
            <option
              v-for="equip in availableEquipment"
              :key="equip"
              :value="equip"
            >
              {{ equip }}
            </option>
          </select>
        </div>
      </div>

      <!-- Toggle advanced filters -->
      <Button
        variant="ghost"
        size="sm"
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="font-semibold"
      >
        <template #leading>
          <Icon
            :name="showAdvancedFilters ? 'minus' : 'plus'"
            variant="flat"
            size="xs"
          />
        </template>
        {{ showAdvancedFilters ? "Hide" : "Show" }} Advanced Filters
      </Button>
    </div>

    <!-- Exercise list -->
    <div
      v-if="filteredExercises.length"
      class="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin"
    >
      <ListCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :title="exercise.name"
        :subtitle="exercise.category || exercise.type"
        :leading-icon="
          exercise.icon || (exercise.type === 'strength' ? 'star' : 'spinner')
        "
        leading-icon-variant="fill"
        trailing-icon="plus"
        trailing-icon-variant="flat"
        :bg-class="
          exercise.type === 'strength'
            ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-800'
        "
        :divider="false"
        padding="md"
        rounded="lg"
        :hoverable="true"
        gap-class="gap-3"
        @click="selectExercise(exercise)"
      >
        <template #append>
          <div class="flex items-center gap-2">
            <!-- Favorite indicator -->
            <Icon
              v-if="exercise.isFavorite"
              name="star"
              variant="fill"
              size="sm"
              class="text-yellow-500"
            />
            <!-- Custom indicator -->
            <span
              v-if="exercise.isCustom"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50"
            >
              CUSTOM
            </span>
            <!-- Type indicator -->
            <span
              :class="[
                'inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
                exercise.type === 'strength'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
              ]"
            >
              {{ exercise.type === "strength" ? "STR" : "CON" }}
            </span>
          </div>
        </template>
      </ListCard>
    </div>

    <div v-else class="text-center py-8">
      <Icon
        name="search"
        variant="flat"
        size="xl"
        class="text-gray-300 dark:text-gray-700 mx-auto mb-2"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
        No exercises match your search
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Input, Icon, Button } from "../basics";
import { ListCard } from "../layout";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import {
  SAMPLE_EXERCISES,
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
} from "@/types/workout";
import type { Exercise, ExerciseType } from "../../../types/workout";

interface ExerciseLibraryProps {
  exercises?: Exercise[];
}

const props = withDefaults(defineProps<ExerciseLibraryProps>(), {
  exercises: () => [],
});

const emit = defineEmits<{
  (e: "select", exercise: Exercise): void;
}>();

const { customExercises, isExerciseFavorite } = useWorkoutStorage();

const search = ref("");
const filterType = ref<"all" | ExerciseType>("all");
const filterSource = ref<"all" | "favorites" | "custom">("all");
const showAdvancedFilters = ref(false);
const categoryFilter = ref("");
const muscleGroupFilter = ref("");
const equipmentFilter = ref("");

// Combine all exercises (props + built-in + custom) with favorites status
const allExercises = computed(() => {
  const propsExercises = props.exercises.map((exercise) => ({
    ...exercise,
    isCustom: false,
    isFavorite: isExerciseFavorite(exercise.id),
  }));

  const builtInExercises = SAMPLE_EXERCISES.filter(
    (exercise) => !props.exercises.some((ex) => ex.id === exercise.id)
  ).map((exercise) => ({
    ...exercise,
    isCustom: false,
    isFavorite: isExerciseFavorite(exercise.id),
  }));

  const customWithFavorites = customExercises.map((exercise) => ({
    ...exercise,
    isFavorite: isExerciseFavorite(exercise.id),
  }));

  return [...propsExercises, ...builtInExercises, ...customWithFavorites];
});

// Count exercises by source
const favoriteCount = computed(
  () => allExercises.value.filter((ex) => ex.isFavorite).length
);
const customCount = computed(
  () => allExercises.value.filter((ex) => ex.isCustom).length
);

// Available filter options based on current exercises
const availableCategories = computed(() => {
  const categories = new Set(
    allExercises.value.map((ex) => ex.category).filter(Boolean)
  );
  return Array.from(categories).sort();
});

const availableMuscleGroups = computed(() => {
  const muscles = new Set(
    allExercises.value.flatMap((ex) => ex.muscleGroups || [])
  );
  return Array.from(muscles).sort();
});

const availableEquipment = computed(() => {
  const equipment = new Set(
    allExercises.value.flatMap((ex) => ex.equipment || [])
  );
  return Array.from(equipment).sort();
});

const filteredExercises = computed(() => {
  let result = allExercises.value;

  // Filter by type
  if (filterType.value !== "all") {
    result = result.filter((ex) => ex.type === filterType.value);
  }

  // Filter by source
  if (filterSource.value === "favorites") {
    result = result.filter((ex) => ex.isFavorite);
  } else if (filterSource.value === "custom") {
    result = result.filter((ex) => ex.isCustom);
  }

  // Advanced filters
  if (categoryFilter.value) {
    result = result.filter((ex) => ex.category === categoryFilter.value);
  }

  if (muscleGroupFilter.value) {
    result = result.filter(
      (ex) =>
        ex.muscleGroups && ex.muscleGroups.includes(muscleGroupFilter.value)
    );
  }

  if (equipmentFilter.value) {
    result = result.filter(
      (ex) => ex.equipment && ex.equipment.includes(equipmentFilter.value)
    );
  }

  // Filter by search
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    result = result.filter((ex) => {
      const searchableText = [
        ex.name,
        ex.category,
        ex.description,
        ex.instructions,
        ex.tips,
        ...(ex.muscleGroups || []),
        ...(ex.equipment || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }

  // Sort: favorites first, then custom, then alphabetically
  return result.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    if (a.isCustom && !b.isCustom) return -1;
    if (!a.isCustom && b.isCustom) return 1;
    return a.name.localeCompare(b.name);
  });
});

function selectExercise(exercise: Exercise) {
  emit("select", exercise);
}
</script>
