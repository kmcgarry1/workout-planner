/**
 * Core workout types for the Workout Planner app
 */

export type ExerciseType = 'strength' | 'conditioning'

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  category?: string // e.g., 'Upper Body', 'Lower Body', 'Cardio', 'Core'
  description?: string
  icon?: string
}

export interface ExerciseSet {
  setNumber: number
  reps?: number // for strength exercises
  weight?: number // in lbs or kg
  weightUnit?: 'lbs' | 'kg'
  time?: number // in seconds for conditioning
  rest?: number // rest in seconds between sets
  completed?: boolean
}

export interface WorkoutExercise {
  id: string // unique ID for this instance in the workout
  exerciseId: string // reference to the Exercise
  exercise: Exercise // denormalized for convenience
  sets: ExerciseSet[]
  notes?: string
  order: number // position in the workout
}

export interface Workout {
  id: string
  name: string
  date: string // ISO date string
  exercises: WorkoutExercise[]
  totalDuration?: number // in minutes
  notes?: string
  completed?: boolean
}

// Sample exercise library
export const SAMPLE_EXERCISES: Exercise[] = [
  // Strength - Upper Body
  {
    id: 'bench-press',
    name: 'Bench Press',
    type: 'strength',
    category: 'Upper Body',
    description: 'Classic chest exercise',
    icon: 'star'
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    type: 'strength',
    category: 'Upper Body',
    description: 'Bodyweight back exercise',
    icon: 'star'
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    type: 'strength',
    category: 'Upper Body',
    description: 'Shoulder strength',
    icon: 'star'
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    type: 'strength',
    category: 'Upper Body',
    description: 'Back and arm strength',
    icon: 'star'
  },
  
  // Strength - Lower Body
  {
    id: 'squat',
    name: 'Squat',
    type: 'strength',
    category: 'Lower Body',
    description: 'Lower body compound',
    icon: 'star'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    type: 'strength',
    category: 'Lower Body',
    description: 'Full body compound lift',
    icon: 'star'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    type: 'strength',
    category: 'Lower Body',
    description: 'Single leg strength',
    icon: 'star'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    type: 'strength',
    category: 'Lower Body',
    description: 'Machine-based leg exercise',
    icon: 'star'
  },
  
  // Conditioning
  {
    id: 'running',
    name: 'Running',
    type: 'conditioning',
    category: 'Cardio',
    description: 'Outdoor or treadmill',
    icon: 'spinner'
  },
  {
    id: 'rowing',
    name: 'Rowing',
    type: 'conditioning',
    category: 'Cardio',
    description: 'Low-impact cardio',
    icon: 'spinner'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    type: 'conditioning',
    category: 'Cardio',
    description: 'High-intensity cardio',
    icon: 'spinner'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    type: 'conditioning',
    category: 'Full Body',
    description: 'Full body conditioning',
    icon: 'spinner'
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    type: 'conditioning',
    category: 'Lower Body',
    description: 'Explosive leg power',
    icon: 'spinner'
  },
  {
    id: 'bike',
    name: 'Stationary Bike',
    type: 'conditioning',
    category: 'Cardio',
    description: 'Low-impact cardio',
    icon: 'spinner'
  }
]
