<!--
  PersonalRecords.vue
  Component to track and display personal records (PRs) for exercises with achievements and goal setting.
-->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <Text
          variant="header"
          color-class="text-gray-900 dark:text-white"
          class="font-black mb-2 tracking-tight"
        >
          Personal Records
        </Text>
        <Text
          variant="body"
          color-class="text-gray-600 dark:text-gray-400"
          class="text-lg font-medium"
        >
          Track your strength gains and achievements
        </Text>
      </div>
      <Button
        variant="primary"
        size="lg"
        @click="showGoalModal = true"
        class="font-bold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Set Goal
      </Button>
    </div>

    <!-- PR Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            {{ personalRecords.length }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Total PRs
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
            <Icon name="check" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ recentPRs.length }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            This Month
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/40 dark:to-orange-950/40 border-2 border-yellow-200 dark:border-yellow-800"
      >
        <div class="text-center">
          <div class="p-3 bg-yellow-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="star" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ topPR ? `${topPR.weight}` : "0" }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Max Weight (lbs)
          </Text>
        </div>
      </Card>

      <Card
        variant="elevated"
        padding="lg"
        rounded="xl"
        shadow="lg"
        bg-class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800"
      >
        <div class="text-center">
          <div class="p-3 bg-blue-600 rounded-xl mb-3 w-fit mx-auto">
            <Icon name="spinner" variant="fill" size="lg" class="text-white" />
          </div>
          <Text
            variant="title"
            class="text-gray-900 dark:text-white font-bold text-2xl"
          >
            {{ goalsAchieved }}
          </Text>
          <Text
            variant="body"
            class="text-gray-600 dark:text-gray-400 font-medium"
          >
            Goals Achieved
          </Text>
        </div>
      </Card>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-wrap gap-4 items-center">
      <Input
        v-model="searchQuery"
        variant="filled"
        size="md"
        placeholder="Search exercises..."
        clearable
        class="min-w-[250px]"
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

      <select
        v-model="sortBy"
        class="px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
      >
        <option value="date">Sort by Date</option>
        <option value="weight">Sort by Weight</option>
        <option value="exercise">Sort by Exercise</option>
        <option value="improvement">Sort by Improvement</option>
      </select>

      <Button
        :variant="showGoalsOnly ? 'primary' : 'ghost'"
        size="md"
        @click="showGoalsOnly = !showGoalsOnly"
        class="font-semibold"
      >
        <template #leading>
          <Icon name="star" variant="fill" size="sm" />
        </template>
        {{ showGoalsOnly ? "All PRs" : "Goals Only" }}
      </Button>
    </div>

    <!-- Personal Records Grid -->
    <div v-if="filteredRecords.length === 0" class="text-center py-16">
      <div class="mb-6 flex justify-center">
        <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl">
          <Icon
            name="star"
            variant="flat"
            size="xl"
            class="text-gray-300 dark:text-gray-600"
          />
        </div>
      </div>
      <Text
        variant="title"
        class="text-gray-600 dark:text-gray-400 font-bold mb-3"
      >
        {{
          personalRecords.length === 0 ? "No records yet" : "No matches found"
        }}
      </Text>
      <Text
        variant="body"
        class="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto"
      >
        {{
          personalRecords.length === 0
            ? "Complete some strength workouts to start tracking your personal records!"
            : "Try adjusting your search or filter criteria"
        }}
      </Text>
      <Button
        v-if="personalRecords.length === 0"
        variant="primary"
        size="lg"
        @click="$router.push('/builder')"
        class="font-bold"
      >
        <template #leading>
          <Icon name="plus" variant="flat" size="sm" />
        </template>
        Start First Workout
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card
        v-for="record in filteredRecords"
        :key="`${record.exercise}-${record.date}`"
        variant="elevated"
        padding="none"
        rounded="xl"
        shadow="lg"
        :bg-class="getRecordCardBackground(record)"
        class="transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      >
        <CardHeader
          :title="record.exercise"
          :subtitle="formatRecordSubtitle(record)"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div
              :class="[
                'p-2.5 rounded-lg relative',
                getRecordIconBackground(record),
              ]"
            >
              <Icon name="star" variant="fill" size="md" class="text-white" />
              <!-- Achievement badge for new PRs -->
              <div
                v-if="isRecentPR(record)"
                class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-900"
              ></div>
            </div>
          </template>

          <template #append>
            <div class="text-right">
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-bold text-lg"
              >
                {{ record.weight }} lbs
              </Text>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 text-sm"
              >
                {{ record.reps }} reps
              </Text>
            </div>
          </template>
        </CardHeader>

        <CardBody padding="lg" class="bg-white/50 dark:bg-gray-900/50">
          <div class="space-y-3">
            <!-- One Rep Max -->
            <div class="flex justify-between items-center">
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-medium"
              >
                Estimated 1RM:
              </Text>
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-bold"
              >
                {{ calculateOneRepMax(record.weight, record.reps) }} lbs
              </Text>
            </div>

            <!-- Date achieved -->
            <div class="flex justify-between items-center">
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-medium"
              >
                Achieved:
              </Text>
              <Text
                variant="body"
                class="text-gray-900 dark:text-white font-semibold"
              >
                {{ formatDate(record.date) }}
              </Text>
            </div>

            <!-- Goal progress (if goal exists) -->
            <div v-if="getGoalForExercise(record.exercise)" class="space-y-2">
              <div class="flex justify-between items-center">
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 font-medium"
                >
                  Goal Progress:
                </Text>
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  {{
                    Math.round(
                      (calculateOneRepMax(record.weight, record.reps) /
                        getGoalForExercise(record.exercise)?.targetWeight ||
                        1) * 100
                    )
                  }}%
                </Text>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all duration-300',
                    getGoalProgress(record) >= 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600',
                  ]"
                  :style="{
                    width: `${Math.min(100, getGoalProgress(record))}%`,
                  }"
                ></div>
              </div>
              <Text
                variant="body"
                :class="[
                  'text-xs font-medium',
                  getGoalProgress(record) >= 100
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 dark:text-blue-400',
                ]"
              >
                {{
                  getGoalProgress(record) >= 100
                    ? "🎉 Goal Achieved!"
                    : `Target: ${
                        getGoalForExercise(record.exercise)?.targetWeight
                      } lbs`
                }}
              </Text>
            </div>

            <!-- Previous record comparison -->
            <div
              v-if="getPreviousRecord(record)"
              class="pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <div class="flex justify-between items-center">
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 font-medium text-sm"
                >
                  Previous PR:
                </Text>
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold text-sm"
                >
                  {{ getPreviousRecord(record)?.weight }} lbs ×
                  {{ getPreviousRecord(record)?.reps }}
                </Text>
              </div>
              <Text
                variant="body"
                class="text-green-600 dark:text-green-400 font-bold text-sm mt-1"
              >
                +{{
                  record.weight - (getPreviousRecord(record)?.weight || 0)
                }}
                lbs improvement!
              </Text>
            </div>
          </div>
        </CardBody>

        <CardActions
          justify="between"
          padding="lg"
          class="bg-gray-50 dark:bg-gray-800/50"
        >
          <Button
            variant="ghost"
            size="sm"
            @click="setGoalForExercise(record.exercise)"
            class="font-semibold"
          >
            <template #leading>
              <Icon name="plus" variant="flat" size="sm" />
            </template>
            Set Goal
          </Button>
          <Button
            variant="primary"
            size="sm"
            @click="shareRecord(record)"
            class="font-semibold"
          >
            <template #leading>
              <Icon name="star" variant="flat" size="sm" />
            </template>
            Share
          </Button>
        </CardActions>
      </Card>
    </div>

    <!-- Goal Setting Modal -->
    <div
      v-if="showGoalModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md">
        <Card
          variant="elevated"
          padding="none"
          rounded="xl"
          shadow="xl"
          bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
        >
          <CardHeader
            title="Set New Goal"
            subtitle="Choose an exercise and target weight"
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
            <div class="space-y-4">
              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Exercise
                </Text>
                <select
                  v-model="goalForm.exercise"
                  class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select an exercise</option>
                  <option
                    v-for="exercise in availableExercises"
                    :key="exercise"
                    :value="exercise"
                  >
                    {{ exercise }}
                  </option>
                </select>
              </div>

              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Target Weight (lbs)
                </Text>
                <Input
                  v-model.number="goalForm.targetWeight"
                  variant="filled"
                  size="md"
                  type="number"
                  placeholder="Enter target weight"
                  min="1"
                />
              </div>

              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Target Date (optional)
                </Text>
                <Input
                  v-model="goalForm.targetDate"
                  variant="filled"
                  size="md"
                  type="date"
                />
              </div>
            </div>
          </CardBody>

          <CardActions justify="between" padding="lg">
            <Button
              variant="ghost"
              size="md"
              @click="closeGoalModal"
              class="font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              @click="saveGoal"
              :disabled="!goalForm.exercise || !goalForm.targetWeight"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="check" variant="flat" size="sm" />
              </template>
              Save Goal
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody, CardActions } from "../layout/card-components";
import { Button, Icon, Text, Input } from "../basics";
import { useWorkoutStorage } from "@/composables/useWorkoutStorage";
import { useWorkoutAnalytics } from "@/composables/useWorkoutAnalytics";
import { useRouter } from "vue-router";
import type { PersonalRecord, Goal } from "@/types/workout";

const { workouts, loadFromStorage } = useWorkoutStorage();
const { personalRecords } = useWorkoutAnalytics(workouts);
const router = useRouter();

// Load data on mount
loadFromStorage();

const searchQuery = ref("");
const sortBy = ref<"date" | "weight" | "exercise" | "improvement">("date");
const showGoalsOnly = ref(false);
const showGoalModal = ref(false);

// Mock goals storage (would be in real composable)
const goals = ref<Goal[]>([
  { exercise: "Bench Press", targetWeight: 225, targetDate: "2025-12-31" },
  { exercise: "Squat", targetWeight: 315, targetDate: "2025-12-31" },
]);

const goalForm = ref({
  exercise: "",
  targetWeight: 0,
  targetDate: "",
});

// Computed values
const recentPRs = computed(() => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return personalRecords.value.filter(
    (pr) => new Date(pr.date) >= thirtyDaysAgo
  );
});

const topPR = computed(() => {
  if (personalRecords.value.length === 0) return null;
  return personalRecords.value.reduce((max, current) =>
    current.weight > max.weight ? current : max
  );
});

const goalsAchieved = computed(() => {
  return goals.value.filter((goal) => {
    const record = personalRecords.value.find(
      (pr) => pr.exercise === goal.exercise
    );
    if (!record) return false;
    const oneRepMax = calculateOneRepMax(record.weight, record.reps);
    return oneRepMax >= goal.targetWeight;
  }).length;
});

const availableExercises = computed(() => {
  const exercises = new Set(personalRecords.value.map((pr) => pr.exercise));
  // Add common exercises even if no PRs exist yet
  const commonExercises = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Overhead Press",
    "Pull-ups",
  ];
  commonExercises.forEach((ex) => exercises.add(ex));
  return Array.from(exercises).sort();
});

const filteredRecords = computed(() => {
  let result = [...personalRecords.value];

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((record) =>
      record.exercise.toLowerCase().includes(query)
    );
  }

  // Goals filter
  if (showGoalsOnly.value) {
    result = result.filter((record) =>
      goals.value.some((goal) => goal.exercise === record.exercise)
    );
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "weight":
        return b.weight - a.weight;
      case "exercise":
        return a.exercise.localeCompare(b.exercise);
      case "improvement":
        const aImprovement = getImprovementScore(a);
        const bImprovement = getImprovementScore(b);
        return bImprovement - aImprovement;
      default:
        return 0;
    }
  });

  return result;
});

// Helper functions
function calculateOneRepMax(weight: number, reps: number): number {
  // Epley formula: 1RM = weight × (1 + reps/30)
  return Math.round(weight * (1 + reps / 30));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString();
}

function formatRecordSubtitle(record: PersonalRecord): string {
  const oneRepMax = calculateOneRepMax(record.weight, record.reps);
  return `${oneRepMax} lbs 1RM • ${formatDate(record.date)}`;
}

function getRecordCardBackground(record: PersonalRecord): string {
  const goal = getGoalForExercise(record.exercise);
  if (goal && getGoalProgress(record) >= 100) {
    return "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800";
  }
  if (isRecentPR(record)) {
    return "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-200 dark:border-yellow-800";
  }
  return "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800";
}

function getRecordIconBackground(record: PersonalRecord): string {
  const goal = getGoalForExercise(record.exercise);
  if (goal && getGoalProgress(record) >= 100) {
    return "bg-green-600 dark:bg-green-500";
  }
  if (isRecentPR(record)) {
    return "bg-yellow-600 dark:bg-yellow-500";
  }
  return "bg-purple-600 dark:bg-purple-500";
}

function isRecentPR(record: PersonalRecord): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(record.date) >= sevenDaysAgo;
}

function getGoalForExercise(exercise: string) {
  return goals.value.find((goal) => goal.exercise === exercise);
}

function getGoalProgress(record: PersonalRecord): number {
  const goal = getGoalForExercise(record.exercise);
  if (!goal) return 0;
  const oneRepMax = calculateOneRepMax(record.weight, record.reps);
  return Math.round((oneRepMax / goal.targetWeight) * 100);
}

function getPreviousRecord(record: PersonalRecord) {
  // Find previous record for the same exercise
  const exerciseRecords = personalRecords.value
    .filter((pr) => pr.exercise === record.exercise)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const currentIndex = exerciseRecords.findIndex(
    (pr) =>
      pr.weight === record.weight &&
      pr.reps === record.reps &&
      pr.date === record.date
  );

  return currentIndex > 0 ? exerciseRecords[currentIndex - 1] : null;
}

function getImprovementScore(record: PersonalRecord): number {
  const previous = getPreviousRecord(record);
  if (!previous) return 0;
  return record.weight - previous.weight;
}

function setGoalForExercise(exercise: string) {
  goalForm.value.exercise = exercise;
  goalForm.value.targetWeight = 0;
  goalForm.value.targetDate = "";
  showGoalModal.value = true;
}

function closeGoalModal() {
  showGoalModal.value = false;
  goalForm.value = { exercise: "", targetWeight: 0, targetDate: "" };
}

function saveGoal() {
  if (goalForm.value.exercise && goalForm.value.targetWeight) {
    // Remove existing goal for this exercise
    goals.value = goals.value.filter(
      (g) => g.exercise !== goalForm.value.exercise
    );

    // Add new goal
    goals.value.push({
      exercise: goalForm.value.exercise,
      targetWeight: goalForm.value.targetWeight,
      targetDate: goalForm.value.targetDate || undefined,
    });

    // In a real app, this would save to localStorage or backend
    closeGoalModal();
  }
}

function shareRecord(record: PersonalRecord) {
  const oneRepMax = calculateOneRepMax(record.weight, record.reps);
  const text = `🏋️‍♀️ New PR! ${record.exercise}: ${record.weight} lbs × ${record.reps} reps (${oneRepMax} lbs 1RM)`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(text);
    alert("PR copied to clipboard!");
  }
}
</script>
