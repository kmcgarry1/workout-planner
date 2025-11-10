<!--
  WorkoutCollections.vue
  Component for organizing shared workouts into collections and favorites.
-->
<template>
  <div class="space-y-6">
    <!-- Collections Header -->
    <div class="flex items-center justify-between">
      <div>
        <Text
          variant="title"
          class="text-gray-900 dark:text-white font-bold mb-1"
        >
          My Collections
        </Text>
        <Text variant="body" class="text-gray-600 dark:text-gray-400">
          Organize and save workouts for easy access
        </Text>
      </div>

      <Button variant="primary" size="md" @click="showCreateModal = true">
        <template #leading>
          <Icon name="plus" variant="fill" size="sm" />
        </template>
        New Collection
      </Button>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Favorites Collection -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-red-500 to-pink-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
        @click="viewCollection('favorites')"
      >
        <div class="text-center text-white">
          <div class="p-3 bg-white/20 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" />
          </div>
          <Text variant="body" class="font-bold mb-1"> Favorites </Text>
          <Text variant="body" class="text-white/80 text-sm mb-2">
            {{ favorites.length }} workouts
          </Text>
          <Text variant="body" class="text-white/70 text-xs">
            Your starred workouts
          </Text>
        </div>
      </Card>

      <!-- Recent Collection -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
        @click="viewCollection('recent')"
      >
        <div class="text-center text-white">
          <div class="p-3 bg-white/20 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" />
          </div>
          <Text variant="body" class="font-bold mb-1"> Recent </Text>
          <Text variant="body" class="text-white/80 text-sm mb-2">
            {{ recentWorkouts.length }} workouts
          </Text>
          <Text variant="body" class="text-white/70 text-xs">
            Recently imported
          </Text>
        </div>
      </Card>

      <!-- To Try Collection -->
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-green-500 to-teal-600 hover:scale-105 transition-transform duration-200 cursor-pointer"
        @click="viewCollection('to-try')"
      >
        <div class="text-center text-white">
          <div class="p-3 bg-white/20 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" />
          </div>
          <Text variant="body" class="font-bold mb-1"> To Try </Text>
          <Text variant="body" class="text-white/80 text-sm mb-2">
            {{ toTryWorkouts.length }} workouts
          </Text>
          <Text variant="body" class="text-white/70 text-xs">
            Saved for later
          </Text>
        </div>
      </Card>
    </div>

    <!-- Custom Collections -->
    <div v-if="customCollections.length > 0">
      <Text
        variant="subtitle"
        class="text-gray-900 dark:text-white font-semibold mb-4"
      >
        Custom Collections
      </Text>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="collection in customCollections"
          :key="collection.id"
          variant="elevated"
          padding="none"
          rounded="xl"
          shadow="lg"
          bg-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
          class="overflow-hidden cursor-pointer"
          @click="viewCollection(collection.id)"
        >
          <!-- Collection Header -->
          <div
            :class="[
              'h-24 bg-gradient-to-br flex items-center justify-center',
              collection.color || 'from-purple-500 to-purple-600',
            ]"
          >
            <Icon
              :name="collection.icon || 'star'"
              variant="fill"
              size="xl"
              class="text-white"
            />
          </div>

          <div class="p-6">
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold mb-2"
            >
              {{ collection.name }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm mb-3"
            >
              {{ collection.description || "Custom workout collection" }}
            </Text>

            <div class="flex items-center justify-between text-sm">
              <Text variant="body" class="text-gray-500 dark:text-gray-500">
                {{ collection.workouts.length }} workouts
              </Text>

              <div class="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  @click.stop="editCollection(collection)"
                >
                  <Icon name="star" variant="flat" size="xs" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click.stop="deleteCollection(collection)"
                  color-class="text-red-500 hover:text-red-600"
                >
                  <Icon name="x" variant="flat" size="xs" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="customCollections.length === 0" class="text-center py-12">
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
        No custom collections yet
      </Text>
      <Text variant="body" class="text-gray-400 dark:text-gray-600 mb-4">
        Create collections to organize your saved workouts by goal, difficulty,
        or any other criteria
      </Text>
      <Button variant="primary" size="lg" @click="showCreateModal = true">
        <template #leading>
          <Icon name="plus" variant="fill" size="sm" />
        </template>
        Create Your First Collection
      </Button>
    </div>

    <!-- Create Collection Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="xl"
        bg-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        class="w-full max-w-md"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold"
            >
              {{ editingCollection ? "Edit Collection" : "Create Collection" }}
            </Text>
            <Button variant="ghost" size="sm" @click="closeModal">
              <Icon name="x" variant="flat" size="sm" />
            </Button>
          </div>

          <form @submit.prevent="saveCollection" class="space-y-4">
            <!-- Name Input -->
            <div>
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Collection Name
              </Text>
              <Input
                v-model="collectionForm.name"
                placeholder="e.g., Morning Routines"
                required
                class="w-full"
              />
            </div>

            <!-- Description Input -->
            <div>
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Description (Optional)
              </Text>
              <Input
                v-model="collectionForm.description"
                placeholder="Brief description of this collection"
                class="w-full"
              />
            </div>

            <!-- Color Picker -->
            <div>
              <Text
                variant="body"
                class="text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Color Theme
              </Text>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.id"
                  type="button"
                  @click="collectionForm.color = color.gradient"
                  :class="[
                    'h-12 rounded-lg bg-gradient-to-br border-2 transition-all duration-200',
                    color.gradient,
                    collectionForm.color === color.gradient
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-transparent hover:scale-105',
                  ]"
                ></button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
              <Button
                variant="outline"
                size="md"
                @click="closeModal"
                class="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" class="flex-1">
                {{ editingCollection ? "Update" : "Create" }}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { Card } from "../layout";
import { Button, Icon, Text, Input } from "../basics";

// Types
interface WorkoutCollection {
  id: string;
  name: string;
  description?: string;
  workouts: string[]; // workout IDs
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionForm {
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Component state
const showCreateModal = ref(false);
const editingCollection = ref<WorkoutCollection | null>(null);
const collections = ref<WorkoutCollection[]>([]);

const collectionForm = reactive<CollectionForm>({
  name: "",
  description: "",
  color: "from-purple-500 to-purple-600",
  icon: "star",
});

const colorOptions = [
  { id: "purple", gradient: "from-purple-500 to-purple-600" },
  { id: "blue", gradient: "from-blue-500 to-blue-600" },
  { id: "green", gradient: "from-green-500 to-green-600" },
  { id: "red", gradient: "from-red-500 to-red-600" },
  { id: "orange", gradient: "from-orange-500 to-orange-600" },
  { id: "pink", gradient: "from-pink-500 to-pink-600" },
  { id: "teal", gradient: "from-teal-500 to-teal-600" },
  { id: "indigo", gradient: "from-indigo-500 to-indigo-600" },
];

// Computed properties
const customCollections = computed(() =>
  collections.value.filter(
    (c) => !["favorites", "recent", "to-try"].includes(c.id)
  )
);

const favorites = computed(() => {
  const favCollection = collections.value.find((c) => c.id === "favorites");
  return favCollection?.workouts || [];
});

const recentWorkouts = computed(() => {
  const recentCollection = collections.value.find((c) => c.id === "recent");
  return recentCollection?.workouts || [];
});

const toTryWorkouts = computed(() => {
  const toTryCollection = collections.value.find((c) => c.id === "to-try");
  return toTryCollection?.workouts || [];
});

// Methods
function loadCollections() {
  try {
    const saved = localStorage.getItem("workout-collections");
    if (saved) {
      const parsed = JSON.parse(saved);
      collections.value = parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
    } else {
      // Initialize default collections
      collections.value = [
        {
          id: "favorites",
          name: "Favorites",
          description: "Your starred workouts",
          workouts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "recent",
          name: "Recent",
          description: "Recently imported workouts",
          workouts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "to-try",
          name: "To Try",
          description: "Workouts saved for later",
          workouts: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      saveCollections();
    }
  } catch (error) {
    console.error("Failed to load collections:", error);
    collections.value = [];
  }
}

function saveCollections() {
  try {
    localStorage.setItem(
      "workout-collections",
      JSON.stringify(collections.value)
    );
  } catch (error) {
    console.error("Failed to save collections:", error);
  }
}

function viewCollection(collectionId: string) {
  // Emit event to parent to show collection view
  emit("view-collection", collectionId);
}

function editCollection(collection: WorkoutCollection) {
  editingCollection.value = collection;
  collectionForm.name = collection.name;
  collectionForm.description = collection.description || "";
  collectionForm.color = collection.color || "from-purple-500 to-purple-600";
  collectionForm.icon = collection.icon || "star";
  showCreateModal.value = true;
}

function deleteCollection(collection: WorkoutCollection) {
  if (
    confirm(
      `Are you sure you want to delete "${collection.name}"? This action cannot be undone.`
    )
  ) {
    const index = collections.value.findIndex((c) => c.id === collection.id);
    if (index !== -1) {
      collections.value.splice(index, 1);
      saveCollections();
    }
  }
}

function saveCollection() {
  if (!collectionForm.name.trim()) return;

  if (editingCollection.value) {
    // Update existing collection
    const collection = editingCollection.value;
    collection.name = collectionForm.name;
    collection.description = collectionForm.description;
    collection.color = collectionForm.color;
    collection.icon = collectionForm.icon;
    collection.updatedAt = new Date();
  } else {
    // Create new collection
    const newCollection: WorkoutCollection = {
      id: `collection-${Date.now()}`,
      name: collectionForm.name,
      description: collectionForm.description,
      workouts: [],
      color: collectionForm.color,
      icon: collectionForm.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    collections.value.push(newCollection);
  }

  saveCollections();
  closeModal();
}

function closeModal() {
  showCreateModal.value = false;
  editingCollection.value = null;
  collectionForm.name = "";
  collectionForm.description = "";
  collectionForm.color = "from-purple-500 to-purple-600";
  collectionForm.icon = "star";
}

// Emits
const emit = defineEmits<{
  "view-collection": [collectionId: string];
}>();

// Expose methods for parent components
defineExpose({
  addToCollection: (collectionId: string, workoutId: string) => {
    const collection = collections.value.find((c) => c.id === collectionId);
    if (collection && !collection.workouts.includes(workoutId)) {
      collection.workouts.push(workoutId);
      collection.updatedAt = new Date();
      saveCollections();
    }
  },
  removeFromCollection: (collectionId: string, workoutId: string) => {
    const collection = collections.value.find((c) => c.id === collectionId);
    if (collection) {
      const index = collection.workouts.indexOf(workoutId);
      if (index !== -1) {
        collection.workouts.splice(index, 1);
        collection.updatedAt = new Date();
        saveCollections();
      }
    }
  },
});

// Initialize
onMounted(() => {
  loadCollections();
});
</script>
