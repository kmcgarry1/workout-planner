<!--
  SharedWorkoutBrowser.vue
  Component for browsing and importing shared workouts from the community.
-->
<template>
  <div class="space-y-6">
    <!-- Header with Search -->
    <div class="space-y-4">
      <div
        class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold mb-1"
          >
            Community Workouts
          </Text>
          <Text variant="body" class="text-gray-600 dark:text-gray-400">
            Discover and import workouts shared by the community
          </Text>
        </div>

        <!-- Search and Filters -->
        <div class="flex gap-3">
          <Input
            v-model="searchQuery"
            variant="filled"
            size="md"
            placeholder="Search workouts..."
            class="w-64"
          >
            <template #prepend>
              <Icon
                name="search"
                variant="flat"
                size="sm"
                class="text-gray-400"
              />
            </template>
          </Input>
          <Button
            variant="outline"
            size="md"
            @click="showFilters = !showFilters"
            :class="{ 'bg-blue-50 dark:bg-blue-950': showFilters }"
          >
            <template #leading>
              <Icon name="star" variant="flat" size="sm" />
            </template>
            Filters
          </Button>
        </div>
      </div>

      <!-- Filters Panel -->
      <Card
        v-if="showFilters"
        variant="outlined"
        padding="md"
        rounded="lg"
        bg-class="bg-gray-50 dark:bg-gray-800/50"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Text
              variant="body"
              class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Difficulty
            </Text>
            <select
              v-model="filters.difficulty"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <Text
              variant="body"
              class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Category
            </Text>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">All Categories</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Full Body">Full Body</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Lower Body">Lower Body</option>
              <option value="Core">Core</option>
              <option value="HIIT">HIIT</option>
            </select>
          </div>

          <div>
            <Text
              variant="body"
              class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Duration
            </Text>
            <select
              v-model="filters.duration"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Any Duration</option>
              <option value="short">Under 30 min</option>
              <option value="medium">30-60 min</option>
              <option value="long">Over 60 min</option>
            </select>
          </div>

          <div>
            <Text
              variant="body"
              class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Sort By
            </Text>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>
        </div>
      </Card>
    </div>

    <!-- Results Stats -->
    <div class="flex items-center justify-between">
      <Text variant="body" class="text-gray-600 dark:text-gray-400">
        {{ filteredWorkouts.length }} workouts found
      </Text>

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          @click="refreshWorkouts"
          :disabled="isLoading"
        >
          <template #leading>
            <Icon
              name="star"
              variant="flat"
              size="sm"
              :class="{ 'animate-spin': isLoading }"
            />
          </template>
          Refresh
        </Button>
      </div>
    </div>

    <!-- Workout Grid -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Card
        v-for="n in 6"
        :key="n"
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        class="animate-pulse"
      >
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </Card>
    </div>

    <div v-else-if="filteredWorkouts.length === 0" class="text-center py-12">
      <Icon
        name="search"
        variant="flat"
        size="xl"
        class="text-gray-300 dark:text-gray-600 mb-4"
      />
      <Text
        variant="title"
        class="text-gray-500 dark:text-gray-500 font-semibold mb-2"
      >
        No workouts found
      </Text>
      <Text variant="body" class="text-gray-400 dark:text-gray-600 mb-4">
        Try adjusting your search or filters
      </Text>
      <Button variant="outline" size="md" @click="clearFilters">
        Clear Filters
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="workout in filteredWorkouts"
        :key="workout.id"
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="lg"
        bg-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
        class="overflow-hidden"
      >
        <!-- Header -->
        <div class="p-6 pb-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <Text
                variant="title"
                class="text-gray-900 dark:text-white font-bold mb-1 line-clamp-2"
              >
                {{ workout.name }}
              </Text>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 text-sm"
              >
                by {{ workout.sharedBy }}
              </Text>
            </div>

            <div class="flex items-center gap-1 ml-3">
              <Icon
                name="star"
                variant="fill"
                size="sm"
                class="text-yellow-400"
              />
              <span
                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {{ workout.stats.rating.toFixed(1) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4"
          >
            {{ workout.description }}
          </Text>

          <!-- Tags -->
          <div v-if="workout.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in workout.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
            >
              {{ tag }}
            </span>
            <span
              v-if="workout.tags.length > 3"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs"
            >
              +{{ workout.tags.length - 3 }}
            </span>
          </div>
        </div>

        <!-- Stats -->
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-bold text-sm mb-1"
              >
                {{ workout.metadata.difficulty }}
              </Text>
              <Text
                variant="body"
                class="text-gray-500 dark:text-gray-500 text-xs"
              >
                Difficulty
              </Text>
            </div>

            <div>
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-bold text-sm mb-1"
              >
                {{ workout.metadata.estimatedDuration }}m
              </Text>
              <Text
                variant="body"
                class="text-gray-500 dark:text-gray-500 text-xs"
              >
                Duration
              </Text>
            </div>

            <div>
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-bold text-sm mb-1"
              >
                {{ workout.exercises.length }}
              </Text>
              <Text
                variant="body"
                class="text-gray-500 dark:text-gray-500 text-xs"
              >
                Exercises
              </Text>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <CardActions
          justify="between"
          padding="md"
          class="bg-gray-50 dark:bg-gray-800/30"
        >
          <div
            class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500"
          >
            <div class="flex items-center gap-1">
              <Icon name="star" variant="flat" size="xs" />
              {{ workout.stats.downloads }}
            </div>
            <div class="flex items-center gap-1">
              <Icon name="star" variant="flat" size="xs" />
              {{ workout.stats.likes }}
            </div>
          </div>

          <div class="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              @click="previewWorkout(workout)"
              class="font-semibold"
            >
              Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              @click="importWorkout(workout)"
              :disabled="isImporting === workout.id"
              class="font-semibold"
            >
              <template #leading>
                <Icon
                  :name="isImporting === workout.id ? 'spinner' : 'plus'"
                  :variant="isImporting === workout.id ? 'flat' : 'fill'"
                  size="sm"
                  :class="{ 'animate-spin': isImporting === workout.id }"
                />
              </template>
              {{ isImporting === workout.id ? "Importing..." : "Import" }}
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>

    <!-- Import Success Message -->
    <div v-if="importSuccess" class="fixed bottom-4 right-4 z-50">
      <Card
        variant="elevated"
        padding="md"
        rounded="lg"
        shadow="xl"
        bg-class="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800"
      >
        <div class="flex items-center gap-3">
          <Icon
            name="check"
            variant="fill"
            size="md"
            class="text-green-600 dark:text-green-400"
          />
          <div>
            <Text
              variant="body"
              class="text-green-800 dark:text-green-200 font-semibold"
            >
              Workout imported successfully!
            </Text>
            <Text
              variant="body"
              class="text-green-700 dark:text-green-300 text-sm"
            >
              Check your workout library to start training.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { Card } from "../layout";
import { CardActions } from "../layout/card-components";
import { Button, Icon, Text, Input } from "../basics";
import { useWorkoutSharing } from "../../../composables/useWorkoutSharing";
import type { SharedWorkout } from "../../../types/social";

const {
  sharedWorkouts,
  searchSharedWorkouts,
  importSharedWorkout,
  loadSharedWorkouts,
  popularWorkouts,
} = useWorkoutSharing();

// Component state
const searchQuery = ref("");
const showFilters = ref(false);
const isLoading = ref(true);
const isImporting = ref<string | null>(null);
const importSuccess = ref(false);

const filters = reactive({
  difficulty: "",
  category: "",
  duration: "",
});

const sortBy = ref("newest");

// Computed properties
const filteredWorkouts = computed(() => {
  let results = searchSharedWorkouts(searchQuery.value);

  // Apply filters
  if (filters.difficulty) {
    results = results.filter(
      (w) => w.metadata.difficulty === filters.difficulty
    );
  }

  if (filters.category) {
    results = results.filter((w) => w.metadata.category === filters.category);
  }

  if (filters.duration) {
    results = results.filter((w) => {
      const duration = w.metadata.estimatedDuration;
      switch (filters.duration) {
        case "short":
          return duration < 30;
        case "medium":
          return duration >= 30 && duration <= 60;
        case "long":
          return duration > 60;
        default:
          return true;
      }
    });
  }

  // Apply sorting
  switch (sortBy.value) {
    case "popular":
      return results.sort(
        (a, b) =>
          b.stats.downloads +
          b.stats.likes -
          (a.stats.downloads + a.stats.likes)
      );
    case "rating":
      return results.sort((a, b) => b.stats.rating - a.stats.rating);
    case "downloads":
      return results.sort((a, b) => b.stats.downloads - a.stats.downloads);
    case "newest":
    default:
      return results.sort(
        (a, b) =>
          new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      );
  }
});

// Methods
function refreshWorkouts() {
  isLoading.value = true;
  // Simulate API call
  setTimeout(() => {
    loadSharedWorkouts();
    isLoading.value = false;
  }, 1000);
}

function clearFilters() {
  searchQuery.value = "";
  filters.difficulty = "";
  filters.category = "";
  filters.duration = "";
  sortBy.value = "newest";
  showFilters.value = false;
}

async function importWorkout(workout: SharedWorkout) {
  isImporting.value = workout.id;

  try {
    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = importSharedWorkout(workout);

    if (result.success) {
      importSuccess.value = true;

      // Hide success message after 3 seconds
      setTimeout(() => {
        importSuccess.value = false;
      }, 3000);
    } else {
      // Handle error (could show a toast or alert)
      console.error("Failed to import workout:", result.error);
    }
  } catch (error) {
    console.error("Import error:", error);
  } finally {
    isImporting.value = null;
  }
}

function previewWorkout(workout: SharedWorkout) {
  // TODO: Implement workout preview modal
  console.log("Preview workout:", workout);
}

// Initialize
onMounted(() => {
  refreshWorkouts();
});
</script>
