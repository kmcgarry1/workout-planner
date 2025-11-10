/**
 * Social features types for the Workout Planner app
 */

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  bio?: string;
  joinedDate: string; // ISO date string
  isPublic: boolean;

  // Fitness Stats
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  primaryGoals: string[]; // e.g., ['Weight Loss', 'Muscle Gain', 'Strength']
  preferredWorkoutTypes: string[]; // e.g., ['Strength', 'Cardio', 'Flexibility']

  // Social Stats
  followers: number;
  following: number;
  sharedWorkouts: number;

  // Privacy Settings
  showStats: boolean;
  showWorkouts: boolean;
  showAchievements: boolean;
  allowMessages: boolean;
}

export interface SharedWorkout {
  id: string;
  originalWorkoutId: string;
  name: string;
  description: string;
  tags: string[];
  sharedBy: string;
  sharedAt: string; // ISO date string
  isPublic: boolean;
  isTemplate: boolean;
  exercises: any[]; // Using any for now, would be WorkoutExercise[] ideally
  metadata: {
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    estimatedDuration: number;
    targetMuscleGroups: string[];
    equipmentNeeded: string[];
  };
  stats: {
    downloads: number;
    likes: number;
    rating: number;
    totalRatings: number;
  };
  versions: {
    version: number;
    createdAt: string;
    changes: string;
  }[];
}

export interface WorkoutShareSettings {
  title?: string;
  description?: string;
  tags?: string[];
  sharedBy?: string;
  isPublic?: boolean;
  isTemplate?: boolean;
  category?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "Consistency" | "Strength" | "Volume" | "Social" | "Special";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlockedAt?: string; // ISO date string when earned
  progress?: number; // 0-100 for progress-based achievements
  target?: number; // target value for achievement
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "Weekly" | "Monthly" | "Special";
  startDate: string;
  endDate: string;
  goal: {
    type: "workouts" | "exercises" | "time" | "weight" | "streak";
    target: number;
    unit: string; // e.g., 'workouts', 'minutes', 'lbs'
  };
  participants: number;
  reward?: Achievement;
  isActive: boolean;
}

export interface WorkoutBuddy {
  id: string;
  userId: string;
  buddyId: string;
  status: "pending" | "accepted" | "blocked";
  connectionDate: string;
  sharedGoals: string[];
  motivationLevel: 1 | 2 | 3 | 4 | 5; // How much they motivate each other
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  type:
    | "workout_completed"
    | "achievement_earned"
    | "pr_set"
    | "motivation"
    | "challenge_joined";
  content: string;
  attachedWorkout?: string; // workout ID
  attachedAchievement?: string; // achievement ID
  createdAt: string;
  likes: number;
  comments: number;
  isPublic: boolean;
}

export interface NotificationSettings {
  achievements: boolean;
  challenges: boolean;
  buddyRequests: boolean;
  workoutReminders: boolean;
  socialActivity: boolean;
  weeklyProgress: boolean;
}

// Constants for social features
export const FITNESS_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const PRIMARY_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Strength Building",
  "Endurance",
  "General Fitness",
  "Flexibility",
  "Rehabilitation",
  "Competition Prep",
] as const;

export const WORKOUT_TAGS = [
  "Quick",
  "Beginner Friendly",
  "No Equipment",
  "Home Workout",
  "Gym",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core",
  "HIIT",
  "Strength",
  "Cardio",
  "Functional",
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  "Consistency",
  "Strength",
  "Volume",
  "Social",
  "Special",
] as const;

export const ACHIEVEMENT_RARITIES = [
  "Common",
  "Rare",
  "Epic",
  "Legendary",
] as const;
