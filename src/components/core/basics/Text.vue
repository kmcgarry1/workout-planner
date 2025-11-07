<template>
    <component :is="tagToUse" :class="classes" v-bind="$attrs">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/*
    Text.vue
    - Typography component with semantic variants
    - Auto-maps variants to HTML tags (h1/h2/h3/h4/p/small)
    - Responsive text sizing by default
    
    Usage Examples:
    
    <!-- Basic variants -->
    <Text variant="header">Main Heading</Text>
    <Text variant="title">Section Title</Text>
    <Text variant="body">Body text content</Text>
    <Text variant="footer">Small print text</Text>
    
    <!-- With custom styling -->
    <Text variant="title" color-class="text-blue-600" weight="bold">
      Colored Title
    </Text>
    
    <!-- Text alignment -->
    <Text variant="body" align="center">Centered text</Text>
    
    <!-- Truncate long text -->
    <Text variant="body" :truncate="true">
      This very long text will be truncated with ellipsis...
    </Text>
    
    <!-- Override HTML tag -->
    <Text variant="body" tag="div">Body styled div</Text>
*/

type TextVariant = 'header' | 'subheader' | 'title' | 'subtitle' | 'body' | 'footer'
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
type TextAlign = 'left' | 'center' | 'right' | 'justify'

interface TextProps {
    variant?: TextVariant
    tag?: string
    colorClass?: string
    weight?: TextWeight | ''
    align?: TextAlign | ''
    truncate?: boolean
}

const props = withDefaults(defineProps<TextProps>(), {
    variant: 'body',
    tag: '',
    colorClass: '',
    weight: '',
    align: '',
    truncate: false
})

const variantTag: Record<TextVariant, string> = {
    header: 'h1',
    subheader: 'h2',
    title: 'h3',
    subtitle: 'h4',
    body: 'p',
    footer: 'small',
}

const variantClasses: Record<TextVariant, string> = {
    header: 'text-4xl md:text-5xl font-extrabold leading-tight',
    subheader: 'text-2xl md:text-3xl font-bold leading-tight',
    title: 'text-xl md:text-2xl font-semibold',
    subtitle: 'text-lg md:text-xl font-medium',
    body: 'text-base md:text-lg',
    footer: 'text-sm',
}

const weightMap: Record<TextWeight, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
}

const alignMap: Record<TextAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
}

const tagToUse = computed(() => props.tag || variantTag[props.variant] || 'p')

const classes = computed(() => {
    return [
        variantClasses[props.variant] || variantClasses.body,
        props.colorClass,
        props.weight ? weightMap[props.weight as TextWeight] : '',
        props.align ? alignMap[props.align as TextAlign] : '',
        props.truncate ? 'truncate' : '',
        // Accept additional classes via class binding on the component (they'll be merged by Vue)
    ]
        .filter(Boolean)
        .join(' ')
})
</script>