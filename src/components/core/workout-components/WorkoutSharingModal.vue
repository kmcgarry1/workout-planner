<!--
  WorkoutSharingModal.vue
  Modal component for sharing workouts as templates with custom descriptions and tags.
-->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-2xl">
      <Card
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="xl"
        bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
      >
        <CardHeader
          :title="'Share: ' + (workout?.name || 'Workout')"
          subtitle="Make your workout available to the community"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-blue-600 rounded-lg">
              <Icon name="star" variant="fill" size="md" class="text-white" />
            </div>
          </template>
          <template #append>
            <Button variant="ghost" size="sm" @click="$emit('close')">
              <Icon name="x" variant="flat" size="sm" />
            </Button>
          </template>
        </CardHeader>

        <CardBody padding="lg">
          <form @submit.prevent="handleShare" class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Title
                </Text>
                <Input
                  v-model="shareForm.title"
                  variant="filled"
                  size="md"
                  :placeholder="workout?.name || 'Enter workout title'"
                  required
                />
              </div>

              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Description
                </Text>
                <textarea
                  v-model="shareForm.description"
                  rows="4"
                  placeholder="Describe your workout, target muscles, difficulty, or any tips..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <!-- Workout Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Difficulty
                </Text>
                <select
                  v-model="shareForm.difficulty"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
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
                  v-model="shareForm.category"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Full Body">Full Body</option>
                  <option value="Upper Body">Upper Body</option>
                  <option value="Lower Body">Lower Body</option>
                  <option value="Core">Core</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Functional">Functional</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
              </div>

              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Duration (min)
                </Text>
                <Input
                  v-model.number="shareForm.estimatedDuration"
                  type="number"
                  variant="filled"
                  size="md"
                  placeholder="45"
                  min="1"
                  max="300"
                />
              </div>
            </div>

            <!-- Tags -->
            <div>
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Tags
              </Text>
              <div class="space-y-3">
                <!-- Tag Input -->
                <div class="flex gap-2">
                  <Input
                    v-model="newTag"
                    variant="filled"
                    size="md"
                    placeholder="Add a tag (e.g., beginner-friendly, no-equipment)"
                    @keydown.enter.prevent="addTag"
                    class="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    @click="addTag"
                    :disabled="!newTag.trim()"
                  >
                    Add
                  </Button>
                </div>

                <!-- Popular Tags -->
                <div>
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm mb-2"
                  >
                    Popular tags:
                  </Text>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tag in popularTags"
                      :key="tag"
                      type="button"
                      @click="addPopularTag(tag)"
                      :disabled="shareForm.tags.includes(tag)"
                      :class="[
                        'px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200',
                        shareForm.tags.includes(tag)
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
                      ]"
                    >
                      {{ tag }}
                    </button>
                  </div>
                </div>

                <!-- Selected Tags -->
                <div
                  v-if="shareForm.tags.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <div
                    v-for="tag in shareForm.tags"
                    :key="tag"
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeTag(tag)"
                      class="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Icon name="x" variant="flat" size="xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Workout Preview -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-semibold mb-3"
              >
                Workout Preview
              </Text>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Exercises:</span
                  >
                  <span class="font-medium">{{
                    workout?.exercises.length || 0
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Total Sets:</span
                  >
                  <span class="font-medium">{{ totalSets }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Equipment:</span
                  >
                  <span class="font-medium">{{ equipmentList }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400"
                    >Muscle Groups:</span
                  >
                  <span class="font-medium">{{ muscleGroupsList }}</span>
                </div>
              </div>
            </div>

            <!-- Privacy Settings -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <Text
                    variant="body"
                    class="text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    Public Sharing
                  </Text>
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Allow anyone to discover and use this workout
                  </Text>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="shareForm.isPublic"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <Text
                    variant="body"
                    class="text-gray-700 dark:text-gray-300 font-semibold"
                  >
                    Template Mode
                  </Text>
                  <Text
                    variant="body"
                    class="text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Reset completion status for others to use as a fresh
                    template
                  </Text>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="shareForm.isTemplate"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                  ></div>
                </label>
              </div>
            </div>

            <!-- Error/Success Messages -->
            <div
              v-if="error"
              class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <Text
                variant="body"
                class="text-red-700 dark:text-red-300 text-sm"
              >
                {{ error }}
              </Text>
            </div>

            <div
              v-if="success"
              class="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div class="flex items-center justify-between">
                <Text
                  variant="body"
                  class="text-green-700 dark:text-green-300 text-sm"
                >
                  Workout shared successfully!
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="copyShareLink"
                  class="text-green-600 dark:text-green-400"
                >
                  <template #leading>
                    <Icon name="star" variant="flat" size="sm" />
                  </template>
                  Copy Link
                </Button>
              </div>
            </div>
          </form>
        </CardBody>

        <CardActions justify="between" padding="lg">
          <Button
            variant="ghost"
            size="md"
            @click="$emit('close')"
            class="font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            @click="handleShare"
            :disabled="!shareForm.title || !shareForm.description || isSharing"
            :class="{ 'opacity-50 cursor-not-allowed': isSharing }"
            class="font-semibold"
          >
            <template #leading>
              <Icon
                :name="isSharing ? 'spinner' : 'star'"
                :variant="isSharing ? 'flat' : 'fill'"
                size="sm"
                :class="{ 'animate-spin': isSharing }"
              />
            </template>
            {{ isSharing ? "Sharing..." : "Share Workout" }}
          </Button>
        </CardActions>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody, CardActions } from "../layout/card-components";
import { Button, Icon, Text, Input } from "../basics";
import { useWorkoutSharing } from "../../../composables/useWorkoutSharing";
import type { Workout } from "../../../types/workout";
import type { WorkoutShareSettings } from "../../../types/social";

interface Props {
  isOpen: boolean;
  workout: Workout | null;
}

interface Emits {
  (e: "close"): void;
  (e: "shared", shareId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { shareWorkout, shareViaWebApi } = useWorkoutSharing();

// Form state
const shareForm = reactive<WorkoutShareSettings & { tags: string[] }>({
  title: "",
  description: "",
  tags: [],
  difficulty: "Intermediate",
  category: "General",
  estimatedDuration: 0,
  isPublic: true,
  isTemplate: true,
});

const newTag = ref("");
const error = ref("");
const success = ref(false);
const isSharing = ref(false);
const shareUrl = ref("");

// Popular tags for quick selection
const popularTags = [
  "Beginner Friendly",
  "No Equipment",
  "Home Workout",
  "Quick",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core",
  "HIIT",
  "Strength",
  "Cardio",
];

// Initialize form when workout changes
watch(
  () => props.workout,
  (workout) => {
    if (workout) {
      shareForm.title = workout.name || "";
      shareForm.description = workout.notes || "";
      shareForm.estimatedDuration =
        workout.totalDuration || calculateEstimatedDuration(workout);
      shareForm.tags = workout.tags || [];

      // Reset other form state
      error.value = "";
      success.value = false;
      shareUrl.value = "";
    }
  },
  { immediate: true }
);

// Computed properties
const totalSets = computed(() => {
  return (
    props.workout?.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0
    ) || 0
  );
});

const equipmentList = computed(() => {
  const equipment = new Set<string>();
  props.workout?.exercises.forEach((exercise) => {
    exercise.exercise.equipment?.forEach((eq) => equipment.add(eq));
  });
  const list = Array.from(equipment);
  return list.length > 0
    ? list.slice(0, 3).join(", ") + (list.length > 3 ? "..." : "")
    : "None";
});

const muscleGroupsList = computed(() => {
  const muscleGroups = new Set<string>();
  props.workout?.exercises.forEach((exercise) => {
    exercise.exercise.muscleGroups?.forEach((mg) => muscleGroups.add(mg));
  });
  const list = Array.from(muscleGroups);
  return list.length > 0
    ? list.slice(0, 3).join(", ") + (list.length > 3 ? "..." : "")
    : "Various";
});

// Methods
function calculateEstimatedDuration(workout: Workout): number {
  // Simple estimation based on exercises and sets
  let duration = 0;
  workout.exercises.forEach((exercise) => {
    duration += exercise.sets.length * 2; // 2 minutes per set average
  });
  return Math.max(15, duration); // Minimum 15 minutes
}

function addTag() {
  const tag = newTag.value.trim();
  if (tag && !shareForm.tags.includes(tag)) {
    shareForm.tags.push(tag);
    newTag.value = "";
  }
}

function addPopularTag(tag: string) {
  if (!shareForm.tags.includes(tag)) {
    shareForm.tags.push(tag);
  }
}

function removeTag(tag: string) {
  const index = shareForm.tags.indexOf(tag);
  if (index > -1) {
    shareForm.tags.splice(index, 1);
  }
}

async function handleShare() {
  if (!props.workout) return;

  error.value = "";
  isSharing.value = true;

  try {
    const result = shareWorkout(props.workout, {
      ...shareForm,
      sharedBy: "Current User", // In a real app, this would be the actual user
    });

    if (result.success) {
      success.value = true;
      shareUrl.value = result.shareUrl || "";
      emit("shared", result.shareId || "");

      // Optional: Auto-share via Web API
      if (shareUrl.value) {
        // You could automatically trigger the native share dialog here
        // shareViaWebApi(shareUrl.value)
      }
    } else {
      error.value = result.error || "Failed to share workout";
    }
  } catch (err) {
    error.value = "An unexpected error occurred";
    console.error("Share error:", err);
  } finally {
    isSharing.value = false;
  }
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    // Could show a toast notification here
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
}
</script>
