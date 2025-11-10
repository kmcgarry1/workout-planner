<template>
    <div
        :class="[
            'overflow-hidden',
            variantClass,
            roundedClass,
            shadowClass,
            bgClass,
            borderClass
        ]"
    >
        <!-- Image Slot (typically at top) -->
        <slot name="image" />

        <!-- Header Slot -->
        <slot name="header" />

        <!-- Default Body Slot -->
        <slot />

        <!-- Actions/Footer Slot -->
        <slot name="actions" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/*
    Card.vue
    - Main container component for card layouts
    - Supports header, body, actions, and image slots
    - Multiple variants and styling options
    
    Usage Examples:
    
    <!-- Simple card -->
    <Card>
      <CardBody>
        <Text variant="body">Simple card content</Text>
      </CardBody>
    </Card>
    
    <!-- Full card with all sections -->
    <Card variant="elevated">
      <template #header>
        <CardHeader title="Workout Plan" subtitle="Week 1" />
      </template>
      
      <CardBody>
        <Text variant="body">Your workout details...</Text>
      </CardBody>
      
      <template #actions>
        <CardActions>
          <Button variant="outline" label="Cancel" />
          <Button variant="primary" label="Start" />
        </CardActions>
      </template>
    </Card>
    
    <!-- Card with image -->
    <Card variant="elevated" rounded="xl">
      <template #image>
        <CardImage src="/workout.jpg" rounded="top" />
      </template>
      
      <template #header>
        <CardHeader title="HIIT Training" />
      </template>
      
      <CardBody>
        <Text variant="body">30-minute workout session</Text>
      </CardBody>
    </Card>
    
    <!-- Outlined card -->
    <Card variant="outlined" shadow="sm">
      <CardBody>
        <Text variant="title">Simple Outlined Card</Text>
      </CardBody>
    </Card>
    
    <!-- Flat card (no border/shadow) -->
    <Card variant="flat">
      <CardBody>
        <Text variant="body">Minimal card style</Text>
      </CardBody>
    </Card>
    
    <!-- Custom background -->
    <Card bg-class="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardBody>
        <Text variant="title">Custom Styled</Text>
      </CardBody>
    </Card>
*/

type CardVariant = 'default' | 'outlined' | 'elevated' | 'flat'
type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface CardProps {
    variant?: CardVariant
    rounded?: RoundedSize
    shadow?: ShadowSize
    bgClass?: string
    borderClass?: string
}

const props = withDefaults(defineProps<CardProps>(), {
    variant: 'default',
    rounded: 'lg',
    shadow: 'md',
    bgClass: 'bg-white dark:bg-gray-800',
    borderClass: ''
})

const variantMap: Record<CardVariant, string> = {
    default: 'border border-gray-200 dark:border-gray-700',
    outlined: 'border-2 border-gray-300 dark:border-gray-600',
    elevated: 'border-none',
    flat: 'border-none'
}

const roundedMap: Record<RoundedSize, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
}

const shadowMap: Record<ShadowSize, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
}

const variantClass = computed(() => {
    // Use custom borderClass if provided, otherwise use variant default
    return props.borderClass || variantMap[props.variant]
})

const roundedClass = computed(() => roundedMap[props.rounded])

const shadowClass = computed(() => {
    // Elevated variant gets shadow by default, flat has none unless specified
    if (props.variant === 'flat') return ''
    if (props.variant === 'elevated' && props.shadow === 'md') return 'shadow-lg'
    return shadowMap[props.shadow]
})

const bgClass = computed(() => props.bgClass)
const borderClass = computed(() => props.borderClass)
</script>