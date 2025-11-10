<!--
  UserProfile.vue
  Comprehensive user profile component with avatar, stats, achievements, and preferences.
-->
<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
      <div class="relative">
        <!-- Cover Photo Area -->
        <div
          class="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"
        ></div>

        <!-- Profile Info Overlay -->
        <div class="absolute inset-x-0 bottom-0 p-6">
          <div class="flex items-end gap-4">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-lg"
              >
                <img
                  v-if="profile?.avatar"
                  :src="profile.avatar"
                  :alt="profile.displayName"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon
                    name="star"
                    variant="fill"
                    size="xl"
                    class="text-gray-400 dark:text-gray-500"
                  />
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                @click="editAvatar"
                class="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 shadow-lg"
              >
                <Icon name="plus" variant="flat" size="sm" />
              </Button>
            </div>

            <!-- Profile Info -->
            <div class="flex-1 text-white mb-2">
              <Text variant="title" class="text-white font-bold text-xl mb-1">
                {{ profile?.displayName || "Your Name" }}
              </Text>
              <Text variant="body" class="text-white/80 font-medium">
                @{{ profile?.username || "username" }}
              </Text>
              <div class="flex items-center gap-4 mt-2">
                <div class="flex items-center gap-1">
                  <Icon
                    name="star"
                    variant="fill"
                    size="sm"
                    class="text-yellow-300"
                  />
                  <span class="text-sm font-semibold"
                    >Level {{ userStats?.level || 1 }}</span
                  >
                </div>
                <div class="flex items-center gap-1">
                  <Icon
                    name="check"
                    variant="fill"
                    size="sm"
                    class="text-green-300"
                  />
                  <span class="text-sm font-semibold"
                    >{{ userStats?.joinedDays || 0 }} days</span
                  >
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 mb-2">
              <Button
                variant="outline"
                size="md"
                @click="editProfile"
                class="bg-white/10 backdrop-blur text-white border-white/20"
              >
                <template #leading>
                  <Icon name="star" variant="flat" size="sm" />
                </template>
                Edit
              </Button>
              <Button
                variant="outline"
                size="md"
                @click="shareProfile"
                class="bg-white/10 backdrop-blur text-white border-white/20"
              >
                <template #leading>
                  <Icon name="star" variant="flat" size="sm" />
                </template>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Stats -->
      <CardBody padding="lg">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold text-xl mb-1"
            >
              {{ profile?.followers || 0 }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Followers
            </Text>
          </div>
          <div
            class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold text-xl mb-1"
            >
              {{ profile?.following || 0 }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Following
            </Text>
          </div>
          <div
            class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold text-xl mb-1"
            >
              {{ profile?.sharedWorkouts || 0 }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Shared
            </Text>
          </div>
          <div
            class="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold text-xl mb-1"
            >
              {{ userStats?.totalAchievements || 0 }}
            </Text>
            <Text
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm font-medium"
            >
              Achievements
            </Text>
          </div>
        </div>

        <!-- Bio -->
        <div
          v-if="profile?.bio"
          class="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <Text variant="body" class="text-gray-700 dark:text-gray-300">
            {{ profile.bio }}
          </Text>
        </div>
      </CardBody>
    </Card>

    <!-- Fitness Information -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Fitness Profile -->
      <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
        <CardHeader
          title="Fitness Profile"
          subtitle="Your fitness level and goals"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-green-600 rounded-lg">
              <Icon name="star" variant="fill" size="md" class="text-white" />
            </div>
          </template>
          <template #append>
            <Button variant="ghost" size="sm" @click="editFitnessProfile">
              Edit
            </Button>
          </template>
        </CardHeader>
        <CardBody padding="lg">
          <div class="space-y-4">
            <!-- Fitness Level -->
            <div>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-medium mb-2"
              >
                Fitness Level
              </Text>
              <div
                :class="[
                  'inline-flex px-3 py-1.5 rounded-full text-sm font-bold',
                  getFitnessLevelColor(profile?.fitnessLevel || 'Beginner'),
                ]"
              >
                {{ profile?.fitnessLevel || "Beginner" }}
              </div>
            </div>

            <!-- Primary Goals -->
            <div>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-medium mb-2"
              >
                Primary Goals
              </Text>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="goal in profile?.primaryGoals || []"
                  :key="goal"
                  class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                >
                  {{ goal }}
                </div>
                <div
                  v-if="!profile?.primaryGoals?.length"
                  class="text-gray-500 dark:text-gray-500 text-sm"
                >
                  No goals set
                </div>
              </div>
            </div>

            <!-- Preferred Workout Types -->
            <div>
              <Text
                variant="body"
                class="text-gray-600 dark:text-gray-400 font-medium mb-2"
              >
                Preferred Workouts
              </Text>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="type in profile?.preferredWorkoutTypes || []"
                  :key="type"
                  class="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                >
                  {{ type }}
                </div>
                <div
                  v-if="!profile?.preferredWorkoutTypes?.length"
                  class="text-gray-500 dark:text-gray-500 text-sm"
                >
                  No preferences set
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <!-- Recent Achievements -->
      <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
        <CardHeader
          title="Recent Achievements"
          subtitle="Your latest unlocked badges"
          :divider="true"
          padding="lg"
        >
          <template #prepend>
            <div class="p-2.5 bg-yellow-600 rounded-lg">
              <Icon name="star" variant="fill" size="md" class="text-white" />
            </div>
          </template>
          <template #append>
            <Button
              variant="ghost"
              size="sm"
              @click="$router.push('/achievements')"
            >
              View All
            </Button>
          </template>
        </CardHeader>
        <CardBody padding="lg">
          <div v-if="recentAchievements.length === 0" class="text-center py-8">
            <Icon
              name="star"
              variant="flat"
              size="xl"
              class="text-gray-300 dark:text-gray-600 mb-3"
            />
            <Text variant="body" class="text-gray-500 dark:text-gray-500 mb-4">
              No achievements yet
            </Text>
            <Button
              variant="outline"
              size="sm"
              @click="$router.push('/builder')"
            >
              Start Your First Workout
            </Button>
          </div>
          <div v-else class="grid grid-cols-1 gap-3">
            <div
              v-for="achievement in recentAchievements"
              :key="achievement.id"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                  getAchievementColor(achievement.rarity),
                ]"
              >
                <Icon :name="achievement.icon" variant="fill" size="md" />
              </div>
              <div class="flex-1">
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-bold mb-1"
                >
                  {{ achievement.name }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  {{ achievement.description }}
                </Text>
                <Text
                  variant="body"
                  class="text-gray-500 dark:text-gray-500 text-xs mt-1"
                >
                  {{ formatAchievementDate(achievement.unlockedAt) }}
                </Text>
              </div>
              <div
                :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  getAchievementRarityClass(achievement.rarity),
                ]"
              >
                {{ achievement.rarity }}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>

    <!-- Privacy Settings -->
    <Card variant="elevated" padding="none" rounded="xl" shadow="lg">
      <CardHeader
        title="Privacy & Sharing"
        subtitle="Control what others can see"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  Public Profile
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  Allow others to find and view your profile
                </Text>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="localPrivacySettings.isPublic"
                  @change="updatePrivacySettings"
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
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  Show Stats
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  Display workout statistics and progress
                </Text>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="localPrivacySettings.showStats"
                  @change="updatePrivacySettings"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <Text
                  variant="body"
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  Show Workouts
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  Allow others to see your workout history
                </Text>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="localPrivacySettings.showWorkouts"
                  @change="updatePrivacySettings"
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
                  class="text-gray-900 dark:text-white font-semibold"
                >
                  Allow Messages
                </Text>
                <Text
                  variant="body"
                  class="text-gray-600 dark:text-gray-400 text-sm"
                >
                  Let other users send you messages
                </Text>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="localPrivacySettings.allowMessages"
                  @change="updatePrivacySettings"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>

    <!-- Profile Setup Modal (for new users) -->
    <div
      v-if="showSetupModal"
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
            title="Complete Your Profile"
            subtitle="Let's get you set up!"
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
            <div class="space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text
                    variant="body"
                    class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                  >
                    Display Name
                  </Text>
                  <Input
                    v-model="setupForm.displayName"
                    variant="filled"
                    size="md"
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <Text
                    variant="body"
                    class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                  >
                    Username
                  </Text>
                  <Input
                    v-model="setupForm.username"
                    variant="filled"
                    size="md"
                    placeholder="@username"
                  />
                </div>
              </div>

              <!-- Bio -->
              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Bio (Optional)
                </Text>
                <textarea
                  v-model="setupForm.bio"
                  rows="3"
                  placeholder="Tell us about yourself..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- Fitness Level -->
              <div>
                <Text
                  variant="body"
                  class="text-gray-700 dark:text-gray-300 font-semibold mb-2"
                >
                  Fitness Level
                </Text>
                <select
                  v-model="setupForm.fitnessLevel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </CardBody>

          <CardActions justify="between" padding="lg">
            <Button
              variant="ghost"
              size="md"
              @click="skipSetup"
              class="font-semibold"
            >
              Skip for now
            </Button>
            <Button
              variant="primary"
              size="md"
              @click="completeSetup"
              :disabled="!setupForm.displayName || !setupForm.username"
              class="font-semibold"
            >
              <template #leading>
                <Icon name="check" variant="flat" size="sm" />
              </template>
              Complete Setup
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody, CardActions } from "../layout/card-components";
import { Button, Icon, Text, Input } from "../basics";
import { useUserProfile } from "@/composables/useUserProfile";
import type { UserProfile } from "@/types/social";

const {
  currentUser,
  userAchievements,
  userStats,
  createUserProfile,
  updateUserProfile,
  loadUserData,
} = useUserProfile();

// Local reactive state
const showSetupModal = ref(!currentUser.value);
const setupForm = reactive({
  displayName: "",
  username: "",
  bio: "",
  fitnessLevel: "Beginner" as const,
});

const localPrivacySettings = reactive({
  isPublic: true,
  showStats: true,
  showWorkouts: true,
  allowMessages: true,
});

// Load user data on mount
onMounted(() => {
  loadUserData();
  if (currentUser.value) {
    showSetupModal.value = false;
    // Sync privacy settings
    localPrivacySettings.isPublic = currentUser.value.isPublic;
    localPrivacySettings.showStats = currentUser.value.showStats;
    localPrivacySettings.showWorkouts = currentUser.value.showWorkouts;
    localPrivacySettings.allowMessages = currentUser.value.allowMessages;
  }
});

// Computed properties
const profile = computed(() => currentUser.value);

const recentAchievements = computed(() => {
  return userAchievements.value
    .filter((achievement) => achievement.unlockedAt)
    .sort(
      (a, b) =>
        new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
    )
    .slice(0, 3);
});

// Methods
function editProfile() {
  // Open edit profile modal
  console.log("Edit profile");
}

function editAvatar() {
  // Open avatar selection/upload
  console.log("Edit avatar");
}

function shareProfile() {
  // Share profile functionality
  const shareData = {
    title: `${profile.value?.displayName}'s Fitness Profile`,
    text: `Check out my fitness journey on Workout Planner!`,
    url: window.location.origin + `/profile/${profile.value?.id}`,
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(shareData.url);
    alert("Profile link copied to clipboard!");
  }
}

function editFitnessProfile() {
  // Open fitness profile editor
  console.log("Edit fitness profile");
}

function updatePrivacySettings() {
  if (currentUser.value) {
    updateUserProfile({
      isPublic: localPrivacySettings.isPublic,
      showStats: localPrivacySettings.showStats,
      showWorkouts: localPrivacySettings.showWorkouts,
      allowMessages: localPrivacySettings.allowMessages,
    });
  }
}

function completeSetup() {
  const newProfile = createUserProfile({
    displayName: setupForm.displayName,
    username: setupForm.username,
    bio: setupForm.bio,
    fitnessLevel: setupForm.fitnessLevel,
  });

  if (newProfile) {
    showSetupModal.value = false;
    // Sync privacy settings
    localPrivacySettings.isPublic = newProfile.isPublic;
    localPrivacySettings.showStats = newProfile.showStats;
    localPrivacySettings.showWorkouts = newProfile.showWorkouts;
    localPrivacySettings.allowMessages = newProfile.allowMessages;
  }
}

function skipSetup() {
  // Create minimal profile
  const newProfile = createUserProfile({
    displayName: "Fitness Enthusiast",
    username: "user" + Date.now(),
    fitnessLevel: "Beginner",
  });

  if (newProfile) {
    showSetupModal.value = false;
  }
}

// Helper functions
function getFitnessLevelColor(level: string): string {
  switch (level) {
    case "Beginner":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    case "Intermediate":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    case "Advanced":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
    case "Expert":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
  }
}

function getAchievementColor(rarity: string): string {
  switch (rarity) {
    case "Common":
      return "bg-gray-500";
    case "Rare":
      return "bg-blue-500";
    case "Epic":
      return "bg-purple-500";
    case "Legendary":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

function getAchievementRarityClass(rarity: string): string {
  switch (rarity) {
    case "Common":
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    case "Rare":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    case "Epic":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
    case "Legendary":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  }
}

function formatAchievementDate(dateString?: string): string {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}
</script>
