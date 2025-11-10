/**
 * useUserProfile.ts
 * Composable for managing user profiles and social features
 */

import { ref, computed, reactive, readonly } from "vue";
import type {
  UserProfile,
  Achievement,
  NotificationSettings,
  SharedWorkout,
  WorkoutBuddy,
} from "@/types/social";

const USER_PROFILE_KEY = "workout-planner-user-profile";
const ACHIEVEMENTS_KEY = "workout-planner-achievements";
const NOTIFICATION_SETTINGS_KEY = "workout-planner-notification-settings";

// Reactive state
const currentUser = ref<UserProfile | null>(null);
const userAchievements = ref<Achievement[]>([]);
const notificationSettings = ref<NotificationSettings>({
  achievements: true,
  challenges: true,
  buddyRequests: true,
  workoutReminders: true,
  socialActivity: false,
  weeklyProgress: true,
});

export function useUserProfile() {
  // Load data from localStorage
  function loadUserData() {
    try {
      const profileData = localStorage.getItem(USER_PROFILE_KEY);
      if (profileData) {
        currentUser.value = JSON.parse(profileData);
      }

      const achievementsData = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (achievementsData) {
        userAchievements.value = JSON.parse(achievementsData);
      }

      const settingsData = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settingsData) {
        notificationSettings.value = {
          ...notificationSettings.value,
          ...JSON.parse(settingsData),
        };
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  // Save user profile
  function saveUserProfile(profile: UserProfile) {
    try {
      currentUser.value = profile;
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error("Error saving user profile:", error);
      return false;
    }
  }

  // Create new user profile
  function createUserProfile(data: Partial<UserProfile>): UserProfile {
    const newProfile: UserProfile = {
      id: generateUserId(),
      username: data.username || "",
      displayName: data.displayName || data.username || "",
      email: data.email,
      bio: data.bio || "",
      avatar: data.avatar,
      joinedDate: new Date().toISOString(),
      isPublic: data.isPublic ?? true,
      fitnessLevel: data.fitnessLevel || "Beginner",
      primaryGoals: data.primaryGoals || [],
      preferredWorkoutTypes: data.preferredWorkoutTypes || [],
      followers: 0,
      following: 0,
      sharedWorkouts: 0,
      showStats: data.showStats ?? true,
      showWorkouts: data.showWorkouts ?? true,
      showAchievements: data.showAchievements ?? true,
      allowMessages: data.allowMessages ?? true,
    };

    saveUserProfile(newProfile);
    return newProfile;
  }

  // Update user profile
  function updateUserProfile(updates: Partial<UserProfile>): boolean {
    if (!currentUser.value) return false;

    const updatedProfile = { ...currentUser.value, ...updates };
    return saveUserProfile(updatedProfile);
  }

  // Achievement management
  function unlockAchievement(achievement: Achievement): boolean {
    try {
      // Check if already unlocked
      if (userAchievements.value.some((a) => a.id === achievement.id)) {
        return false;
      }

      // Add achievement with unlock timestamp
      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };

      userAchievements.value.push(unlockedAchievement);
      localStorage.setItem(
        ACHIEVEMENTS_KEY,
        JSON.stringify(userAchievements.value)
      );

      // Show notification if enabled
      if (notificationSettings.value.achievements) {
        showAchievementNotification(unlockedAchievement);
      }

      return true;
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      return false;
    }
  }

  // Check for achievement progress
  function checkAchievements(workoutData: any) {
    const potentialAchievements = generatePotentialAchievements(workoutData);

    potentialAchievements.forEach((achievement) => {
      if (achievement.progress && achievement.progress >= 100) {
        unlockAchievement(achievement);
      }
    });
  }

  // Notification settings
  function updateNotificationSettings(settings: Partial<NotificationSettings>) {
    try {
      notificationSettings.value = {
        ...notificationSettings.value,
        ...settings,
      };
      localStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(notificationSettings.value)
      );
      return true;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      return false;
    }
  }

  // Get user stats for profile display
  const userStats = computed(() => {
    if (!currentUser.value) return null;

    return {
      level: calculateUserLevel(),
      totalAchievements: userAchievements.value.length,
      rareAchievements: userAchievements.value.filter(
        (a) =>
          a.rarity === "Rare" || a.rarity === "Epic" || a.rarity === "Legendary"
      ).length,
      joinedDays: Math.floor(
        (Date.now() - new Date(currentUser.value.joinedDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      socialScore: calculateSocialScore(),
    };
  });

  // Helper functions
  function generateUserId(): string {
    return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  function calculateUserLevel(): number {
    // Calculate level based on achievements and activity
    const achievementPoints = userAchievements.value.reduce(
      (total, achievement) => {
        switch (achievement.rarity) {
          case "Common":
            return total + 10;
          case "Rare":
            return total + 25;
          case "Epic":
            return total + 50;
          case "Legendary":
            return total + 100;
          default:
            return total;
        }
      },
      0
    );

    return Math.floor(achievementPoints / 100) + 1;
  }

  function calculateSocialScore(): number {
    if (!currentUser.value) return 0;

    return Math.min(
      100,
      currentUser.value.followers * 2 +
        currentUser.value.following * 1 +
        currentUser.value.sharedWorkouts * 5
    );
  }

  function generatePotentialAchievements(workoutData: any): Achievement[] {
    // This would analyze workout data and return achievements that could be unlocked
    // For now, return empty array - this would be expanded based on actual workout data
    return [];
  }

  function showAchievementNotification(achievement: Achievement) {
    // This would show a toast/notification for the new achievement
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);

    // In a real app, this could use browser notifications or in-app toasts
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Achievement Unlocked!", {
        body: achievement.name,
        icon: "/favicon.ico",
      });
    }
  }

  // Initialize default achievements
  function initializeDefaultAchievements(): Achievement[] {
    return [
      {
        id: "first_workout",
        name: "Getting Started",
        description: "Complete your first workout",
        icon: "star",
        category: "Special",
        rarity: "Common",
      },
      {
        id: "week_streak",
        name: "Week Warrior",
        description: "Work out 7 days in a row",
        icon: "check",
        category: "Consistency",
        rarity: "Common",
      },
      {
        id: "month_streak",
        name: "Monthly Master",
        description: "Work out for 30 days straight",
        icon: "star",
        category: "Consistency",
        rarity: "Rare",
      },
      {
        id: "first_pr",
        name: "Personal Best",
        description: "Set your first personal record",
        icon: "star",
        category: "Strength",
        rarity: "Common",
      },
      {
        id: "social_sharer",
        name: "Sharing is Caring",
        description: "Share your first workout with the community",
        icon: "star",
        category: "Social",
        rarity: "Common",
      },
    ];
  }

  // Initialize on first use
  if (!currentUser.value) {
    loadUserData();
  }

  return {
    // State
    currentUser: readonly(currentUser),
    userAchievements: readonly(userAchievements),
    notificationSettings: readonly(notificationSettings),
    userStats,

    // Profile methods
    loadUserData,
    createUserProfile,
    updateUserProfile,
    saveUserProfile,

    // Achievement methods
    unlockAchievement,
    checkAchievements,

    // Settings methods
    updateNotificationSettings,

    // Utility methods
    initializeDefaultAchievements,
  };
}
