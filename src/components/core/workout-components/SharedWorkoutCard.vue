<!--
  SharedWorkoutCard.vue
  Enhanced card component for displaying shared workouts with rich metadata and actions.
-->
<template>
  <Card
    variant="elevated"
    padding="none"
    rounded="xl"
    shadow="lg"
    :bg-class="bgClass"
    class="overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-105"
  >
    <!-- Header with quick actions -->
    <div class="relative">
      <!-- Quick Actions Overlay -->
      <div class="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          v-if="!isInCollection('favorites')"
          variant="ghost"
          size="sm"
          @click.stop="toggleFavorite"
          class="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20"
        >
          <Icon name="star" variant="outline" size="sm" />
        </Button>
        <Button
          v-else
          variant="ghost"
          size="sm"
          @click.stop="toggleFavorite"
          class="bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-500"
        >
          <Icon name="star" variant="fill" size="sm" />
        </Button>

        <div class="relative">
          <Button
            variant="ghost"
            size="sm"
            @click.stop="showCollectionMenu = !showCollectionMenu"
            class="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20"
          >
            <Icon name="plus" variant="outline" size="sm" />
          </Button>

          <!-- Collection Menu -->
          <div
            v-if="showCollectionMenu"
            class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20"
          >
            <button
              v-for="collection in availableCollections"
              :key="collection.id"
              @click="addToCollection(collection.id)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ collection.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Difficulty Badge -->
      <div class="absolute top-3 left-3 z-10">
        <div
          :class="[
            'px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm',
            getDifficultyColor(workout.difficulty),
          ]"
        >
          {{ workout.difficulty || "Intermediate" }}
        </div>
      </div>

      <!-- Workout Type Header -->
      <div
        :class="[
          'h-32 flex items-center justify-center bg-gradient-to-br',
          getTypeGradient(workout.type),
        ]"
      >
        <div class="text-center text-white">
          <Icon
            :name="getTypeIcon(workout.type)"
            variant="fill"
            size="xl"
            class="mb-2"
          />
          <Text
            variant="body"
            class="font-semibold text-sm uppercase tracking-wider"
          >
            {{ workout.type || "Mixed" }}
          </Text>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title and Author -->
      <div class="mb-4">
        <Text
          variant="title"
          class="text-gray-900 dark:text-white font-bold mb-2 line-clamp-2"
        >
          {{ workout.name }}
        </Text>
        <div class="flex items-center gap-2 mb-2">
          <div
            class="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Text variant="body" class="text-white text-xs font-bold">
              {{ workout.sharedBy[0]?.toUpperCase() }}
            </Text>
          </div>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            by {{ workout.sharedBy }}
          </Text>
          <div class="flex items-center gap-1 ml-auto">
            <Icon
              name="star"
              variant="flat"
              size="xs"
              class="text-gray-400 dark:text-gray-500"
            />
            <Text
              variant="body"
              class="text-gray-500 dark:text-gray-500 text-xs"
            >
              {{ formatDate(workout.sharedAt) }}
            </Text>
          </div>
        </div>
      </div>

      <!-- Description -->
      <Text
        variant="body"
        class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4"
      >
        {{ workout.description }}
      </Text>

      <!-- Workout Stats -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="text-center">
          <Text
            variant="body"
            class="text-gray-900 dark:text-white font-bold text-lg"
          >
            {{ workout.exercises?.length || 0 }}
          </Text>
          <Text variant="body" class="text-gray-500 dark:text-gray-500 text-xs">
            Exercises
          </Text>
        </div>
        <div class="text-center">
          <Text
            variant="body"
            class="text-gray-900 dark:text-white font-bold text-lg"
          >
            {{ estimatedDuration }}
          </Text>
          <Text variant="body" class="text-gray-500 dark:text-gray-500 text-xs">
            Minutes
          </Text>
        </div>
        <div class="text-center">
          <Text
            variant="body"
            class="text-gray-900 dark:text-white font-bold text-lg"
          >
            {{ workout.equipment?.length || 0 }}
          </Text>
          <Text variant="body" class="text-gray-500 dark:text-gray-500 text-xs">
            Equipment
          </Text>
        </div>
      </div>

      <!-- Tags -->
      <div
        v-if="workout.tags && workout.tags.length > 0"
        class="flex flex-wrap gap-2 mb-4"
      >
        <div
          v-for="tag in workout.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
        >
          {{ tag }}
        </div>
        <div
          v-if="workout.tags.length > 3"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 rounded-full text-xs font-medium"
        >
          +{{ workout.tags.length - 3 }}
        </div>
      </div>

      <!-- Community Stats -->
      <div
        class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4"
      >
        <div class="flex items-center gap-1">
          <Icon name="star" variant="fill" size="xs" class="text-yellow-400" />
          <span>{{ workout.stats.rating.toFixed(1) }}</span>
          <span class="text-gray-400">·</span>
          <span>{{ workout.stats.downloads }} downloads</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="star" variant="flat" size="xs" />
          <span>{{ workout.stats.likes }} likes</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <Button
          variant="primary"
          size="md"
          @click="handleImport"
          class="flex-1 font-semibold"
          :disabled="importing"
        >
          <template #leading>
            <Icon
              :name="importing ? 'spinner' : 'plus'"
              :variant="importing ? 'flat' : 'fill'"
              size="sm"
              :class="importing ? 'animate-spin' : ''"
            />
          </template>
          {{ importing ? "Importing..." : "Import Workout" }}
        </Button>

        <Button variant="ghost" size="md" @click="handleShare" class="px-3">
          <Icon name="star" variant="flat" size="sm" />
        </Button>

        <Button variant="ghost" size="md" @click="handlePreview" class="px-3">
          <Icon name="star" variant="flat" size="sm" />
        </Button>
      </div>
    </div>

    <!-- Click outside to close collection menu -->
    <div
      v-if="showCollectionMenu"
      @click="showCollectionMenu = false"
      class="fixed inset-0 z-10"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "../layout";
import { Button, Icon, Text } from "../basics";
import type { SharedWorkout } from "../../../types/social";

// Props
interface Props {
  workout: SharedWorkout;
  bgClass?: string;
  availableCollections?: Array<{ id: string; name: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  bgClass:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
  availableCollections: () => [],
});

// Emits
const emit = defineEmits<{
  import: [workout: SharedWorkout];
  share: [workout: SharedWorkout];
  preview: [workout: SharedWorkout];
  "add-to-collection": [workoutId: string, collectionId: string];
  "toggle-favorite": [workoutId: string];
}>();

// Component state
const importing = ref(false);
const showCollectionMenu = ref(false);

// Computed properties
const estimatedDuration = computed(() => {
  // Simple estimation based on exercises and sets
  const exercises = props.workout.exercises?.length || 0;
  return Math.max(15, exercises * 3);
});

// Methods
function getDifficultyColor(difficulty: string | undefined): string {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return "bg-green-500/80";
    case "intermediate":
      return "bg-yellow-500/80";
    case "advanced":
      return "bg-red-500/80";
    default:
      return "bg-blue-500/80";
  }
}

function getTypeGradient(type: string | undefined): string {
  switch (type?.toLowerCase()) {
    case "strength":
      return "from-red-500 to-red-600";
    case "cardio":
      return "from-blue-500 to-blue-600";
    case "hiit":
      return "from-orange-500 to-orange-600";
    case "flexibility":
      return "from-green-500 to-green-600";
    case "mixed":
    default:
      return "from-purple-500 to-purple-600";
  }
}

function getTypeIcon(type: string | undefined): string {
  switch (type?.toLowerCase()) {
    case "strength":
      return "star";
    case "cardio":
      return "star";
    case "hiit":
      return "star";
    case "flexibility":
      return "star";
    default:
      return "star";
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}m ago`;
}

function isInCollection(collectionId: string): boolean {
  // This would typically check if the workout is in a specific collection
  // For now, return false as a placeholder
  return false;
}

async function handleImport() {
  if (importing.value) return;

  importing.value = true;
  try {
    emit("import", props.workout);
  } finally {
    importing.value = false;
  }
}

function handleShare() {
  emit("share", props.workout);
}

function handlePreview() {
  emit("preview", props.workout);
}

function addToCollection(collectionId: string) {
  emit("add-to-collection", props.workout.id, collectionId);
  showCollectionMenu.value = false;
}

function toggleFavorite() {
  emit("toggle-favorite", props.workout.id);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
