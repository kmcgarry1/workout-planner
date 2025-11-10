<!--
  DashboardHeader.vue
  Reusable dashboard header component with title, description, and action buttons.
  Usage: <DashboardHeader title="Dashboard" description="Your overview" :actions="actions" @action="handleAction" />
-->
<template>
  <div class="text-center relative">
    <!-- Icon Hero -->
    <div
      :class="[
        'inline-flex items-center justify-center p-3 mb-4 rounded-2xl shadow-lg',
        iconBgClass || 'bg-gradient-to-br from-blue-500 to-indigo-600',
      ]"
    >
      <Icon :name="icon" variant="fill" size="xl" class="text-white" />
    </div>

    <!-- Title and Description -->
    <Text
      variant="header"
      color-class="text-gray-900 dark:text-white"
      class="font-black mb-3 tracking-tight"
    >
      {{ title }}
    </Text>
    <Text
      variant="body"
      color-class="text-gray-600 dark:text-gray-400"
      class="text-lg font-medium max-w-2xl mx-auto mb-6"
    >
      {{ description }}
    </Text>

    <!-- Action Buttons -->
    <div
      v-if="actions && actions.length > 0"
      class="flex justify-center gap-4 mb-8"
    >
      <Button
        v-for="action in actions"
        :key="action.id"
        :variant="action.variant || 'primary'"
        :size="action.size || 'lg'"
        @click="$emit('action', action)"
        class="font-bold"
      >
        <template v-if="action.icon" #leading>
          <Icon
            :name="action.icon"
            :variant="action.iconVariant || 'flat'"
            size="sm"
          />
        </template>
        {{ action.label }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon, Text, Button } from "../basics";

interface DashboardAction {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconVariant?: "outline" | "fill" | "flat" | "ghost";
  data?: any;
}

interface Props {
  title: string;
  description: string;
  icon?: string;
  iconBgClass?: string;
  actions?: DashboardAction[];
}

withDefaults(defineProps<Props>(), {
  icon: "star",
  actions: () => [],
});

defineEmits<{
  action: [action: DashboardAction];
}>();
</script>
