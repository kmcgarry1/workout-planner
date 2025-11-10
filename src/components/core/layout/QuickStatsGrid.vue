<!--
  QuickStatsGrid.vue
  Reusable grid component for displaying key metrics with customizable styling.
  Usage: <QuickStatsGrid :stats="statsArray" :columns="3" variant="default" />
-->
<template>
  <div :class="gridClasses">
    <div
      v-for="stat in stats"
      :key="stat.id"
      :class="[
        'text-center p-6 rounded-xl transition-colors duration-200',
        getStatBgClass(stat, variant),
      ]"
    >
      <!-- Stat Icon (optional) -->
      <div v-if="stat.icon" class="mb-3">
        <div
          :class="[
            'inline-flex items-center justify-center p-2 rounded-lg',
            getIconBgClass(stat, variant),
          ]"
        >
          <Icon
            :name="stat.icon"
            :variant="stat.iconVariant || 'flat'"
            size="md"
            :class="getIconColor(stat, variant)"
          />
        </div>
      </div>

      <!-- Stat Value -->
      <Text
        variant="title"
        :class="[
          'font-black mb-1',
          getValueTextClass(stat, variant),
          stat.size === 'large'
            ? 'text-4xl'
            : stat.size === 'small'
            ? 'text-lg'
            : 'text-2xl',
        ]"
      >
        {{ formatValue(stat.value, stat.format) }}
      </Text>

      <!-- Stat Label -->
      <Text
        variant="body"
        :class="[
          'font-medium',
          getLabelTextClass(variant),
          stat.size === 'large' ? 'text-base' : 'text-sm',
        ]"
      >
        {{ stat.label }}
      </Text>

      <!-- Stat Trend (optional) -->
      <div
        v-if="stat.trend"
        class="mt-2 flex items-center justify-center gap-1"
      >
        <Icon
          :name="stat.trend.direction === 'up' ? 'star' : 'star'"
          variant="flat"
          size="xs"
          :class="
            stat.trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
          "
        />
        <Text
          variant="body"
          :class="[
            'text-xs font-semibold',
            stat.trend.direction === 'up'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400',
          ]"
        >
          {{ stat.trend.value }}
        </Text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon, Text } from "../basics";

interface StatTrend {
  direction: "up" | "down";
  value: string;
}

export interface QuickStat {
  id: string;
  label: string;
  value: number | string;
  format?: "number" | "decimal" | "percentage" | "duration" | "custom";
  color?: string;
  icon?: string;
  iconVariant?: "outline" | "fill" | "flat" | "ghost";
  size?: "small" | "medium" | "large";
  trend?: StatTrend;
}

interface Props {
  stats: QuickStat[];
  columns?: number;
  variant?: "default" | "cards" | "gradient" | "minimal";
  gap?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  variant: "default",
  gap: "md",
});

// Computed classes
const gridClasses = computed(() => {
  const colClass = `grid-cols-${Math.min(props.columns, props.stats.length)}`;
  const gapClass =
    props.gap === "sm" ? "gap-4" : props.gap === "lg" ? "gap-8" : "gap-6";

  return ["grid", colClass, gapClass, "w-full"];
});

// Styling methods
function getStatBgClass(stat: QuickStat, variant: string): string {
  if (variant === "cards") {
    return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md";
  }
  if (variant === "gradient") {
    const gradients: Record<string, string> = {
      blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800",
      purple:
        "bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200 dark:border-purple-800",
      green:
        "bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200 dark:border-green-800",
      orange:
        "bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-200 dark:border-orange-800",
    };
    const color = stat.color || "blue";
    return gradients[color] ?? gradients.blue!;
  }
  if (variant === "minimal") {
    return "hover:bg-gray-50 dark:hover:bg-gray-800/50";
  }
  return "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800";
}

function getIconBgClass(stat: QuickStat, variant: string): string {
  if (variant === "gradient" || variant === "cards") {
    const backgrounds: Record<string, string> = {
      blue: "bg-blue-100 dark:bg-blue-900/30",
      purple: "bg-purple-100 dark:bg-purple-900/30",
      green: "bg-green-100 dark:bg-green-900/30",
      orange: "bg-orange-100 dark:bg-orange-900/30",
    };
    const color = stat.color || "blue";
    return backgrounds[color] ?? backgrounds.blue!;
  }
  return "bg-white dark:bg-gray-700";
}

function getIconColor(stat: QuickStat, variant: string): string {
  const colors: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
  };
  const color = stat.color || "blue";
  return colors[color] ?? colors.blue!;
}

function getValueTextClass(stat: QuickStat, variant: string): string {
  const colors: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
  };
  return colors[stat.color || "blue"] || "text-gray-900 dark:text-white";
}

function getLabelTextClass(variant: string): string {
  return "text-gray-600 dark:text-gray-400";
}

function formatValue(value: number | string, format?: string): string {
  if (typeof value === "string") return value;

  switch (format) {
    case "decimal":
      return value.toFixed(1);
    case "percentage":
      return `${value}%`;
    case "duration":
      return `${value}min`;
    case "number":
    default:
      return value.toLocaleString();
  }
}
</script>
