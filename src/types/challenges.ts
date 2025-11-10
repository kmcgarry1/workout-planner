// types/challenges.ts
// Type definitions for the workout challenges system

export interface WorkoutChallenge {
  id: string;
  name: string;
  description: string;
  type: "streak" | "target" | "competition" | "group";
  category: "strength" | "cardio" | "consistency" | "endurance" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";

  // Challenge configuration
  duration: {
    start: Date;
    end: Date;
    totalDays: number;
  };

  requirements: {
    frequency?: {
      count: number;
      period: "daily" | "weekly" | "total";
    };
    target?: {
      metric: string;
      value: number;
      unit: string;
    };
    constraints?: {
      workoutTypes?: string[];
      minDuration?: number;
      exercises?: string[];
    };
  };

  // Progress and rewards
  progress: ChallengeProgress;
  rewards: ChallengeReward[];
  milestones: ChallengeMilestone[];

  // Social aspects
  isPublic: boolean;
  participants: ChallengeParticipant[];
  createdBy: string;
  maxParticipants?: number;

  // Status
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeProgress {
  userId: string;
  challengeId: string;
  startDate: Date;
  currentValue: number;
  targetValue: number;
  unit: string;

  // Tracking data
  dailyProgress: DailyProgress[];
  streakData: {
    current: number;
    longest: number;
    lastUpdate: Date;
  };

  // Completion status
  isCompleted: boolean;
  completedAt?: Date;
  completionPercentage: number;
}

export interface DailyProgress {
  date: Date;
  value: number;
  workoutsCompleted: string[];
  notes?: string;
  validated: boolean;
}

export interface ChallengeReward {
  id: string;
  type: "badge" | "points" | "title" | "achievement";
  name: string;
  description: string;
  value: number;
  unlockedAt?: Date;

  // Unlock conditions
  requirement: {
    type: "completion" | "milestone" | "streak" | "ranking";
    value: number;
  };
}

export interface ChallengeMilestone {
  id: string;
  name: string;
  description: string;
  targetPercentage: number;
  reward?: ChallengeReward;
  unlockedBy: string[];
  unlockedAt?: Date;
}

export interface ChallengeParticipant {
  userId: string;
  userName: string;
  joinedAt: Date;
  progress: ChallengeProgress;
  rank?: number;
  isActive: boolean;
}

export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  type: WorkoutChallenge["type"];
  category: WorkoutChallenge["category"];
  difficulty: WorkoutChallenge["difficulty"];

  // Template configuration
  defaultDuration: number; // days
  requirements: WorkoutChallenge["requirements"];
  rewards: ChallengeReward[];
  milestones: ChallengeMilestone[];

  // Popularity metrics
  usageCount: number;
  rating: number;
  tags: string[];

  isOfficial: boolean;
  createdAt: Date;
}

export interface ChallengeLeaderboard {
  challengeId: string;
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
  totalParticipants: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  progress: number;
  targetValue: number;
  completionPercentage: number;
  streakDays?: number;
  lastActivity: Date;
  badge?: string;
}

export interface ChallengeNotification {
  id: string;
  type:
    | "milestone_reached"
    | "challenge_completed"
    | "streak_broken"
    | "new_participant"
    | "leaderboard_change";
  challengeId: string;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
