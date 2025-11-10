/**
 * Core workout types for the Workout Planner app
 */

export type ExerciseType = "strength" | "conditioning";

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  category?: string; // e.g., 'Upper Body', 'Lower Body', 'Cardio', 'Core'
  description?: string;
  icon?: string;
  // Enhanced features for Phase 3
  muscleGroups?: string[]; // e.g., ['Chest', 'Shoulders', 'Triceps']
  equipment?: string[]; // e.g., ['Barbell', 'Dumbbells', 'Bench']
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  instructions?: string; // Step-by-step exercise instructions
  tips?: string; // Form tips and safety notes
  isCustom?: boolean; // true if created by user, false for built-in exercises
  createdAt?: string; // ISO timestamp for custom exercises
  isFavorite?: boolean; // user favorite status
  lastUsed?: string; // ISO timestamp when last used in workout
}

export interface ExerciseSet {
  setNumber: number;
  reps?: number; // for strength exercises
  weight?: number; // in lbs or kg
  weightUnit?: "lbs" | "kg";
  time?: number; // in seconds for conditioning
  rest?: number; // rest in seconds between sets
  completed?: boolean;
  // For tracking actual performance during execution
  actualReps?: number;
  actualWeight?: number;
  actualTime?: number;
  completedAt?: string; // ISO timestamp
  // Enhanced tracking features
  difficultyRating?: number; // 1-5 scale for how hard the set felt
  setStartTime?: string; // ISO timestamp when set began
  setDuration?: number; // actual time taken to complete the set in seconds
  notes?: string; // per-set notes
}

export interface WorkoutExercise {
  id: string; // unique ID for this instance in the workout
  exerciseId: string; // reference to the Exercise
  exercise: Exercise; // denormalized for convenience
  sets: ExerciseSet[];
  notes?: string;
  order: number; // position in the workout
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO date string
  exercises: WorkoutExercise[];
  totalDuration?: number; // in minutes
  notes?: string;
  tags?: string[]; // workout tags for categorization
  completed?: boolean;
  startedAt?: string; // ISO timestamp when workout execution started
  completedAt?: string; // ISO timestamp when workout was completed
  // Enhanced tracking features
  overallDifficulty?: number; // 1-10 scale for overall workout difficulty
  plannedDuration?: number; // estimated duration in minutes
  actualDuration?: number; // actual time taken in minutes
  performanceScore?: number; // calculated performance vs plan (0.5 = 50%, 1.5 = 150%)
}

// Active workout execution state
export interface ActiveWorkoutState {
  workoutId: string;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restStartTime?: number;
  restDuration?: number; // in seconds
  workoutStartTime: number;
  isPaused: boolean;
  totalSetsCompleted: number;
  totalSets: number;
}

// Timer states for rest periods
export interface RestTimer {
  duration: number; // total rest time in seconds
  remaining: number; // remaining time in seconds
  isActive: boolean;
  startTime?: number;
}

// Personal Records for analytics and tracking
export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string; // ISO date string
  oneRepMax?: number; // calculated 1RM
}

// Goals for motivation and tracking
export interface Goal {
  exercise: string;
  targetWeight: number;
  targetDate?: string; // ISO date string
  achieved?: boolean;
  achievedDate?: string; // ISO date string when goal was reached
}

// Exercise management constants
export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Biceps",
  "Triceps",
  "Core",
  "Abs",
  "Legs",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Full Body",
] as const;

export const EQUIPMENT_OPTIONS = [
  "Bodyweight",
  "Barbell",
  "Dumbbells",
  "Kettlebell",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Cable Machine",
  "Smith Machine",
  "Squat Rack",
  "Leg Press",
  "Cardio Machine",
  "Medicine Ball",
  "Suspension Trainer",
  "Parallettes",
  "Gymnastic Rings",
] as const;

export const EXERCISE_CATEGORIES = [
  "Upper Body",
  "Lower Body",
  "Core",
  "Cardio",
  "Full Body",
  "Flexibility",
  "Warm-up",
  "Cool-down",
] as const;

export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

// Sample exercise library
export const SAMPLE_EXERCISES: Exercise[] = [
  // Strength - Upper Body
  {
    id: "bench-press",
    name: "Bench Press",
    type: "strength",
    category: "Upper Body",
    description: "Classic chest exercise",
    icon: "star",
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    type: "strength",
    category: "Upper Body",
    description: "Bodyweight back exercise",
    icon: "star",
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    type: "strength",
    category: "Upper Body",
    description: "Shoulder strength",
    icon: "star",
  },
  {
    id: "dumbbell-row",
    name: "Dumbbell Row",
    type: "strength",
    category: "Upper Body",
    description: "Back and arm strength",
    icon: "star",
  },

  // Strength - Lower Body
  {
    id: "squat",
    name: "Squat",
    type: "strength",
    category: "Lower Body",
    description: "Lower body compound",
    icon: "star",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    type: "strength",
    category: "Lower Body",
    description: "Full body compound lift",
    icon: "star",
  },
  {
    id: "lunges",
    name: "Lunges",
    type: "strength",
    category: "Lower Body",
    description: "Single leg strength",
    icon: "star",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    type: "strength",
    category: "Lower Body",
    description: "Machine-based leg exercise",
    icon: "star",
  },

  // Conditioning
  {
    id: "running",
    name: "Running",
    type: "conditioning",
    category: "Cardio",
    description: "Outdoor or treadmill",
    icon: "spinner",
  },
  {
    id: "rowing",
    name: "Rowing",
    type: "conditioning",
    category: "Cardio",
    description: "Low-impact cardio",
    icon: "spinner",
  },
  {
    id: "jump-rope",
    name: "Jump Rope",
    type: "conditioning",
    category: "Cardio",
    description: "High-intensity cardio",
    icon: "spinner",
  },
  {
    id: "burpees",
    name: "Burpees",
    type: "conditioning",
    category: "Full Body",
    description: "Full body conditioning",
    icon: "spinner",
  },
  {
    id: "box-jumps",
    name: "Box Jumps",
    type: "conditioning",
    category: "Lower Body",
    description: "Explosive leg power",
    icon: "spinner",
  },
  {
    id: "bike",
    name: "Stationary Bike",
    type: "conditioning",
    category: "Cardio",
    description: "Low-impact cardio",
    icon: "spinner",
  },
];
