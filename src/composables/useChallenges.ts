// composables/useChallenges.ts
// Composable for managing workout challenges

import { ref, computed, reactive } from "vue";
import type {
  WorkoutChallenge,
  ChallengeProgress,
  ChallengeTemplate,
  ChallengeLeaderboard,
  ChallengeParticipant,
  DailyProgress,
  ChallengeNotification,
} from "../types/challenges";
import type { Workout } from "../types/workout";

export function useChallenges() {
  // State
  const challenges = ref<WorkoutChallenge[]>([]);
  const myChallenges = ref<WorkoutChallenge[]>([]);
  const availableChallenges = ref<WorkoutChallenge[]>([]);
  const challengeTemplates = ref<ChallengeTemplate[]>([]);
  const leaderboards = ref<Map<string, ChallengeLeaderboard>>(new Map());
  const notifications = ref<ChallengeNotification[]>([]);

  // Current user state
  const currentUserId = ref("user-123"); // Would come from auth
  const myProgress = ref<Map<string, ChallengeProgress>>(new Map());

  const stats = reactive({
    totalChallenges: 0,
    activeChallenges: 0,
    completedChallenges: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    badgesEarned: 0,
  });

  // Computed properties
  const activeChallenges = computed(() =>
    myChallenges.value.filter(
      (challenge) =>
        challenge.status === "active" && new Date() <= challenge.duration.end
    )
  );

  const completedChallenges = computed(() =>
    myChallenges.value.filter((challenge) => challenge.status === "completed")
  );

  const upcomingDeadlines = computed(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    return activeChallenges.value
      .filter((challenge) => challenge.duration.end <= threeDaysFromNow)
      .sort((a, b) => a.duration.end.getTime() - b.duration.end.getTime());
  });

  const recommendedChallenges = computed(() => {
    // Simple recommendation based on completed challenges and difficulty
    const userLevel = getUserLevel();
    return availableChallenges.value
      .filter(
        (challenge) =>
          challenge.difficulty === userLevel ||
          (userLevel === "advanced" && challenge.difficulty === "intermediate")
      )
      .slice(0, 6);
  });

  // Core challenge management
  function loadChallenges() {
    try {
      const saved = localStorage.getItem("workout-challenges");
      if (saved) {
        const parsed = JSON.parse(saved);
        challenges.value = parsed.map((challenge: any) => ({
          ...challenge,
          duration: {
            ...challenge.duration,
            start: new Date(challenge.duration.start),
            end: new Date(challenge.duration.end),
          },
          createdAt: new Date(challenge.createdAt),
          updatedAt: new Date(challenge.updatedAt),
        }));

        // Separate user's challenges
        myChallenges.value = challenges.value.filter((c) =>
          c.participants.some((p) => p.userId === currentUserId.value)
        );
      }

      // Load templates and available challenges
      loadChallengeTemplates();
      loadAvailableChallenges();

      // Load progress data
      loadUserProgress();
      updateStats();
    } catch (error) {
      console.error("Failed to load challenges:", error);
    }
  }

  function saveChallenges() {
    try {
      localStorage.setItem(
        "workout-challenges",
        JSON.stringify(challenges.value)
      );
    } catch (error) {
      console.error("Failed to save challenges:", error);
    }
  }

  function createChallenge(
    template: ChallengeTemplate,
    customization: {
      startDate?: Date;
      duration?: number;
      isPublic?: boolean;
    } = {}
  ): WorkoutChallenge {
    const now = new Date();
    const startDate = customization.startDate || now;
    const durationDays = customization.duration || template.defaultDuration;
    const endDate = new Date(
      startDate.getTime() + durationDays * 24 * 60 * 60 * 1000
    );

    const challenge: WorkoutChallenge = {
      id: `challenge-${Date.now()}`,
      name: template.name,
      description: template.description,
      type: template.type,
      category: template.category,
      difficulty: template.difficulty,

      duration: {
        start: startDate,
        end: endDate,
        totalDays: durationDays,
      },

      requirements: template.requirements,
      rewards: template.rewards,
      milestones: template.milestones,

      progress: {
        userId: currentUserId.value,
        challengeId: "",
        startDate,
        currentValue: 0,
        targetValue:
          template.requirements.target?.value ||
          template.requirements.frequency?.count ||
          durationDays,
        unit: template.requirements.target?.unit || "workouts",
        dailyProgress: [],
        streakData: {
          current: 0,
          longest: 0,
          lastUpdate: startDate,
        },
        isCompleted: false,
        completionPercentage: 0,
      },

      isPublic: customization.isPublic ?? false,
      participants: [
        {
          userId: currentUserId.value,
          userName: "Current User", // Would come from user profile
          joinedAt: now,
          progress: {} as ChallengeProgress, // Will be set below
          isActive: true,
        },
      ],
      createdBy: currentUserId.value || "anonymous",

      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    // Set the challenge ID in progress
    challenge.progress.challengeId = challenge.id;
    challenge.participants[0].progress = challenge.progress;

    challenges.value.push(challenge);
    myChallenges.value.push(challenge);
    saveChallenges();
    updateStats();

    return challenge;
  }

  function joinChallenge(challengeId: string): {
    success: boolean;
    error?: string;
  } {
    try {
      const challenge = availableChallenges.value.find(
        (c) => c.id === challengeId
      );
      if (!challenge) {
        return { success: false, error: "Challenge not found" };
      }

      if (
        challenge.maxParticipants &&
        challenge.participants.length >= challenge.maxParticipants
      ) {
        return { success: false, error: "Challenge is full" };
      }

      if (
        challenge.participants.some((p) => p.userId === currentUserId.value)
      ) {
        return {
          success: false,
          error: "Already participating in this challenge",
        };
      }

      // Add user as participant
      const participant: ChallengeParticipant = {
        userId: currentUserId.value,
        userName: "Current User",
        joinedAt: new Date(),
        progress: {
          userId: currentUserId.value,
          challengeId,
          startDate: new Date(),
          currentValue: 0,
          targetValue:
            challenge.requirements.target?.value ||
            challenge.requirements.frequency?.count ||
            challenge.duration.totalDays,
          unit: challenge.requirements.target?.unit || "workouts",
          dailyProgress: [],
          streakData: {
            current: 0,
            longest: 0,
            lastUpdate: new Date(),
          },
          isCompleted: false,
          completionPercentage: 0,
        },
        isActive: true,
      };

      challenge.participants.push(participant);
      myChallenges.value.push(challenge);

      saveChallenges();
      updateStats();

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to join challenge" };
    }
  }

  // Progress tracking
  function recordWorkout(workoutId: string, workout: Workout) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    activeChallenges.value.forEach((challenge) => {
      const progress = myProgress.value.get(challenge.id) || challenge.progress;

      // Check if workout meets challenge requirements
      const meetsRequirements = checkWorkoutRequirements(workout, challenge);
      if (!meetsRequirements) return;

      // Update daily progress
      let dailyEntry = progress.dailyProgress.find(
        (dp) => dp.date.getTime() === today.getTime()
      );

      if (!dailyEntry) {
        dailyEntry = {
          date: today,
          value: 0,
          workoutsCompleted: [],
          validated: true,
        };
        progress.dailyProgress.push(dailyEntry);
      }

      dailyEntry.value += 1;
      dailyEntry.workoutsCompleted.push(workoutId);

      // Update overall progress
      progress.currentValue += 1;
      progress.completionPercentage = Math.min(
        100,
        (progress.currentValue / progress.targetValue) * 100
      );

      // Update streak
      updateStreakData(progress);

      // Check for completion
      if (progress.completionPercentage >= 100 && !progress.isCompleted) {
        completeChallenge(challenge.id);
      }

      myProgress.value.set(challenge.id, progress);
    });

    saveChallenges();
    updateStats();
  }

  function checkWorkoutRequirements(
    workout: Workout,
    challenge: WorkoutChallenge
  ): boolean {
    const { constraints } = challenge.requirements;

    if (!constraints) return true;

    // Check workout types
    if (constraints.workoutTypes && constraints.workoutTypes.length > 0) {
      const workoutType = determineWorkoutType(workout);
      if (!constraints.workoutTypes.includes(workoutType)) return false;
    }

    // Check minimum duration
    if (constraints.minDuration) {
      const duration = estimateWorkoutDuration(workout);
      if (duration < constraints.minDuration) return false;
    }

    // Check specific exercises
    if (constraints.exercises && constraints.exercises.length > 0) {
      const hasRequiredExercise = workout.exercises.some((ex) =>
        constraints.exercises!.includes(ex.exercise.name.toLowerCase())
      );
      if (!hasRequiredExercise) return false;
    }

    return true;
  }

  function updateStreakData(progress: ChallengeProgress) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Check if user worked out today
    const workedOutToday = progress.dailyProgress.some(
      (dp) => dp.date.getTime() === today.getTime() && dp.value > 0
    );

    // Check if user worked out yesterday
    const workedOutYesterday = progress.dailyProgress.some(
      (dp) => dp.date.getTime() === yesterday.getTime() && dp.value > 0
    );

    if (workedOutToday) {
      if (workedOutYesterday || progress.streakData.current === 0) {
        progress.streakData.current += 1;
        progress.streakData.longest = Math.max(
          progress.streakData.longest,
          progress.streakData.current
        );
      }
      progress.streakData.lastUpdate = today;
    } else if (
      !workedOutYesterday &&
      progress.streakData.lastUpdate < yesterday
    ) {
      // Streak broken
      progress.streakData.current = 0;
    }
  }

  function completeChallenge(challengeId: string) {
    const challenge = myChallenges.value.find((c) => c.id === challengeId);
    if (!challenge) return;

    const progress = myProgress.value.get(challengeId) || challenge.progress;
    progress.isCompleted = true;
    progress.completedAt = new Date();
    progress.completionPercentage = 100;

    challenge.status = "completed";
    challenge.updatedAt = new Date();

    // Award rewards
    challenge.rewards.forEach((reward) => {
      if (!reward.unlockedAt && checkRewardRequirement(reward, progress)) {
        reward.unlockedAt = new Date();
        stats.totalPoints += reward.value;
        if (reward.type === "badge") {
          stats.badgesEarned += 1;
        }

        // Create notification
        addNotification({
          type: "challenge_completed",
          challengeId,
          title: "Challenge Completed!",
          message: `You've completed the "${challenge.name}" challenge and earned ${reward.name}!`,
        });
      }
    });

    saveChallenges();
    updateStats();
  }

  // Utility functions
  function getUserLevel(): "beginner" | "intermediate" | "advanced" {
    const completed = completedChallenges.value.length;
    if (completed < 3) return "beginner";
    if (completed < 10) return "intermediate";
    return "advanced";
  }

  function determineWorkoutType(workout: Workout): string {
    // Simple heuristic based on exercises
    const strengthIndicators = ["squat", "bench", "deadlift", "press", "curl"];
    const cardioIndicators = ["run", "bike", "swim", "jump", "burpee"];

    const exercises = workout.exercises.map((e) =>
      e.exercise.name.toLowerCase()
    );

    const strengthCount = exercises.filter((name) =>
      strengthIndicators.some((indicator) => name.includes(indicator))
    ).length;

    const cardioCount = exercises.filter((name) =>
      cardioIndicators.some((indicator) => name.includes(indicator))
    ).length;

    if (strengthCount > cardioCount) return "strength";
    if (cardioCount > strengthCount) return "cardio";
    return "mixed";
  }

  function estimateWorkoutDuration(workout: Workout): number {
    // Simple estimation: 3 minutes per exercise + rest time
    return workout.exercises.length * 3 + 10;
  }

  function checkRewardRequirement(
    reward: any,
    progress: ChallengeProgress
  ): boolean {
    switch (reward.requirement.type) {
      case "completion":
        return progress.isCompleted;
      case "streak":
        return progress.streakData.longest >= reward.requirement.value;
      default:
        return false;
    }
  }

  function loadChallengeTemplates() {
    // Load predefined challenge templates
    challengeTemplates.value = [
      {
        id: "consistency-7-day",
        name: "7-Day Consistency Challenge",
        description: "Work out every day for a week to build the habit",
        type: "streak",
        category: "consistency",
        difficulty: "beginner",
        defaultDuration: 7,
        requirements: {
          frequency: { count: 7, period: "total" },
        },
        rewards: [
          {
            id: "consistency-badge-1",
            type: "badge",
            name: "Consistency Champion",
            description: "Worked out 7 days in a row",
            value: 50,
            requirement: { type: "completion", value: 1 },
          },
        ],
        milestones: [],
        usageCount: 0,
        rating: 4.5,
        tags: ["beginner", "habit", "consistency"],
        isOfficial: true,
        createdAt: new Date(),
      },
      {
        id: "strength-30-day",
        name: "30-Day Strength Challenge",
        description: "Complete 20 strength workouts in 30 days",
        type: "target",
        category: "strength",
        difficulty: "intermediate",
        defaultDuration: 30,
        requirements: {
          frequency: { count: 20, period: "total" },
          constraints: { workoutTypes: ["strength"], minDuration: 30 },
        },
        rewards: [
          {
            id: "strength-badge-1",
            type: "badge",
            name: "Iron Warrior",
            description: "Completed 30-day strength challenge",
            value: 200,
            requirement: { type: "completion", value: 1 },
          },
        ],
        milestones: [],
        usageCount: 0,
        rating: 4.7,
        tags: ["strength", "intermediate", "30-day"],
        isOfficial: true,
        createdAt: new Date(),
      },
    ];
  }

  function loadAvailableChallenges() {
    // Simulate loading public challenges
    availableChallenges.value = [
      // Would be loaded from a server in a real app
    ];
  }

  function loadUserProgress() {
    try {
      const saved = localStorage.getItem("challenge-progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(
          ([challengeId, progress]: [string, any]) => {
            myProgress.value.set(challengeId, {
              ...progress,
              startDate: new Date(progress.startDate),
              dailyProgress: progress.dailyProgress.map((dp: any) => ({
                ...dp,
                date: new Date(dp.date),
              })),
              streakData: {
                ...progress.streakData,
                lastUpdate: new Date(progress.streakData.lastUpdate),
              },
              completedAt: progress.completedAt
                ? new Date(progress.completedAt)
                : undefined,
            });
          }
        );
      }
    } catch (error) {
      console.error("Failed to load user progress:", error);
    }
  }

  function updateStats() {
    stats.totalChallenges = myChallenges.value.length;
    stats.activeChallenges = activeChallenges.value.length;
    stats.completedChallenges = completedChallenges.value.length;

    // Calculate current streak across all challenges
    const currentStreaks = Array.from(myProgress.value.values()).map(
      (p) => p.streakData.current
    );
    stats.currentStreak = Math.max(0, ...currentStreaks);

    // Calculate longest streak
    const longestStreaks = Array.from(myProgress.value.values()).map(
      (p) => p.streakData.longest
    );
    stats.longestStreak = Math.max(0, ...longestStreaks);
  }

  function addNotification(
    notification: Omit<
      ChallengeNotification,
      "id" | "userId" | "read" | "createdAt"
    >
  ) {
    const newNotification: ChallengeNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      userId: currentUserId.value,
      read: false,
      createdAt: new Date(),
    };

    notifications.value.unshift(newNotification);
  }

  return {
    // State
    challenges,
    myChallenges,
    availableChallenges,
    challengeTemplates,
    leaderboards,
    notifications,
    stats,

    // Computed
    activeChallenges,
    completedChallenges,
    upcomingDeadlines,
    recommendedChallenges,

    // Methods
    loadChallenges,
    saveChallenges,
    createChallenge,
    joinChallenge,
    recordWorkout,
    completeChallenge,
    getUserLevel,
  };
}
