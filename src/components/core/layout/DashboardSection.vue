<!--
  DashboardSection.vue
  Reusable section component for dashboard layouts with optional actions and custom content areas.
  Usage: <DashboardSection title="Recent Activity" description="Your latest workouts" :actions="actions">
    <template #content>Custom content here</template>
  </DashboardSection>
-->
<template>
  <Card
    :variant="variant"
    :padding="padding"
    :rounded="rounded"
    :shadow="shadow"
    :bg-class="bgClass"
    class="transition-all duration-200"
  >
    <!-- Section Header -->
    <template v-if="$slots.header || title">
      <CardHeader v-if="!$slots.header" :show-divider="showDivider">
        <div class="flex items-center justify-between">
          <div>
            <Text
              variant="title"
              class="text-gray-900 dark:text-white font-bold"
            >
              {{ title }}
            </Text>
            <Text
              v-if="description"
              variant="body"
              class="text-gray-600 dark:text-gray-400 text-sm mt-1"
            >
              {{ description }}
            </Text>
          </div>

          <!-- Header Actions -->
          <div
            v-if="headerActions && headerActions.length > 0"
            class="flex items-center gap-2"
          >
            <Button
              v-for="action in headerActions"
              :key="action.id"
              :variant="action.variant || 'ghost'"
              :size="action.size || 'sm'"
              @click="$emit('header-action', action)"
            >
              <template v-if="action.icon" #leading>
                <Icon
                  :name="action.icon"
                  :variant="action.iconVariant || 'flat'"
                  size="xs"
                />
              </template>
              {{ action.label }}
            </Button>
          </div>
        </div>
      </CardHeader>

      <slot v-else name="header" />
    </template>

    <!-- Section Content -->
    <CardBody
      v-if="!$slots.content && !$slots.default"
      :padding="contentPadding"
    >
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Icon
          name="spinner"
          variant="flat"
          size="lg"
          class="text-gray-400 animate-spin"
        />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <Icon name="x" variant="flat" size="lg" class="text-red-400 mb-2" />
        <Text variant="body" class="text-red-600 dark:text-red-400">
          {{ error }}
        </Text>
      </div>

      <div v-else-if="emptyState" class="text-center py-12">
        <Icon
          :name="emptyState.icon || 'star'"
          variant="flat"
          size="xl"
          class="text-gray-300 dark:text-gray-600 mb-4"
        />
        <Text
          variant="title"
          class="text-gray-500 dark:text-gray-500 font-semibold mb-2"
        >
          {{ emptyState.title }}
        </Text>
        <Text variant="body" class="text-gray-400 dark:text-gray-600 mb-4">
          {{ emptyState.description }}
        </Text>
        <Button
          v-if="emptyState.action"
          :variant="emptyState.action.variant || 'primary'"
          :size="emptyState.action.size || 'md'"
          @click="$emit('empty-action', emptyState.action)"
        >
          <template v-if="emptyState.action.icon" #leading>
            <Icon :name="emptyState.action.icon" variant="flat" size="sm" />
          </template>
          {{ emptyState.action.label }}
        </Button>
      </div>
    </CardBody>

    <slot v-else-if="$slots.content" name="content" />
    <slot v-else />

    <!-- Section Actions -->
    <CardActions
      v-if="actions && actions.length > 0"
      class="border-t border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-2">
          <Button
            v-for="action in primaryActions"
            :key="action.id"
            :variant="action.variant || 'primary'"
            :size="action.size || 'md'"
            @click="$emit('action', action)"
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

        <div class="flex gap-2">
          <Button
            v-for="action in secondaryActions"
            :key="action.id"
            :variant="action.variant || 'ghost'"
            :size="action.size || 'md'"
            @click="$emit('action', action)"
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
    </CardActions>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Card } from ".";
import { CardHeader, CardBody, CardActions } from "./card-components";
import { Button, Icon, Text } from "../basics";

type CardVariant = "default" | "outlined" | "elevated" | "flat";
type RoundedSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
type ShadowSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl";

interface SectionAction {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconVariant?: "outline" | "fill" | "flat" | "ghost";
  type?: "primary" | "secondary";
  data?: any;
}

interface EmptyState {
  icon?: string;
  title: string;
  description: string;
  action?: SectionAction;
}

interface Props {
  title?: string;
  description?: string;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  contentPadding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: RoundedSize;
  shadow?: ShadowSize;
  bgClass?: string;
  showDivider?: boolean;
  loading?: boolean;
  error?: string;
  emptyState?: EmptyState;
  actions?: SectionAction[];
  headerActions?: SectionAction[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  padding: "none",
  contentPadding: "md",
  showDivider: false,
  loading: false,
  actions: () => [],
  headerActions: () => [],
});

const emit = defineEmits<{
  action: [action: SectionAction];
  "header-action": [action: SectionAction];
  "empty-action": [action: SectionAction];
}>();

const primaryActions = computed(
  () =>
    props.actions?.filter(
      (action: SectionAction) => action.type !== "secondary"
    ) || []
);

const secondaryActions = computed(
  () =>
    props.actions?.filter(
      (action: SectionAction) => action.type === "secondary"
    ) || []
);
</script>
