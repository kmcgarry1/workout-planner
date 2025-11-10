<!--
  CommunityLibraryView.vue
  Dedicated view for the community workout library with enhanced discovery and social features.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/20 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center p-4 mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg"
        >
          <Icon name="star" variant="fill" size="xl" class="text-white" />
        </div>
        <Text
          variant="header"
          class="text-gray-900 dark:text-white font-black mb-3 tracking-tight"
        >
          Community Workout Library
        </Text>
        <Text
          variant="body"
          class="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto"
        >
          Discover thousands of workouts shared by the community. Find the
          perfect routine for your fitness goals and level.
        </Text>

        <!-- Quick Stats -->
        <div class="flex justify-center gap-8 mb-8">
          <div class="text-center">
            <Text
              variant="title"
              class="text-purple-600 dark:text-purple-400 font-black text-2xl mb-1"
            >
              {{ shareStats.totalShared }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Workouts Shared
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="title"
              class="text-pink-600 dark:text-pink-400 font-black text-2xl mb-1"
            >
              {{ shareStats.totalDownloads }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Downloads
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="title"
              class="text-blue-600 dark:text-blue-400 font-black text-2xl mb-1"
            >
              {{ shareStats.averageRating.toFixed(1) }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Avg Rating
            </Text>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="mb-8">
        <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
          <div class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 first:rounded-l-xl last:rounded-r-xl',
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white',
              ]"
            >
              <Icon
                :name="tab.icon"
                variant="flat"
                size="sm"
                class="inline mr-2"
              />
              {{ tab.name }}
            </button>
          </div>
        </Card>
      </div>

      <!-- Tab Content -->
      <div class="space-y-8">
        <!-- Discover Tab -->
        <div v-if="activeTab === 'discover'">
          <SharedWorkoutBrowser />
        </div>

        <!-- Trending Tab -->
        <div v-else-if="activeTab === 'trending'">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  Trending This Week
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  Most popular workouts in the community
                </Text>
              </div>

              <Button variant="outline" size="md" @click="refreshTrending">
                <template #leading>
                  <Icon name="star" variant="flat" size="sm" />
                </template>
                Refresh
              </Button>
            </div>

            <!-- Trending Workouts Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                v-for="(workout, index) in popularWorkouts.slice(0, 6)"
                :key="workout.id"
                variant="elevated"
                padding="none"
                rounded="xl"
                shadow="lg"
                bg-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
                class="overflow-hidden relative"
              >
                <!-- Trending Badge -->
                <div class="absolute top-3 left-3 z-10">
                  <div
                    :class="[
                      'px-3 py-1 rounded-full text-white text-xs font-bold',
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-orange-400'
                        : 'bg-purple-500',
                    ]"
                  >
                    {{
                      index === 0
                        ? "🥇 #1"
                        : index === 1
                        ? "🥈 #2"
                        : index === 2
                        ? "🥉 #3"
                        : `#${index + 1}`
                    }}
                  </div>
                </div>

                <!-- Workout Card Content -->
                <div class="p-6">
                  <div class="mt-6">
                    <Text
                      variant="title"
                      class="text-gray-900 dark:text-white font-bold mb-2 line-clamp-2"
                    >
                      {{ workout.name }}
                    </Text>
                    <Text
                      variant="body"
                      class="text-gray-600 dark:text-gray-400 text-sm mb-3"
                    >
                      by {{ workout.sharedBy }}
                    </Text>
                    <Text
                      variant="body"
                      class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4"
                    >
                      {{ workout.description }}
                    </Text>

                    <!-- Stats -->
                    <div
                      class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4"
                    >
                      <div class="flex items-center gap-1">
                        <Icon
                          name="star"
                          variant="fill"
                          size="xs"
                          class="text-yellow-400"
                        />
                        {{ workout.stats.rating.toFixed(1) }}
                      </div>
                      <div class="flex items-center gap-1">
                        <Icon name="star" variant="flat" size="xs" />
                        {{ workout.stats.downloads }}
                      </div>
                      <div class="flex items-center gap-1">
                        <Icon name="star" variant="flat" size="xs" />
                        {{ workout.stats.likes }}
                      </div>
                    </div>

                    <!-- Action Button -->
                    <Button
                      variant="primary"
                      size="md"
                      @click="importWorkout(workout)"
                      class="w-full font-semibold"
                    >
                      <template #leading>
                        <Icon name="plus" variant="fill" size="sm" />
                      </template>
                      Import Workout
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <!-- Categories Tab -->
        <div v-else-if="activeTab === 'categories'">
          <div class="space-y-6">
            <div>
              <Text
                variant="title"
                class="text-gray-900 dark:text-white font-bold mb-1"
              >
                Browse by Category
              </Text>
              <Text variant="body" class="text-gray-600 dark:text-gray-400">
                Find workouts organized by type and focus area
              </Text>
            </div>

            <!-- Category Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card
                v-for="category in categories"
                :key="category.id"
                variant="elevated"
                padding="lg"
                rounded="xl"
                shadow="lg"
                :bg-class="`bg-gradient-to-br ${category.gradient} hover:scale-105 transition-transform duration-200 cursor-pointer`"
                @click="browseCategory(category)"
              >
                <div class="text-center">
                  <div class="p-3 bg-white/20 rounded-xl mb-3 w-fit mx-auto">
                    <Icon
                      :name="category.icon"
                      variant="fill"
                      size="lg"
                      class="text-white"
                    />
                  </div>
                  <Text variant="body" class="text-white font-bold mb-1">
                    {{ category.name }}
                  </Text>
                  <Text variant="body" class="text-white/80 text-sm mb-2">
                    {{ category.count }} workouts
                  </Text>
                  <Text variant="body" class="text-white/70 text-xs">
                    {{ category.description }}
                  </Text>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <!-- My Shared Tab -->
        <div v-else-if="activeTab === 'shared'">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  My Shared Workouts
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  Workouts you've shared with the community
                </Text>
              </div>

              <Button
                variant="primary"
                size="md"
                @click="$router.push('/library')"
              >
                <template #leading>
                  <Icon name="plus" variant="fill" size="sm" />
                </template>
                Share New Workout
              </Button>
            </div>

            <!-- Shared Workouts -->
            <div v-if="mySharedWorkouts.length === 0" class="text-center py-12">
              <Icon
                name="star"
                variant="flat"
                size="xl"
                class="text-gray-300 dark:text-gray-600 mb-4"
              />
              <Text
                variant="title"
                class="text-gray-500 dark:text-gray-500 font-semibold mb-2"
              >
                No shared workouts yet
              </Text>
              <Text
                variant="body"
                class="text-gray-400 dark:text-gray-600 mb-4"
              >
                Share your favorite workouts with the community to help others
                reach their goals
              </Text>
              <Button
                variant="primary"
                size="lg"
                @click="$router.push('/library')"
              >
                <template #leading>
                  <Icon name="star" variant="fill" size="sm" />
                </template>
                Go to Your Library
              </Button>
            </div>

            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card
                v-for="workout in mySharedWorkouts"
                :key="workout.id"
                variant="elevated"
                padding="none"
                rounded="xl"
                shadow="lg"
                bg-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                class="overflow-hidden"
              >
                <div class="p-6">
                  <Text
                    variant="title"
                    class="text-gray-900 dark:text-white font-bold mb-2 line-clamp-2"
                  >
                    {{ workout.name }}
                  </Text>
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4"
                  >
                    {{ workout.description }}
                  </Text>

                  <!-- Performance Stats -->
                  <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="text-center">
                      <Text
                        variant="body"
                        class="text-gray-900 dark:text-white font-bold text-lg"
                      >
                        {{ workout.stats.downloads }}
                      </Text>
                      <Text
                        variant="body"
                        class="text-gray-500 dark:text-gray-500 text-xs"
                      >
                        Downloads
                      </Text>
                    </div>
                    <div class="text-center">
                      <Text
                        variant="body"
                        class="text-gray-900 dark:text-white font-bold text-lg"
                      >
                        {{ workout.stats.likes }}
                      </Text>
                      <Text
                        variant="body"
                        class="text-gray-500 dark:text-gray-500 text-xs"
                      >
                        Likes
                      </Text>
                    </div>
                    <div class="text-center">
                      <Text
                        variant="body"
                        class="text-gray-900 dark:text-white font-bold text-lg"
                      >
                        {{ workout.stats.rating.toFixed(1) }}
                      </Text>
                      <Text
                        variant="body"
                        class="text-gray-500 dark:text-gray-500 text-xs"
                      >
                        Rating
                      </Text>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="shareWorkout(workout)"
                      class="flex-1 font-semibold"
                    >
                      Share Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="viewAnalytics(workout)"
                      class="flex-1 font-semibold"
                    >
                      Analytics
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Card } from "../components/core/layout";
import { Button, Icon, Text } from "../components/core/basics";
import { SharedWorkoutBrowser } from "../components/core/workout-components";
import { useWorkoutSharing } from "../composables/useWorkoutSharing";
import type { SharedWorkout } from "../types/social";

const router = useRouter();
const {
  mySharedWorkouts,
  popularWorkouts,
  shareStats,
  shareViaWebApi,
  importSharedWorkout,
  loadSharedWorkouts,
} = useWorkoutSharing();

// Component state
const activeTab = ref("discover");

const tabs = [
  { id: "discover", name: "Discover", icon: "search" },
  { id: "trending", name: "Trending", icon: "star" },
  { id: "categories", name: "Categories", icon: "star" },
  { id: "shared", name: "My Shared", icon: "star" },
];

const categories = [
  {
    id: "strength",
    name: "Strength",
    description: "Build muscle and power",
    icon: "star",
    gradient: "from-red-500 to-red-600",
    count: 156,
  },
  {
    id: "cardio",
    name: "Cardio",
    description: "Improve endurance",
    icon: "star",
    gradient: "from-blue-500 to-blue-600",
    count: 89,
  },
  {
    id: "hiit",
    name: "HIIT",
    description: "High intensity training",
    icon: "star",
    gradient: "from-orange-500 to-orange-600",
    count: 67,
  },
  {
    id: "fullbody",
    name: "Full Body",
    description: "Complete workouts",
    icon: "star",
    gradient: "from-purple-500 to-purple-600",
    count: 134,
  },
  {
    id: "upperbody",
    name: "Upper Body",
    description: "Arms, chest, back",
    icon: "star",
    gradient: "from-green-500 to-green-600",
    count: 78,
  },
  {
    id: "lowerbody",
    name: "Lower Body",
    description: "Legs and glutes",
    icon: "star",
    gradient: "from-pink-500 to-pink-600",
    count: 92,
  },
  {
    id: "core",
    name: "Core",
    description: "Abs and stability",
    icon: "star",
    gradient: "from-teal-500 to-teal-600",
    count: 54,
  },
  {
    id: "flexibility",
    name: "Flexibility",
    description: "Mobility and stretching",
    icon: "star",
    gradient: "from-indigo-500 to-indigo-600",
    count: 43,
  },
];

// Methods
function refreshTrending() {
  loadSharedWorkouts();
}

function browseCategory(category: any) {
  // Navigate to discover tab with category filter
  activeTab.value = "discover";
  // This would ideally set a filter in the SharedWorkoutBrowser component
  // For now, just switch to discover tab
}

async function importWorkout(workout: SharedWorkout) {
  try {
    const result = importSharedWorkout(workout);
    if (result.success) {
      // Show success notification (could be a toast)
      console.log("Workout imported successfully!");
    } else {
      console.error("Failed to import workout:", result.error);
    }
  } catch (error) {
    console.error("Import error:", error);
  }
}

async function shareWorkout(workout: SharedWorkout) {
  try {
    await shareViaWebApi(workout);
  } catch (error) {
    console.error("Share error:", error);
  }
}

function viewAnalytics(workout: SharedWorkout) {
  // TODO: Implement analytics view
  console.log("View analytics for:", workout);
}

// Initialize
onMounted(() => {
  loadSharedWorkouts();
});
</script>
