<!--
  ExerciseForm.vue
  Form component for creating and editing custom exercises with full field support.
  
  Usage:
  <ExerciseForm :exercise="existingExercise" @save="handleSave" @cancel="handleCancel" />
-->
<template>
  <Card
    variant="elevated"
    padding="none"
    rounded="xl"
    shadow="lg"
    bg-class="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
  >
    <CardHeader
      :title="exercise ? 'Edit Exercise' : 'Create New Exercise'"
      :subtitle="
        exercise
          ? 'Modify exercise details'
          : 'Add a custom exercise to your library'
      "
      :divider="true"
      padding="lg"
    >
      <template #prepend>
        <div
          class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl"
        >
          <Icon name="plus" variant="fill" size="lg" class="text-white" />
        </div>
      </template>
    </CardHeader>

    <CardBody padding="lg" space-y="lg">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Exercise Name -->
        <div>
          <Input
            v-model="formData.name"
            label="Exercise Name"
            type="text"
            variant="filled"
            size="lg"
            placeholder="e.g., Custom Push-ups"
            required
            class="font-semibold"
            :error="errors.name"
          />
        </div>

        <!-- Type and Category Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Exercise Type -->
          <div>
            <label
              class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
            >
              Exercise Type *
            </label>
            <div
              class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <button
                type="button"
                @click="formData.type = 'strength'"
                :class="[
                  'px-4 py-2.5 rounded-md font-bold text-sm transition-all duration-200',
                  formData.type === 'strength'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                ]"
              >
                <Icon
                  name="star"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                Strength
              </button>
              <button
                type="button"
                @click="formData.type = 'conditioning'"
                :class="[
                  'px-4 py-2.5 rounded-md font-bold text-sm transition-all duration-200',
                  formData.type === 'conditioning'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                ]"
              >
                <Icon
                  name="spinner"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                Conditioning
              </button>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label
              class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              v-model="formData.category"
              class="w-full px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 transition-all duration-150"
            >
              <option value="">Select category...</option>
              <option
                v-for="cat in EXERCISE_CATEGORIES"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </div>
        </div>

        <!-- Difficulty -->
        <div>
          <label
            class="block mb-3 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Difficulty Level
          </label>
          <div
            class="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <button
              v-for="level in DIFFICULTY_LEVELS"
              :key="level"
              type="button"
              @click="formData.difficulty = level"
              :class="[
                'px-4 py-2.5 rounded-md font-bold text-sm transition-all duration-200',
                formData.difficulty === level
                  ? getDifficultyColor(level)
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ]"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <!-- Muscle Groups -->
        <div>
          <label
            class="block mb-3 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Primary Muscle Groups
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <button
              v-for="muscle in MUSCLE_GROUPS"
              :key="muscle"
              type="button"
              @click="toggleMuscleGroup(muscle)"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2',
                formData.muscleGroups.includes(muscle)
                  ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600',
              ]"
            >
              {{ muscle }}
            </button>
          </div>
        </div>

        <!-- Equipment -->
        <div>
          <label
            class="block mb-3 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Required Equipment
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              v-for="equip in EQUIPMENT_OPTIONS"
              :key="equip"
              type="button"
              @click="toggleEquipment(equip)"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2',
                formData.equipment.includes(equip)
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600',
              ]"
            >
              {{ equip }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label
            class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Brief description of the exercise..."
            class="w-full px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 resize-none"
          />
        </div>

        <!-- Instructions -->
        <div>
          <label
            class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Step-by-Step Instructions
          </label>
          <textarea
            v-model="formData.instructions"
            rows="4"
            placeholder="1. Starting position...&#10;2. Movement execution...&#10;3. Return to starting position..."
            class="w-full px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 resize-none"
          />
        </div>

        <!-- Tips -->
        <div>
          <label
            class="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Form Tips & Safety Notes
          </label>
          <textarea
            v-model="formData.tips"
            rows="3"
            placeholder="Important form cues and safety considerations..."
            class="w-full px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 transition-all duration-150 resize-none"
          />
        </div>

        <!-- Icon Selection -->
        <div>
          <label
            class="block mb-3 font-semibold text-sm text-gray-700 dark:text-gray-300"
          >
            Exercise Icon
          </label>
          <div class="grid grid-cols-6 md:grid-cols-8 gap-2">
            <button
              v-for="iconName in iconOptions"
              :key="iconName"
              type="button"
              @click="formData.icon = iconName"
              :class="[
                'p-3 rounded-lg border-2 transition-all duration-200',
                formData.icon === iconName
                  ? 'bg-purple-500 border-purple-500 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600',
              ]"
            >
              <Icon
                :name="iconName"
                variant="fill"
                size="md"
                :class="
                  formData.icon === iconName
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                "
              />
            </button>
          </div>
        </div>
      </form>
    </CardBody>

    <CardActions
      justify="between"
      padding="lg"
      class="bg-gray-50 dark:bg-gray-800/50"
    >
      <Button
        variant="ghost"
        size="lg"
        @click="emit('cancel')"
        class="font-semibold"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="lg"
        @click="handleSubmit"
        :disabled="!isValid"
        class="font-bold"
      >
        <template #leading>
          <Icon name="check" variant="flat" size="sm" />
        </template>
        {{ exercise ? "Update Exercise" : "Create Exercise" }}
      </Button>
    </CardActions>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { Card } from "../layout";
import { CardHeader, CardBody, CardActions } from "../layout/card-components";
import { Button, Icon, Text, Input } from "../basics";
import {
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
  EXERCISE_CATEGORIES,
  DIFFICULTY_LEVELS,
  type Exercise,
  type ExerciseType,
} from "../../../types/workout";

interface ExerciseFormProps {
  exercise?: Exercise | null;
}

const props = defineProps<ExerciseFormProps>();

const emit = defineEmits<{
  (e: "save", exercise: Exercise): void;
  (e: "cancel"): void;
}>();

const formData = reactive<
  Partial<Exercise> & { type: ExerciseType; name: string }
>({
  name: "",
  type: "strength",
  category: "",
  description: "",
  instructions: "",
  tips: "",
  difficulty: "Beginner",
  muscleGroups: [],
  equipment: [],
  icon: "star",
});

const errors = reactive({
  name: "",
});

const iconOptions = [
  "star",
  "spinner",
  "plus",
  "check",
  "x",
  "home",
  "search",
  "menu",
  "sun",
  "moon",
];

// Initialize form with existing exercise data if editing
onMounted(() => {
  if (props.exercise) {
    Object.assign(formData, {
      ...props.exercise,
      muscleGroups: props.exercise.muscleGroups || [],
      equipment: props.exercise.equipment || [],
    });
  }
});

const isValid = computed(() => {
  return formData.name.trim().length > 0;
});

function getDifficultyColor(level: string): string {
  switch (level) {
    case "Beginner":
      return "bg-green-500 text-white shadow-lg";
    case "Intermediate":
      return "bg-yellow-500 text-white shadow-lg";
    case "Advanced":
      return "bg-red-500 text-white shadow-lg";
    default:
      return "bg-gray-500 text-white shadow-lg";
  }
}

function toggleMuscleGroup(muscle: string) {
  const index = formData.muscleGroups.indexOf(muscle);
  if (index > -1) {
    formData.muscleGroups.splice(index, 1);
  } else {
    formData.muscleGroups.push(muscle);
  }
}

function toggleEquipment(equipment: string) {
  const index = formData.equipment.indexOf(equipment);
  if (index > -1) {
    formData.equipment.splice(index, 1);
  } else {
    formData.equipment.push(equipment);
  }
}

function validateForm(): boolean {
  errors.name = "";

  if (!formData.name.trim()) {
    errors.name = "Exercise name is required";
    return false;
  }

  if (formData.name.trim().length < 3) {
    errors.name = "Exercise name must be at least 3 characters";
    return false;
  }

  return true;
}

function handleSubmit() {
  if (!validateForm()) return;

  const exercise: Exercise = {
    id:
      props.exercise?.id ||
      `exercise-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    name: formData.name.trim(),
    type: formData.type,
    category: formData.category || undefined,
    description: formData.description || undefined,
    instructions: formData.instructions || undefined,
    tips: formData.tips || undefined,
    difficulty: formData.difficulty || "Beginner",
    muscleGroups:
      formData.muscleGroups.length > 0 ? [...formData.muscleGroups] : undefined,
    equipment:
      formData.equipment.length > 0 ? [...formData.equipment] : undefined,
    icon: formData.icon || "star",
    isCustom: true,
    createdAt: props.exercise?.createdAt || new Date().toISOString(),
    isFavorite: props.exercise?.isFavorite || false,
    lastUsed: props.exercise?.lastUsed,
  };

  emit("save", exercise);
}
</script>
