<!--
  ChallengeCard.vue
  Card component for displaying workout challenges with progress tracking.
-->
<template>
  <Card
    variant="elevated"
    padding="none"
    rounded="xl"
    shadow="lg"
    :bg-class="bgClass"
    class="overflow-hidden transition-all duration-200 hover:shadow-xl"
  >
    <!-- Header with challenge type -->
    <div class="relative">
      <!-- Status Badge -->
      <div class="absolute top-3 right-3 z-10">
        <div
          :class="[
            'px-3 py-1 rounded-full text-white text-xs font-bold',
            getStatusColor(challenge.status),
          ]"
        >
          {{ getStatusText(challenge.status) }}
        </div>
      </div>

      <!-- Difficulty Badge -->
      <div class="absolute top-3 left-3 z-10">
        <div
          :class="[
            'px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm',
            getDifficultyColor(challenge.difficulty),
          ]"
        >
          {{ challenge.difficulty }}
        </div>
      </div>

      <!-- Challenge Type Header -->
      <div
        :class="[
          'h-32 flex items-center justify-center bg-gradient-to-br',
          getCategoryGradient(challenge.category),
        ]"
      >
        <div class="text-center text-white">
          <Icon
            :name="getCategoryIcon(challenge.category)"
            variant="fill"
            size="xl"
            class="mb-2"
          />
          <Text
            variant="body"
            class="font-semibold text-sm uppercase tracking-wider"
          >
            {{ challenge.category }}
          </Text>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title and Duration -->
      <div class="mb-4">
        <Text
          variant="title"
          class="text-gray-900 dark:text-white font-bold mb-2 line-clamp-2"
        >
          {{ challenge.name }}
        </Text>
        <Text
          variant="body"
          class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3"
        >
          {{ challenge.description }}
        </Text>

        <div
          class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4"
        >
          <div class="flex items-center gap-1">
            <Icon name="star" variant="flat" size="xs" />
            <span>{{ challenge.duration.totalDays }} days</span>
          </div>
          <div
            v-if="challenge.status === 'active'"
            class="flex items-center gap-1"
          >
            <Icon name="star" variant="flat" size="xs" />
            <span>{{ daysRemaining }} days left</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="star" variant="flat" size="xs" />
            <span>{{ challenge.participants.length }} participants</span>
          </div>
        </div>
      </div>

      <!-- Progress Section (for active challenges) -->
      <div v-if="progress && challenge.status === 'active'" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <Text
            variant="body"
            class="text-gray-700 dark:text-gray-300 font-medium"
          >
            Progress
          </Text>
          <Text variant="body" class="text-gray-600 dark:text-gray-400 text-sm">
            {{ Math.round(progress.completionPercentage) }}%
          </Text>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <div
            :class="[
              'h-3 rounded-full transition-all duration-500',
              getProgressColor(progress.completionPercentage),
            ]"
            :style="{
              width: `${Math.min(100, progress.completionPercentage)}%`,
            }"
          ></div>
        </div>

        <!-- Progress Stats -->
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="text-center">
            <Text
              variant="body"
              class="text-gray-900 dark:text-white font-bold text-lg"
            >
              {{ progress.currentValue }}
            </Text>
            <Text
              variant="body"
              class="text-gray-500 dark:text-gray-500 text-xs"
            >
              / {{ progress.targetValue }}
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="body"
              class="text-gray-900 dark:text-white font-bold text-lg"
            >
              {{ progress.streakData.current }}
            </Text>
            <Text
              variant="body"
              class="text-gray-500 dark:text-gray-500 text-xs"
            >
              Current Streak
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="body"
              class="text-gray-900 dark:text-white font-bold text-lg"
            >
              {{ progress.streakData.longest }}
            </Text>
            <Text
              variant="body"
              class="text-gray-500 dark:text-gray-500 text-xs"
            >
              Best Streak
            </Text>
          </div>
        </div>
      </div>

      <!-- Completion Stats (for completed challenges) -->
      <div v-if="challenge.status === 'completed'" class="mb-4">
        <div class="flex items-center justify-center mb-3">
          <div class="p-3 bg-green-500 rounded-full">
            <Icon name="check" variant="fill" size="lg" class="text-white" />
          </div>
        </div>
        <Text
          variant="body"
          class="text-center text-green-600 dark:text-green-400 font-semibold"
        >
          Challenge Completed!
        </Text>
        <Text
          variant="body"
          class="text-center text-gray-600 dark:text-gray-400 text-sm mt-1"
        >
          {{ formatDate(progress?.completedAt) }}
        </Text>
      </div>

      <!-- Rewards Section -->
      <div v-if="availableRewards.length > 0" class="mb-4">
        <Text
          variant="body"
          class="text-gray-700 dark:text-gray-300 font-medium mb-2"
        >
          Rewards
        </Text>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="reward in availableRewards"
            :key="reward.id"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
              reward.unlockedAt
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            ]"
          >
            <Icon
              :name="reward.unlockedAt ? 'star' : 'star'"
              :variant="reward.unlockedAt ? 'fill' : 'flat'"
              size="xs"
            />
            {{ reward.name }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <Button
          v-if="challenge.status === 'active'"
          variant="primary"
          size="md"
          @click="handleViewDetails"
          class="flex-1 font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="fill" size="sm" />
          </template>
          View Progress
        </Button>

        <Button
          v-else-if="!isParticipating"
          variant="primary"
          size="md"
          @click="handleJoin"
          class="flex-1 font-semibold"
          :disabled="joiningChallenge"
        >
          <template #leading>
            <Icon
              :name="joiningChallenge ? 'spinner' : 'plus'"
              :variant="joiningChallenge ? 'flat' : 'fill'"
              size="sm"
              :class="joiningChallenge ? 'animate-spin' : ''"
            />
          </template>
          {{ joiningChallenge ? "Joining..." : "Join Challenge" }}
        </Button>

        <Button
          v-else
          variant="outline"
          size="md"
          @click="handleViewDetails"
          class="flex-1 font-semibold"
        >
          <template #leading>
            <Icon name="star" variant="flat" size="sm" />
          </template>
          View Details
        </Button>

        <Button variant="ghost" size="md" @click="handleShare" class="px-3">
          <Icon name="star" variant="flat" size="sm" />
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Card } from "../layout";
import { Button, Icon, Text } from "../basics";
import type {
  WorkoutChallenge,
  ChallengeProgress,
} from "../../../types/challenges";

// Props
interface Props {
  challenge: WorkoutChallenge;
  progress?: ChallengeProgress;
  bgClass?: string;
  isParticipating?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  bgClass:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
  isParticipating: false,
});

// Emits
const emit = defineEmits<{
  "view-details": [challenge: WorkoutChallenge];
  "join-challenge": [challenge: WorkoutChallenge];
  "share-challenge": [challenge: WorkoutChallenge];
}>();

// Component state
const joiningChallenge = ref(false);

// Computed properties
const daysRemaining = computed(() => {
  if (props.challenge.status !== "active") return 0;
  const now = new Date();
  const end = new Date(props.challenge.duration.end);
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
});

const availableRewards = computed(() => {
  return props.challenge.rewards.slice(0, 3); // Show first 3 rewards
});

// Methods
function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/80";
    case "completed":
      return "bg-blue-500/80";
    case "cancelled":
      return "bg-red-500/80";
    default:
      return "bg-gray-500/80";
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "draft":
      return "Draft";
    default:
      return "Unknown";
  }
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
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

function getCategoryGradient(category: string): string {
  switch (category.toLowerCase()) {
    case "strength":
      return "from-red-500 to-red-600";
    case "cardio":
      return "from-blue-500 to-blue-600";
    case "consistency":
      return "from-green-500 to-green-600";
    case "endurance":
      return "from-orange-500 to-orange-600";
    case "mixed":
    default:
      return "from-purple-500 to-purple-600";
  }
}

function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case "strength":
      return "star";
    case "cardio":
      return "star";
    case "consistency":
      return "star";
    case "endurance":
      return "star";
    default:
      return "star";
  }
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 75) return "bg-blue-500";
  if (percentage >= 50) return "bg-yellow-500";
  if (percentage >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function formatDate(date?: Date): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function handleJoin() {
  if (joiningChallenge.value) return;

  joiningChallenge.value = true;
  try {
    emit("join-challenge", props.challenge);
  } finally {
    joiningChallenge.value = false;
  }
}

function handleViewDetails() {
  emit("view-details", props.challenge);
}

function handleShare() {
  emit("share-challenge", props.challenge);
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
