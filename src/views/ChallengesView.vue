<!--
  ChallengesView.vue
  Main view for the workout challenges system with challenge discovery and progress tracking.
-->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950/20 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center p-4 mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg"
        >
          <Icon name="star" variant="fill" size="xl" class="text-white" />
        </div>
        <Text
          variant="header"
          class="text-gray-900 dark:text-white font-black mb-3 tracking-tight"
        >
          Workout Challenges
        </Text>
        <Text
          variant="body"
          class="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto"
        >
          Push your limits with engaging challenges. Track your progress, earn
          rewards, and compete with the community.
        </Text>

        <!-- Quick Stats -->
        <div class="flex justify-center gap-8 mb-8">
          <div class="text-center">
            <Text
              variant="title"
              class="text-orange-600 dark:text-orange-400 font-black text-2xl mb-1"
            >
              {{ stats.activeChallenges }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Active Challenges
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="title"
              class="text-red-600 dark:text-red-400 font-black text-2xl mb-1"
            >
              {{ stats.currentStreak }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Current Streak
            </Text>
          </div>
          <div class="text-center">
            <Text
              variant="title"
              class="text-purple-600 dark:text-purple-400 font-black text-2xl mb-1"
            >
              {{ stats.badgesEarned }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Badges Earned
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
                  ? 'bg-orange-600 text-white shadow-lg'
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
        <!-- My Challenges Tab -->
        <div v-if="activeTab === 'my-challenges'">
          <!-- Active Challenges -->
          <div v-if="activeChallenges.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  Active Challenges
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  Your ongoing challenges and progress
                </Text>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ChallengeCard
                v-for="challenge in activeChallenges"
                :key="challenge.id"
                :challenge="challenge"
                :progress="getChallengeProgress(challenge.id)"
                :is-participating="true"
                @view-details="viewChallengeDetails"
                @share-challenge="shareChallenge"
              />
            </div>
          </div>

          <!-- Completed Challenges -->
          <div v-if="completedChallenges.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  Completed Challenges
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  Your achievements and earned rewards
                </Text>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ChallengeCard
                v-for="challenge in completedChallenges.slice(0, 6)"
                :key="challenge.id"
                :challenge="challenge"
                :progress="getChallengeProgress(challenge.id)"
                :is-participating="true"
                @view-details="viewChallengeDetails"
                @share-challenge="shareChallenge"
              />
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="
              activeChallenges.length === 0 && completedChallenges.length === 0
            "
            class="text-center py-12"
          >
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
              No challenges yet
            </Text>
            <Text variant="body" class="text-gray-400 dark:text-gray-600 mb-4">
              Join your first challenge to start building healthy habits and
              reaching your fitness goals
            </Text>
            <Button variant="primary" size="lg" @click="activeTab = 'discover'">
              <template #leading>
                <Icon name="plus" variant="fill" size="sm" />
              </template>
              Discover Challenges
            </Button>
          </div>
        </div>

        <!-- Discover Tab -->
        <div v-else-if="activeTab === 'discover'">
          <div class="space-y-8">
            <!-- Recommended Challenges -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <div>
                  <Text
                    variant="title"
                    class="text-gray-900 dark:text-white font-bold mb-1"
                  >
                    Recommended for You
                  </Text>
                  <Text variant="body" class="text-gray-600 dark:text-gray-400">
                    Challenges matched to your fitness level and goals
                  </Text>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ChallengeCard
                  v-for="challenge in recommendedChallenges.slice(0, 6)"
                  :key="challenge.id"
                  :challenge="challenge"
                  :is-participating="isParticipatingInChallenge(challenge.id)"
                  @view-details="viewChallengeDetails"
                  @join-challenge="joinChallenge"
                  @share-challenge="shareChallenge"
                />
              </div>
            </div>

            <!-- Challenge Templates -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <div>
                  <Text
                    variant="title"
                    class="text-gray-900 dark:text-white font-bold mb-1"
                  >
                    Popular Challenge Types
                  </Text>
                  <Text variant="body" class="text-gray-600 dark:text-gray-400">
                    Start a new challenge based on proven templates
                  </Text>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  v-for="template in challengeTemplates"
                  :key="template.id"
                  variant="elevated"
                  padding="lg"
                  rounded="xl"
                  shadow="lg"
                  :bg-class="`bg-gradient-to-br ${getCategoryGradient(
                    template.category
                  )} hover:scale-105 transition-transform duration-200 cursor-pointer`"
                  @click="createFromTemplate(template)"
                >
                  <div class="text-center text-white">
                    <div class="p-3 bg-white/20 rounded-xl mb-3 w-fit mx-auto">
                      <Icon
                        :name="getCategoryIcon(template.category)"
                        variant="fill"
                        size="lg"
                      />
                    </div>
                    <Text variant="body" class="font-bold mb-1">
                      {{ template.name }}
                    </Text>
                    <Text variant="body" class="text-white/80 text-sm mb-2">
                      {{ template.defaultDuration }} days
                    </Text>
                    <Text
                      variant="body"
                      class="text-white/70 text-xs line-clamp-2"
                    >
                      {{ template.description }}
                    </Text>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboards Tab -->
        <div v-else-if="activeTab === 'leaderboards'">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  Challenge Leaderboards
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  See how you rank against other participants
                </Text>
              </div>
            </div>

            <!-- Placeholder for leaderboard implementation -->
            <div class="text-center py-12">
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
                Leaderboards Coming Soon
              </Text>
              <Text variant="body" class="text-gray-400 dark:text-gray-600">
                Compete with friends and the community in upcoming challenges
              </Text>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div v-else-if="activeTab === 'achievements'">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="title"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  Your Achievements
                </Text>
                <Text variant="body" class="text-gray-600 dark:text-gray-400">
                  Badges and rewards you've earned from challenges
                </Text>
              </div>
            </div>

            <!-- Placeholder for achievements implementation -->
            <div class="text-center py-12">
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
                Start earning achievements
              </Text>
              <Text
                variant="body"
                class="text-gray-400 dark:text-gray-600 mb-4"
              >
                Complete challenges to unlock badges and rewards
              </Text>
              <Button
                variant="primary"
                size="lg"
                @click="activeTab = 'discover'"
              >
                <template #leading>
                  <Icon name="star" variant="fill" size="sm" />
                </template>
                Browse Challenges
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card } from "../components/core/layout";
import { Button, Icon, Text } from "../components/core/basics";
import { ChallengeCard } from "../components/core/workout-components";
import { useChallenges } from "../composables/useChallenges";
import type { WorkoutChallenge, ChallengeTemplate } from "../types/challenges";

// Composable
const {
  myChallenges,
  challengeTemplates,
  stats,
  activeChallenges,
  completedChallenges,
  recommendedChallenges,
  loadChallenges,
  createChallenge,
  joinChallenge: joinChallengeComposable,
} = useChallenges();

// Component state
const activeTab = ref("my-challenges");

const tabs = [
  { id: "my-challenges", name: "My Challenges", icon: "star" },
  { id: "discover", name: "Discover", icon: "search" },
  { id: "leaderboards", name: "Leaderboards", icon: "star" },
  { id: "achievements", name: "Achievements", icon: "star" },
];

// Methods
function getChallengeProgress(challengeId: string) {
  // In a real app, this would come from the composable
  const challenge = myChallenges.value.find((c) => c.id === challengeId);
  return challenge?.progress;
}

function isParticipatingInChallenge(challengeId: string): boolean {
  return myChallenges.value.some((c) => c.id === challengeId);
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
  // Using 'star' as placeholder since we only have one icon
  return "star";
}

function viewChallengeDetails(challenge: WorkoutChallenge) {
  // TODO: Navigate to challenge detail view
  console.log("View challenge details:", challenge);
}

async function joinChallenge(challenge: WorkoutChallenge) {
  try {
    const result = joinChallengeComposable(challenge.id);
    if (result.success) {
      console.log("Successfully joined challenge!");
    } else {
      console.error("Failed to join challenge:", result.error);
    }
  } catch (error) {
    console.error("Error joining challenge:", error);
  }
}

function shareChallenge(challenge: WorkoutChallenge) {
  // TODO: Implement challenge sharing
  console.log("Share challenge:", challenge);
}

function createFromTemplate(template: ChallengeTemplate) {
  try {
    const challenge = createChallenge(template);
    console.log("Created challenge from template:", challenge);
    activeTab.value = "my-challenges";
  } catch (error) {
    console.error("Failed to create challenge:", error);
  }
}

// Initialize
onMounted(() => {
  loadChallenges();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
