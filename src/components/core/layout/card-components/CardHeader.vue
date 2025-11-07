<template>
    <div 
        :class="[
            'flex items-center gap-3',
            paddingClass,
            divider ? 'border-b border-gray-200 dark:border-gray-700' : ''
        ]"
    >
        <!-- Prepend Icon -->
        <Icon
            v-if="prependIcon"
            :name="prependIcon"
            :size="iconSize"
            :variant="iconVariant"
            :colorClass="iconColorClass"
            :bgClass="iconBgClass"
        />

        <!-- Title and Subtitle Container -->
        <div class="flex-1 min-w-0">
            <Text 
                :variant="titleVariant" 
                :weight="titleWeight"
                :colorClass="titleColorClass"
                :truncate="truncateTitle"
            >
                <slot>{{ title }}</slot>
            </Text>
            
            <Text
                v-if="subtitle || $slots.subtitle"
                variant="footer"
                :colorClass="subtitleColorClass"
                :truncate="truncateSubtitle"
                class="mt-0.5"
            >
                <slot name="subtitle">{{ subtitle }}</slot>
            </Text>
        </div>

        <!-- Append Icon Slot -->
        <div v-if="$slots.append" class="flex-shrink-0">
            <slot name="append" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Text, Icon } from '../../basics'

/*
    CardHeader.vue
    - Card header with title, subtitle, and optional icons
    - Supports prepend icon and append slot for actions
    - Divider option for visual separation
    
    Usage Examples:
    
    <!-- Simple title -->
    <CardHeader title="Workout Plan" />
    
    <!-- With subtitle -->
    <CardHeader title="Week 1" subtitle="Upper Body Focus" />
    
    <!-- With prepend icon -->
    <CardHeader 
      title="Settings" 
      prepend-icon="star"
      icon-variant="fill"
      icon-bg-class="bg-blue-500"
    />
    
    <!-- With append actions -->
    <CardHeader title="My Card">
      <template #append>
        <Icon name="menu" size="sm" />
      </template>
    </CardHeader>
    
    <!-- Custom title via slot -->
    <CardHeader prepend-icon="home">
      <Text variant="title" color-class="text-blue-600">
        Custom Title
      </Text>
      <template #subtitle>
        Custom subtitle content
      </template>
    </CardHeader>
    
    <!-- Without divider -->
    <CardHeader title="No Border" :divider="false" />
*/

type TitleVariant = 'title' | 'subtitle' | 'header' | 'subheader'
type TitleWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconVariant = 'outline' | 'fill' | 'flat' | 'ghost'
type PaddingSize = 'none' | 'sm' | 'md' | 'lg'

interface CardHeaderProps {
    title?: string
    subtitle?: string
    prependIcon?: string
    titleVariant?: TitleVariant
    titleWeight?: TitleWeight
    titleColorClass?: string
    subtitleColorClass?: string
    iconSize?: IconSize
    iconVariant?: IconVariant
    iconColorClass?: string
    iconBgClass?: string
    divider?: boolean
    padding?: PaddingSize
    truncateTitle?: boolean
    truncateSubtitle?: boolean
}

const props = withDefaults(defineProps<CardHeaderProps>(), {
    title: '',
    subtitle: '',
    prependIcon: '',
    titleVariant: 'title',
    titleWeight: 'semibold',
    titleColorClass: 'text-gray-900 dark:text-white',
    subtitleColorClass: 'text-gray-600 dark:text-gray-400',
    iconSize: 'md',
    iconVariant: 'flat',
    iconColorClass: 'text-gray-700 dark:text-gray-300',
    iconBgClass: '',
    divider: true,
    padding: 'md',
    truncateTitle: false,
    truncateSubtitle: false
})

const paddingMap: Record<PaddingSize, string> = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4'
}

const paddingClass = paddingMap[props.padding]
</script>
