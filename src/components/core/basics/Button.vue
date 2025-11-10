<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        :class="[
            'inline-flex items-center justify-center gap-2',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClass,
            variantClass,
            roundedClass,
            fullWidth ? 'w-full' : ''
        ]"
        v-bind="$attrs"
    >
        <!-- Loading Spinner -->
        <Icon
            v-if="loading"
            name="spinner"
            :size="iconSize"
            class="animate-spin"
        />

        <!-- Prepend Icon -->
        <Icon
            v-else-if="prependIcon"
            :name="prependIcon"
            :size="iconSize"
        />

        <!-- Button Text -->
        <span v-if="$slots.default || label" :class="textClass">
            <slot>{{ label }}</slot>
        </span>

        <!-- Append Icon -->
        <Icon
            v-if="appendIcon && !loading"
            :name="appendIcon"
            :size="iconSize"
        />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from './'

/*
    Button.vue
    - Flexible button component with variants and states
    - Supports prepend/append icons and loading state
    - Full accessibility support
    
    Usage Examples:
    
    <!-- Basic buttons -->
    <Button label="Save" />
    <Button variant="outline" label="Cancel" />
    <Button variant="danger" label="Delete" />
    
    <!-- With icons -->
    <Button prepend-icon="plus" label="Add Item" />
    <Button append-icon="search" label="Search" />
    
    <!-- Loading state -->
    <Button :loading="isSubmitting" label="Submit" />
    
    <!-- Sizes -->
    <Button size="sm" label="Small" />
    <Button size="lg" label="Large" />
    
    <!-- Full width -->
    <Button full-width label="Continue" />
    
    <!-- Icon only (ghost variant works well) -->
    <Button variant="ghost" prepend-icon="menu" rounded="full" />
    
    <!-- Slot content -->
    <Button variant="primary">
      <Icon name="star" size="sm" />
      Custom Content
    </Button>
*/

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'button' | 'submit' | 'reset'
type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'full'

interface ButtonProps {
    variant?: ButtonVariant
    size?: ButtonSize
    type?: ButtonType
    rounded?: RoundedSize
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    prependIcon?: string
    appendIcon?: string
    label?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    rounded: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    prependIcon: '',
    appendIcon: '',
    label: ''
})

// Variant styles with hover, active, focus states
const variantMap: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500 shadow-sm',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm'
}

// Size classes (padding, text size, icon size)
const sizeMap: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
    xl: 'px-6 py-3.5 text-xl'
}

// Icon sizes mapped to button sizes
const iconSizeMap: Record<ButtonSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> = {
    xs: 'xs',
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg'
}

// Rounded corner options
const roundedMap: Record<RoundedSize, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
}

const variantClass = computed(() => variantMap[props.variant])
const sizeClass = computed(() => sizeMap[props.size])
const roundedClass = computed(() => roundedMap[props.rounded])
const iconSize = computed(() => iconSizeMap[props.size])

// Text class for consistent typography
const textClass = computed(() => {
    return 'font-medium leading-none'
})
</script>
