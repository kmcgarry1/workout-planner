/**
 * useWorkoutAnalytics.ts
 * Composable for workout analytics calculations and progress tracking.
 *
 * Provides methods to analyze workout data and generate insights.
 */

import { computed } from "vue";
import type { Workout, Exercise } from "@/types/workout";

export function useWorkoutAnalytics(workouts: Workout[]) {
  // Basic workout statistics
  const totalWorkouts = computed(() => workouts.length);
  const completedWorkouts = computed(() => workouts.filter((w) => w.completed));
  const completionRate = computed(() =>
    totalWorkouts.value > 0
      ? (completedWorkouts.value.length / totalWorkouts.value) * 100
      : 0
  );

  // Time-based analytics
  const workoutsThisWeek = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter((w) => new Date(w.date) >= weekAgo);
  });

  const workoutsThisMonth = computed(() => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return workouts.filter((w) => new Date(w.date) >= monthAgo);
  });

  const workoutsThisYear = computed(() => {
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    return workouts.filter((w) => new Date(w.date) >= yearAgo);
  });

  // Streak calculations
  const currentStreak = computed(() => {
    const sortedWorkouts = [...completedWorkouts.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (sortedWorkouts.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= streak + 1) {
        if (diffDays === streak) {
          streak++;
        } else if (diffDays === streak + 1) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
      } else {
        break;
      }
    }

    return streak;
  });

  const longestStreak = computed(() => {
    const sortedWorkouts = [...completedWorkouts.value].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedWorkouts.length === 0) return 0;

    let maxStreak = 1;
    let currentStreakLength = 1;

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDate = new Date(sortedWorkouts[i - 1]?.date || "");
      const currentDate = new Date(sortedWorkouts[i]?.date || "");

      prevDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 2) {
        // Allow 1 day gap
        currentStreakLength++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreakLength);
        currentStreakLength = 1;
      }
    }

    return Math.max(maxStreak, currentStreakLength);
  });

  // Exercise analytics
  const exerciseFrequency = computed(() => {
    const frequency = new Map<string, number>();

    workouts.forEach((workout) => {
      workout.exercises.forEach((we) => {
        const current = frequency.get(we.exercise.name) || 0;
        frequency.set(we.exercise.name, current + 1);
      });
    });

    return Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10 most used exercises
  });

  const mostUsedExercise = computed(() => {
    const freq = exerciseFrequency.value;
    return freq.length > 0 ? freq[0]?.[0] || null : null;
  });

  const exerciseTypeBreakdown = computed(() => {
    const allExercises = workouts.flatMap((w) =>
      w.exercises.map((we) => we.exercise)
    );
    if (allExercises.length === 0) return { strength: 0, conditioning: 0 };

    const strengthCount = allExercises.filter(
      (ex) => ex.type === "strength"
    ).length;
    const conditioningCount = allExercises.filter(
      (ex) => ex.type === "conditioning"
    ).length;

    return {
      strength: Math.round((strengthCount / allExercises.length) * 100),
      conditioning: Math.round((conditioningCount / allExercises.length) * 100),
    };
  });

  // Volume and intensity analytics
  const totalVolume = computed(() => {
    return workouts.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((workoutTotal, we) => {
          return (
            workoutTotal +
            we.sets.reduce((exerciseTotal, set) => {
              if (we.exercise.type === "strength" && set.weight && set.reps) {
                return exerciseTotal + set.weight * set.reps;
              }
              return exerciseTotal;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  });

  const averageWorkoutDuration = computed(() => {
    const workoutsWithDuration = workouts.filter((w) => w.totalDuration);
    if (workoutsWithDuration.length === 0) return 0;

    const total = workoutsWithDuration.reduce(
      (sum, w) => sum + (w.totalDuration || 0),
      0
    );
    return Math.round(total / workoutsWithDuration.length);
  });

  const averageWorkoutsPerWeek = computed(() => {
    if (workouts.length === 0) return 0;

    const firstWorkout = workouts.reduce((earliest, current) =>
      new Date(current.date) < new Date(earliest.date) ? current : earliest
    );

    const weeksSinceFirst = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(firstWorkout.date).getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      )
    );

    return Math.round((workouts.length / weeksSinceFirst) * 10) / 10;
  });

  // Progress tracking
  const weeklyProgress = computed(() => {
    const weeks = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      // Last 12 weeks
      const weekStart = new Date();
      weekStart.setDate(now.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekWorkouts = workouts.filter((w) => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate < weekEnd;
      });

      weeks.push({
        week: `Week ${12 - i}`,
        date: weekStart.toISOString().split("T")[0],
        workouts: weekWorkouts.length,
        completed: weekWorkouts.filter((w) => w.completed).length,
        totalDuration: weekWorkouts.reduce(
          (sum, w) => sum + (w.totalDuration || 0),
          0
        ),
      });
    }

    return weeks;
  });

  const monthlyProgress = computed(() => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      // Last 12 months
      const monthStart = new Date();
      monthStart.setMonth(now.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthStart.getMonth() + 1);

      const monthWorkouts = workouts.filter((w) => {
        const workoutDate = new Date(w.date);
        return workoutDate >= monthStart && workoutDate < monthEnd;
      });

      months.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        date: monthStart.toISOString().split("T")[0],
        workouts: monthWorkouts.length,
        completed: monthWorkouts.filter((w) => w.completed).length,
        totalVolume: monthWorkouts.reduce((total, workout) => {
          return (
            total +
            workout.exercises.reduce((workoutTotal, we) => {
              return (
                workoutTotal +
                we.sets.reduce((exerciseTotal, set) => {
                  if (
                    we.exercise.type === "strength" &&
                    set.weight &&
                    set.reps
                  ) {
                    return exerciseTotal + set.weight * set.reps;
                  }
                  return exerciseTotal;
                }, 0)
              );
            }, 0)
          );
        }, 0),
      });
    }

    return months;
  });

  // Personal records
  const personalRecords = computed(() => {
    const records = new Map<
      string,
      { weight: number; reps: number; date: string }
    >();

    workouts.forEach((workout) => {
      workout.exercises.forEach((we) => {
        if (we.exercise.type === "strength") {
          we.sets.forEach((set) => {
            if (set.weight && set.reps) {
              const exerciseName = we.exercise.name;
              const current = records.get(exerciseName);

              const oneRepMax = set.weight * (1 + set.reps / 30); // Epley formula approximation

              if (
                !current ||
                oneRepMax > current.weight * (1 + current.reps / 30)
              ) {
                records.set(exerciseName, {
                  weight: set.weight,
                  reps: set.reps,
                  date: workout.date,
                });
              }
            }
          });
        }
      });
    });

    return Array.from(records.entries()).map(([exercise, record]) => ({
      exercise,
      ...record,
    }));
  });

  // Goals and achievements
  const monthlyGoal = computed(() => 12); // Could be configurable
  const weeklyGoal = computed(() => 3); // Could be configurable

  const monthlyGoalProgress = computed(() => {
    const thisMonth = workoutsThisMonth.value.filter((w) => w.completed).length;
    return {
      current: thisMonth,
      target: monthlyGoal.value,
      percentage: Math.round((thisMonth / monthlyGoal.value) * 100),
    };
  });

  const weeklyGoalProgress = computed(() => {
    const thisWeek = workoutsThisWeek.value.filter((w) => w.completed).length;
    return {
      current: thisWeek,
      target: weeklyGoal.value,
      percentage: Math.round((thisWeek / weeklyGoal.value) * 100),
    };
  });

  // Summary statistics
  const summaryStats = computed(() => ({
    total: totalWorkouts.value,
    completed: completedWorkouts.value.length,
    completionRate: Math.round(completionRate.value),
    currentStreak: currentStreak.value,
    longestStreak: longestStreak.value,
    thisWeek: workoutsThisWeek.value.length,
    thisMonth: workoutsThisMonth.value.length,
    averageDuration: averageWorkoutDuration.value,
    averagePerWeek: averageWorkoutsPerWeek.value,
    totalVolume: totalVolume.value,
    mostUsedExercise: mostUsedExercise.value,
    exerciseBreakdown: exerciseTypeBreakdown.value,
  }));

  return {
    // Basic stats
    totalWorkouts,
    completedWorkouts,
    completionRate,

    // Time-based
    workoutsThisWeek,
    workoutsThisMonth,
    workoutsThisYear,

    // Streaks
    currentStreak,
    longestStreak,

    // Exercise analytics
    exerciseFrequency,
    mostUsedExercise,
    exerciseTypeBreakdown,

    // Volume and intensity
    totalVolume,
    averageWorkoutDuration,
    averageWorkoutsPerWeek,

    // Progress tracking
    weeklyProgress,
    monthlyProgress,

    // Personal records
    personalRecords,

    // Goals
    monthlyGoal,
    weeklyGoal,
    monthlyGoalProgress,
    weeklyGoalProgress,

    // Summary
    summaryStats,
  };
}
