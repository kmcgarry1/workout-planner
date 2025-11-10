<template>
    <div 
        :class="[
            'flex items-center',
            paddingClass,
            justifyClass,
            gapClass,
            divider ? 'border-t border-gray-200 dark:border-gray-700' : '',
            bgClass
        ]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">

/*
    CardActions.vue
    - Card footer for action buttons
    - Flexible layout with justify options
    - Configurable spacing and divider
    
    Usage Examples:
    
    <!-- Standard right-aligned buttons -->
    <CardActions>
      <Button variant="outline" label="Cancel" />
      <Button variant="primary" label="Save" />
    </CardActions>
    
    <!-- Left-aligned -->
    <CardActions justify="start">
      <Button prepend-icon="plus" label="Add" />
    </CardActions>
    
    <!-- Centered -->
    <CardActions justify="center">
      <Button variant="outline" label="Maybe Later" />
      <Button variant="primary" label="Get Started" />
    </CardActions>
    
    <!-- Space between (two groups) -->
    <CardActions justify="between">
      <Button variant="danger" label="Delete" />
      <div class="flex gap-2">
        <Button variant="outline" label="Cancel" />
        <Button variant="primary" label="Save" />
      </div>
    </CardActions>
    
    <!-- Custom background -->
    <CardActions bg-class="bg-gray-50 dark:bg-gray-800">
      <Button label="Action" />
    </CardActions>
    
    <!-- No divider -->
    <CardActions :divider="false">
      <Button full-width label="Continue" />
    </CardActions>
*/

type PaddingSize = 'none' | 'sm' | 'md' | 'lg'
type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around'
type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg'

interface CardActionsProps {
    padding?: PaddingSize
    justify?: JustifyContent
    gap?: GapSize
    divider?: boolean
    bgClass?: string
}

const props = withDefaults(defineProps<CardActionsProps>(), {
    padding: 'md',
    justify: 'end',
    gap: 'sm',
    divider: true,
    bgClass: ''
})

const paddingMap: Record<PaddingSize, string> = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4'
}

const justifyMap: Record<JustifyContent, string> = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around'
}

const gapMap: Record<GapSize, string> = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
}

const paddingClass = paddingMap[props.padding]
const justifyClass = justifyMap[props.justify]
const gapClass = gapMap[props.gap]
</script>
