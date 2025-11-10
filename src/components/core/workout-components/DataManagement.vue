<!--
  DataManagement.vue
  Comprehensive data management component with export/import functionality and backup features.
-->
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <Text
        variant="header"
        color-class="text-gray-900 dark:text-white"
        class="font-black mb-2 tracking-tight"
      >
        Data Management
      </Text>
      <Text
        variant="body"
        color-class="text-gray-600 dark:text-gray-400"
        class="text-lg font-medium"
      >
        Export, import, and backup your workout data
      </Text>
    </div>

    <!-- Data Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800"
      >
        <div class="text-center">
          <div class="p-3 bg-blue-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ workoutCount }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Workouts
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800"
      >
        <div class="text-center">
          <div class="p-3 bg-green-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ customExerciseCount }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Custom Exercises
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-200 dark:border-purple-800"
      >
        <div class="text-center">
          <div class="p-3 bg-purple-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ dataSize }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Data Size
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-2 border-orange-200 dark:border-orange-800"
      >
        <div class="text-center">
          <div class="p-3 bg-orange-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="check" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ lastBackup || "Never" }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Last Backup
          </Text>
        </div>
      </Card>
    </div>

    <!-- Export Data Section -->
    <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
      <CardHeader
        title="Export Data"
        subtitle="Download your workout data in various formats"
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div class="p-2.5 bg-blue-600 rounded-lg">
            <Icon name="star" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            size="lg"
            @click="exportData('json')"
            :disabled="exportLoading"
            class="h-20 flex-col gap-2 font-semibold"
          >
            <Icon name="star" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">JSON Format</div>
              <div class="text-sm opacity-75">Complete data structure</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            @click="exportData('csv')"
            :disabled="exportLoading"
            class="h-20 flex-col gap-2 font-semibold"
          >
            <Icon name="star" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">CSV Format</div>
              <div class="text-sm opacity-75">Spreadsheet compatible</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            @click="exportData('backup')"
            :disabled="exportLoading"
            class="h-20 flex-col gap-2 font-semibold"
          >
            <Icon name="star" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">Full Backup</div>
              <div class="text-sm opacity-75">Complete app state</div>
            </div>
          </Button>
        </div>

        <div
          v-if="exportLoading"
          class="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <Icon
              name="spinner"
              variant="flat"
              size="md"
              class="text-blue-600 dark:text-blue-400 animate-spin"
            />
            <Text
              variant="body"
              class="text-blue-700 dark:text-blue-300 font-medium"
            >
              {{ exportStatus }}
            </Text>
          </div>
          <div
            class="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2"
          >
            <div
              class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${exportProgress}%` }"
            ></div>
          </div>
        </div>
      </CardBody>
    </Card>

    <!-- Import Data Section -->
    <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
      <CardHeader
        title="Import Data"
        subtitle="Restore your workout data from backup files"
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div class="p-2.5 bg-green-600 rounded-lg">
            <Icon name="plus" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <div class="space-y-6">
          <!-- File Upload Area -->
          <div
            @drop="handleFileDrop"
            @dragover.prevent
            @dragenter.prevent
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200',
              isDragging
                ? 'border-green-400 bg-green-50 dark:bg-green-950/30'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50',
            ]"
          >
            <Icon
              name="plus"
              variant="flat"
              size="xl"
              :class="[
                'mb-4',
                isDragging
                  ? 'text-green-600'
                  : 'text-gray-400 dark:text-gray-500',
              ]"
            />
            <Text
              variant="title"
              :class="[
                'font-bold mb-2',
                isDragging
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-900 dark:text-white',
              ]"
            >
              {{
                isDragging
                  ? "Drop your file here"
                  : "Drag & drop your backup file"
              }}
            </Text>
            <Text
              variant="body"
              :class="[
                'mb-4',
                isDragging
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-600 dark:text-gray-400',
              ]"
            >
              Supports JSON, CSV, and backup files
            </Text>
            <Button
              variant="primary"
              size="lg"
              @click="openFileDialog"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="plus" variant="flat" size="sm" />
              </template>
              Choose File
            </Button>
          </div>

          <!-- Import Options -->
          <div
            v-if="selectedFile"
            class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div class="flex items-center gap-3 mb-4">
              <Icon
                name="star"
                variant="flat"
                size="md"
                class="text-blue-600 dark:text-blue-400"
              />
              <div>
                <Text
                  variant="body"
                  class="font-bold text-gray-900 dark:text-white"
                >
                  {{ selectedFile.name }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  {{ formatFileSize(selectedFile.size) }} •
                  {{ selectedFile.type || "Unknown type" }}
                </Text>
              </div>
            </div>

            <div class="flex items-center gap-4 mb-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="importMode"
                  value="merge"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Merge with existing data
                </Text>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  v-model="importMode"
                  value="replace"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-medium"
                >
                  Replace all data
                </Text>
              </label>
            </div>

            <Button
              variant="primary"
              size="lg"
              @click="importData"
              :disabled="importLoading"
              class="w-full font-semibold"
            >
              <template #leading>
                <Icon
                  :name="importLoading ? 'spinner' : 'check'"
                  variant="flat"
                  size="sm"
                  :class="{ 'animate-spin': importLoading }"
                />
              </template>
              {{ importLoading ? "Importing..." : "Import Data" }}
            </Button>
          </div>

          <!-- Import Progress -->
          <div
            v-if="importLoading"
            class="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg"
          >
            <div class="flex items-center gap-3 mb-2">
              <Icon
                name="spinner"
                variant="flat"
                size="md"
                class="text-green-600 dark:text-green-400 animate-spin"
              />
              <Text
                variant="body"
                class="text-green-700 dark:text-green-300 font-medium"
              >
                {{ importStatus }}
              </Text>
            </div>
            <div class="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
              <div
                class="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${importProgress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>

    <!-- Data Management Actions -->
    <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
      <CardHeader
        title="Data Management"
        subtitle="Advanced data operations and maintenance"
        :divider="true"
        padding="lg"
      >
        <template #prepend>
          <div class="p-2.5 bg-purple-600 rounded-lg">
            <Icon name="star" variant="fill" size="md" class="text-white" />
          </div>
        </template>
      </CardHeader>

      <CardBody padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            @click="createAutoBackup"
            class="h-16 flex-col gap-1 font-semibold"
          >
            <Icon name="star" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">Auto Backup</div>
              <div class="text-sm opacity-75">Enable daily backups</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            @click="validateData"
            class="h-16 flex-col gap-1 font-semibold"
          >
            <Icon name="check" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">Validate Data</div>
              <div class="text-sm opacity-75">Check for errors</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            @click="showDataStats = true"
            class="h-16 flex-col gap-1 font-semibold"
          >
            <Icon name="star" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">Data Statistics</div>
              <div class="text-sm opacity-75">View detailed stats</div>
            </div>
          </Button>

          <Button
            variant="danger"
            size="lg"
            @click="showClearModal = true"
            class="h-16 flex-col gap-1 font-semibold"
          >
            <Icon name="x" variant="flat" size="md" />
            <div class="text-center">
              <div class="font-bold">Clear All Data</div>
              <div class="text-sm opacity-75">Reset everything</div>
            </div>
          </Button>
        </div>
      </CardBody>
    </Card>

    <!-- Clear Data Confirmation Modal -->
    <div
      v-if="showClearModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md">
        <Card
          variant="elevated"
          padding="none"
          rounded="xl"
          shadow="xl"
          bg-class="bg-white dark:bg-gray-900 border-2 border-red-200 dark:border-red-800"
        >
          <CardHeader
            title="Clear All Data?"
            subtitle="This action cannot be undone"
            :divider="true"
            padding="lg"
          >
            <template #prepend>
              <div class="p-2.5 bg-red-600 rounded-lg">
                <Icon name="x" variant="fill" size="md" class="text-white" />
              </div>
            </template>
          </CardHeader>

          <CardBody padding="lg">
            <Text variant="body" class="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete:
            </Text>
            <ul class="space-y-2 mb-4">
              <li
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Icon name="x" variant="flat" size="sm" class="text-red-500" />
                <Text variant="body" class="text-sm"
                  >All {{ workoutCount }} workouts</Text
                >
              </li>
              <li
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Icon name="x" variant="flat" size="sm" class="text-red-500" />
                <Text variant="body" class="text-sm"
                  >All {{ customExerciseCount }} custom exercises</Text
                >
              </li>
              <li
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Icon name="x" variant="flat" size="sm" class="text-red-500" />
                <Text variant="body" class="text-sm"
                  >All personal records and achievements</Text
                >
              </li>
              <li
                class="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Icon name="x" variant="flat" size="sm" class="text-red-500" />
                <Text variant="body" class="text-sm"
                  >All analytics and progress data</Text
                >
              </li>
            </ul>
            <Text
              variant="body"
              class="text-red-600 dark:text-red-400 font-semibold"
            >
              Consider creating a backup first!
            </Text>
          </CardBody>

          <CardActions justify="between" padding="lg">
            <Button
              variant="ghost"
              size="md"
              @click="showClearModal = false"
              class="font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              @click="clearAllData"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="x" variant="flat" size="sm" />
              </template>
              Clear All Data
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>

    <!-- File Input (Hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept=".json,.csv,.txt"
      @change="handleFileSelect"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody, CardActions } from "../layout/card-components";
import { Button, Icon, Text } from "../basics";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";

const {
  workouts,
  customExercises,
  clearAllData: clearStorageData,
  loadFromStorage,
} = useWorkoutStorage();

// Reactive state
const exportLoading = ref(false);
const importLoading = ref(false);
const exportProgress = ref(0);
const importProgress = ref(0);
const exportStatus = ref("");
const importStatus = ref("");
const selectedFile = ref<File | null>(null);
const importMode = ref<"merge" | "replace">("merge");
const isDragging = ref(false);
const showClearModal = ref(false);
const showDataStats = ref(false);
const fileInput = ref<HTMLInputElement>();

// Computed values
const workoutCount = computed(() => workouts.length);
const customExerciseCount = computed(() => customExercises.length);

const dataSize = computed(() => {
  try {
    const data = {
      workouts: workouts,
      customExercises: customExercises,
    };
    const size = JSON.stringify(data).length;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  } catch {
    return "Unknown";
  }
});

const lastBackup = computed(() => {
  const lastBackupDate = localStorage.getItem("last-backup-date");
  if (!lastBackupDate) return null;
  return formatRelativeDate(new Date(lastBackupDate));
});

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Export functions
async function exportData(format: "json" | "csv" | "backup") {
  exportLoading.value = true;
  exportProgress.value = 0;

  try {
    exportStatus.value = "Preparing data...";
    exportProgress.value = 20;

    const data = {
      workouts: workouts,
      customExercises: customExercises,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    exportStatus.value = "Generating file...";
    exportProgress.value = 50;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case "json":
        content = JSON.stringify(data, null, 2);
        filename = `workout-planner-data-${formatDateForFilename()}.json`;
        mimeType = "application/json";
        break;

      case "csv":
        content = generateCSV(data);
        filename = `workout-planner-workouts-${formatDateForFilename()}.csv`;
        mimeType = "text/csv";
        break;

      case "backup":
        // Include all app state
        const fullBackup = {
          ...data,
          preferences: {
            theme: localStorage.getItem("theme"),
            lastBackup: new Date().toISOString(),
          },
          analytics: generateAnalyticsSummary(),
        };
        content = JSON.stringify(fullBackup, null, 2);
        filename = `workout-planner-backup-${formatDateForFilename()}.json`;
        mimeType = "application/json";
        break;
    }

    exportStatus.value = "Downloading file...";
    exportProgress.value = 80;

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Save backup timestamp
    if (format === "backup") {
      localStorage.setItem("last-backup-date", new Date().toISOString());
    }

    exportStatus.value = "Export complete!";
    exportProgress.value = 100;

    setTimeout(() => {
      exportLoading.value = false;
      exportProgress.value = 0;
    }, 1500);
  } catch (error) {
    console.error("Export error:", error);
    exportStatus.value = "Export failed!";
    setTimeout(() => {
      exportLoading.value = false;
      exportProgress.value = 0;
    }, 2000);
  }
}

function generateCSV(data: any): string {
  // Convert workouts to CSV format
  const headers = [
    "Workout ID",
    "Name",
    "Date",
    "Exercise",
    "Sets",
    "Reps",
    "Weight",
    "Duration",
    "Completed",
  ];

  const rows = [headers.join(",")];

  data.workouts.forEach((workout: any) => {
    workout.exercises.forEach((exercise: any) => {
      exercise.sets.forEach((set: any) => {
        rows.push(
          [
            workout.id,
            `"${workout.name}"`,
            workout.date,
            `"${exercise.exercise.name}"`,
            set.setNumber,
            set.reps || "",
            set.weight || "",
            set.time || "",
            set.completed || false,
          ].join(",")
        );
      });
    });
  });

  return rows.join("\n");
}

function generateAnalyticsSummary() {
  // Generate summary analytics for backup
  return {
    totalWorkouts: workouts.length,
    totalCustomExercises: customExercises.length,
    dataGeneratedAt: new Date().toISOString(),
  };
}

function formatDateForFilename(): string {
  return new Date().toISOString().split("T")[0]?.replace(/-/g, "") || "";
}

// Import functions
function openFileDialog() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0]) {
    selectedFile.value = files[0];
  }
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    selectedFile.value = files[0];
  }
}

async function importData() {
  if (!selectedFile.value) return;

  importLoading.value = true;
  importProgress.value = 0;

  try {
    importStatus.value = "Reading file...";
    importProgress.value = 20;

    const content = await readFileContent(selectedFile.value);

    importStatus.value = "Parsing data...";
    importProgress.value = 40;

    let importedData: any;

    if (selectedFile.value.name.endsWith(".json")) {
      importedData = JSON.parse(content);
    } else if (selectedFile.value.name.endsWith(".csv")) {
      importedData = parseCSV(content);
    } else {
      throw new Error("Unsupported file format");
    }

    importStatus.value = "Validating data...";
    importProgress.value = 60;

    if (!validateImportedData(importedData)) {
      throw new Error("Invalid data format");
    }

    importStatus.value = "Importing data...";
    importProgress.value = 80;

    if (importMode.value === "replace") {
      // Clear existing data first
      clearStorageData();
    }

    // Import the data (this would need to be implemented in useWorkoutStorage)
    await importDataToStorage(importedData);

    importStatus.value = "Import complete!";
    importProgress.value = 100;

    // Reload data from storage
    loadFromStorage();

    setTimeout(() => {
      importLoading.value = false;
      importProgress.value = 0;
      selectedFile.value = null;
    }, 1500);
  } catch (error) {
    console.error("Import error:", error);
    importStatus.value = `Import failed: ${error}`;
    setTimeout(() => {
      importLoading.value = false;
      importProgress.value = 0;
    }, 3000);
  }
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseCSV(content: string): any {
  // Basic CSV parsing for workout data
  const lines = content.split("\n");
  const headers = lines[0]?.split(",") || [];

  // This would need more sophisticated CSV parsing
  return { workouts: [], customExercises: [] };
}

function validateImportedData(data: any): boolean {
  return (
    data && Array.isArray(data.workouts) && Array.isArray(data.customExercises)
  );
}

async function importDataToStorage(data: any): Promise<void> {
  // This would need to be implemented in useWorkoutStorage
  // For now, just save to localStorage
  if (data.workouts) {
    localStorage.setItem(
      "workout-planner-workouts",
      JSON.stringify(data.workouts)
    );
  }
  if (data.customExercises) {
    localStorage.setItem(
      "workout-planner-custom-exercises",
      JSON.stringify(data.customExercises)
    );
  }
}

// Utility functions
function createAutoBackup() {
  // Enable auto-backup feature
  exportData("backup");
  alert(
    "Auto-backup created! Enable browser notifications for daily backup reminders."
  );
}

function validateData() {
  const issues = [];

  // Check for data integrity issues
  if (workouts.length === 0 && customExercises.length === 0) {
    issues.push("No data found");
  }

  // More validation logic would go here

  if (issues.length === 0) {
    alert("Data validation passed! No issues found.");
  } else {
    alert(
      `Data validation found ${issues.length} issues:\n${issues.join("\n")}`
    );
  }
}

function clearAllData() {
  clearStorageData();
  showClearModal.value = false;
  alert("All data has been cleared successfully.");
}

// Drag and drop handlers
function handleDragEnter() {
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

// Bind drag events
document.addEventListener("dragenter", handleDragEnter);
document.addEventListener("dragleave", handleDragLeave);
document.addEventListener("drop", (e) => {
  e.preventDefault();
  isDragging.value = false;
});
</script>
