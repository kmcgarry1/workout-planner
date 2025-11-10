<!--
  ExerciseManagementView.vue
  View for managing all exercises - built-in and custom, with create/edit/delete functionality.
-->
<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center p-3 mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg"
      >
        <Icon name="star" variant="fill" size="xl" class="text-white" />
      </div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-3 tracking-tight"
      >
        Exercise Management
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium max-w-2xl mx-auto"
      >
        Create and manage your exercise library
      </Text>
    </div>

    <!-- Quick Actions -->
    <div class="flex justify-between items-center">
      <div>
        <Text variant="title" class="text-gray-900 dark:text-white font-bold">
          {{ allExercises.length }} Total Exercises
        </Text>
        <Text variant="body" class="text-gray-600 dark:text-gray-400">
          {{ customExercises.length }} custom,
          {{ builtInExercises.length }} built-in
        </Text>
      </div>
      <Button
        variant="primary"
        size="lg"
        @click="showCreateForm = true"
        class="font-bold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        New Exercise
      </Button>
    </div>

    <!-- Create/Edit Exercise Form Modal -->
    <div
      v-if="showCreateForm || editingExercise"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <ExerciseForm
          :exercise="editingExercise"
          @save="handleSaveExercise"
          @cancel="closeForm"
        />
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="space-y-4">
      <Input
        v-model="searchQuery"
        variant="filled"
        size="lg"
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

      <!-- Filter buttons -->
      <div class="flex flex-wrap gap-3">
        <Button
          :variant="filter === 'all' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'all'"
          class="font-semibold"
        >
          All ({{ allExercises.length }})
        </Button>
        <Button
          :variant="filter === 'custom' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'custom'"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="plus" variant="flat" size="sm" />
          </template>
          Custom ({{ customExercises.length }})
        </Button>
        <Button
          :variant="filter === 'builtin' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'builtin'"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="flat" size="sm" />
          </template>
          Built-in ({{ builtInExercises.length }})
        </Button>
        <Button
          :variant="filter === 'favorites' ? 'primary' : 'ghost'"
          size="md"
          @click="filter = 'favorites'"
          class="font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="fill" size="sm" />
          </template>
          Favorites ({{ favoriteExercises.length }})
        </Button>
      </div>

      <!-- Type and Category Filters -->
      <div class="flex flex-wrap gap-2">
        <select
          v-model="typeFilter"
          class="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
        >
          <option value="">All Types</option>
          <option value="strength">Strength</option>
          <option value="conditioning">Conditioning</option>
        </select>

        <select
          v-model="categoryFilter"
          class="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
        >
          <option value="">All Categories</option>
          <option v-for="cat in EXERCISE_CATEGORIES" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <!-- Exercise Grid -->
    <div v-if="filteredExercises.length === 0" class="text-center py-16">
      <div class="mb-6 flex justify-center">
        <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
          <Icon
            name="search"
            variant="flat"
            size="xl"
            class="text-gray-300 dark:text-gray-600"
          />
        </div>
      </div>
      <Text
        variant="title"
        class="text-gray-600 dark:text-gray-400 font-bold mb-3"
        >No exercises found</Text
      >
      <Text
        variant="body"
        class="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto"
      >
        Try adjusting your search or filter criteria, or create a new custom
        exercise
      </Text>
      <Button
        variant="primary"
        size="lg"
        @click="showCreateForm = true"
        class="font-bold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Create First Exercise
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="lg"
        :bg-class="
          exercise.isCustom
            ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800'
        "
        class="transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      >
        <CardHeader
          :title="exercise.name"
          :subtitle="exercise.category || exercise.type"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div
              :class="[
                'p-2.5 rounded-lg',
                exercise.isCustom
                  ? 'bg-purple-600 dark:bg-purple-500'
                  : exercise.type === 'strength'
                  ? 'bg-red-600 dark:bg-red-500'
                  : 'bg-emerald-600 dark:bg-emerald-500',
              ]"
            >
              <Icon
                :name="
                  exercise.icon ||
                  (exercise.type === 'strength' ? 'star' : 'spinner')
                "
                variant="fill"
                size="md"
                class="text-white"
              />
            </div>
          </template>
          <template #append>
            <div class="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                @click="toggleFavorite(exercise)"
                :class="
                  exercise.isFavorite
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-400 hover:text-yellow-500'
                "
              >
                <Icon
                  :name="exercise.isFavorite ? 'star' : 'star'"
                  :variant="exercise.isFavorite ? 'fill' : 'flat'"
                  size="sm"
                />
              </Button>
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
                  exercise.isCustom
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : exercise.type === 'strength'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
                ]"
              >
                {{
                  exercise.isCustom
                    ? "Custom"
                    : exercise.type === "strength"
                    ? "STR"
                    : "CON"
                }}
              </span>
            </div>
          </template>
        </CardHeader>

        <CardBody padding="lg" class="bg-white/50 dark:bg-gray-900/50">
          <div class="space-y-3">
            <!-- Description -->
            <div v-if="exercise.description">
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 text-sm line-clamp-2"
              >
                {{ exercise.description }}
              </Text>
            </div>

            <!-- Difficulty -->
            <div v-if="exercise.difficulty" class="flex items-center gap-2">
              <Icon
                name="star"
                variant="flat"
                size="sm"
                class="text-gray-500 dark:text-gray-400"
              />
              <span
                :class="[
                  'text-xs font-bold px-2 py-1 rounded-md',
                  exercise.difficulty === 'Beginner'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    : exercise.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                ]"
              >
                {{ exercise.difficulty }}
              </span>
            </div>

            <!-- Muscle Groups -->
            <div
              v-if="exercise.muscleGroups && exercise.muscleGroups.length > 0"
            >
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="muscle in exercise.muscleGroups.slice(0, 3)"
                  :key="muscle"
                  class="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md"
                >
                  {{ muscle }}
                </span>
                <span
                  v-if="exercise.muscleGroups.length > 3"
                  class="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                >
                  +{{ exercise.muscleGroups.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Equipment -->
            <div v-if="exercise.equipment && exercise.equipment.length > 0">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="equip in exercise.equipment.slice(0, 2)"
                  :key="equip"
                  class="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
                >
                  {{ equip }}
                </span>
                <span
                  v-if="exercise.equipment.length > 2"
                  class="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                >
                  +{{ exercise.equipment.length - 2 }}
                </span>
              </div>
            </div>
          </div>
        </CardBody>

        <CardActions
          justify="between"
          padding="lg"
          class="bg-gray-50 dark:bg-gray-800/50"
        >
          <div class="flex gap-2">
            <Button
              v-if="exercise.isCustom"
              variant="ghost"
              size="sm"
              @click="editExercise(exercise)"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="star" variant="flat" size="sm" />
              </template>
              Edit
            </Button>
          </div>
          <Button
            v-if="exercise.isCustom"
            variant="ghost"
            size="sm"
            @click="confirmDeleteExercise(exercise)"
            class="font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <template #leading>
              <Icon name="x" variant="flat" size="sm" />
            </template>
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "@/components/core/layout";
import {
  CardHeader,
  CardBody,
  CardActions,
} from "@/components/core/layout/card-components";
import { Button, Icon, Text, Input } from "@/components/core/basics";
import { ExerciseForm } from "@/components/core/workout-components";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import {
  SAMPLE_EXERCISES,
  EXERCISE_CATEGORIES,
  type Exercise,
} from "@/types/workout";

const {
  customExercises,
  saveCustomExercise,
  deleteCustomExercise,
  toggleExerciseFavorite,
  isExerciseFavorite,
} = useWorkoutStorage();

const searchQuery = ref("");
const filter = ref<"all" | "custom" | "builtin" | "favorites">("all");
const typeFilter = ref("");
const categoryFilter = ref("");
const showCreateForm = ref(false);
const editingExercise = ref<Exercise | null>(null);

// Combine built-in and custom exercises with favorite status
const builtInExercises = computed(() => {
  return SAMPLE_EXERCISES.map((exercise) => ({
    ...exercise,
    isCustom: false,
    isFavorite: isExerciseFavorite(exercise.id),
  }));
});

const allExercises = computed(() => {
  const customWithFavorites = customExercises.map((exercise) => ({
    ...exercise,
    isFavorite: isExerciseFavorite(exercise.id),
  }));
  return [...builtInExercises.value, ...customWithFavorites];
});

const favoriteExercises = computed(() => {
  return allExercises.value.filter((exercise) => exercise.isFavorite);
});

const filteredExercises = computed(() => {
  let result = allExercises.value;

  // Apply main filter
  if (filter.value === "custom") {
    result = result.filter((ex) => ex.isCustom);
  } else if (filter.value === "builtin") {
    result = result.filter((ex) => !ex.isCustom);
  } else if (filter.value === "favorites") {
    result = result.filter((ex) => ex.isFavorite);
  }

  // Apply type filter
  if (typeFilter.value) {
    result = result.filter((ex) => ex.type === typeFilter.value);
  }

  // Apply category filter
  if (categoryFilter.value) {
    result = result.filter((ex) => ex.category === categoryFilter.value);
  }

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((exercise) => {
      const searchableText = [
        exercise.name,
        exercise.category,
        exercise.description,
        exercise.instructions,
        exercise.tips,
        ...(exercise.muscleGroups || []),
        ...(exercise.equipment || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
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

function handleSaveExercise(exercise: Exercise) {
  const success = saveCustomExercise(exercise);
  if (success) {
    closeForm();
  } else {
    alert("Failed to save exercise");
  }
}

function editExercise(exercise: Exercise) {
  editingExercise.value = exercise;
}

function closeForm() {
  showCreateForm.value = false;
  editingExercise.value = null;
}

function toggleFavorite(exercise: Exercise) {
  toggleExerciseFavorite(exercise.id);
  // Force reactivity update by marking the exercise as favorite/unfavorite
  exercise.isFavorite = isExerciseFavorite(exercise.id);
}

function confirmDeleteExercise(exercise: Exercise) {
  const confirmMsg = `Delete "${exercise.name}"?\n\nThis action cannot be undone.`;
  if (confirm(confirmMsg)) {
    const success = deleteCustomExercise(exercise.id);
    if (!success) {
      alert("Failed to delete exercise");
    }
  }
}
</script>
