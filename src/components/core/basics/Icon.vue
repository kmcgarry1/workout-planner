<template>
    <span
        :class="[
            'inline-flex items-center justify-center leading-none select-none shrink-0',
            sizeClass,
            variantClass,
            roundedClass,
            extraClasses
        ]"
        :style="sizeStyle"
        role="img"
        :aria-label="ariaLabel"
        v-bind="attrsNoClass"
    >
        <!-- user-provided SVG/content has priority -->
        <slot v-if="hasDefaultSlot" />

        <!-- built-in icons -->
        <svg
            v-else
            :viewBox="iconViewBox"
            xmlns="http://www.w3.org/2000/svg"
            :fill="svgFill"
            :stroke="svgStroke"
            :stroke-width="stroke"
            :class="['w-full h-full', svgClass]"
            :aria-hidden="ariaLabel ? 'false' : 'true'"
            focusable="false"
        >
            <template v-if="iconPath">
                <path :d="iconPath" stroke-linecap="round" stroke-linejoin="round" />
            </template>

            <!-- fallback: simple square if icon not found -->
            <rect v-else x="4" y="4" width="16" height="16" rx="2" />
        </svg>
    </span>
</template>

<script setup lang="ts">
import { computed, useSlots, useAttrs } from 'vue'

/*
    Icon.vue
    - Vue 3 component with Tailwind-friendly classes
    - Variants: outline, fill, flat, ghost
    - Sizes: xs/sm/md/lg/xl or numeric px
    - Accepts a slot for custom SVG
    - Built-in icon set (simple shapes/paths)

    Usage Examples:
    
    <!-- Basic icon -->
    <Icon name="check" />
    
    <!-- Sized and colored -->
    <Icon name="star" size="lg" color-class="text-yellow-500" />
    
    <!-- Fill variant with background -->
    <Icon name="plus" variant="fill" bg-class="bg-blue-500" />
    
    <!-- Custom rotation and flip -->
    <Icon name="menu" :rotate="90" flip="horizontal" />
    
    <!-- Rounded background -->
    <Icon name="home" variant="fill" rounded="full" bg-class="bg-gray-600" />
    
    <!-- Custom SVG via slot -->
    <Icon size="md">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="..." />
      </svg>
    </Icon>
*/

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
type IconVariant = 'outline' | 'fill' | 'flat' | 'ghost'
type IconFlip = '' | 'horizontal' | 'vertical'

interface IconProps {
    name?: string
    size?: IconSize
    variant?: IconVariant
    colorClass?: string
    bgClass?: string
    stroke?: number | string
    rounded?: boolean | string
    rotate?: number
    flip?: IconFlip
    ariaLabel?: string
    svgClass?: string | string[]
}

const props = withDefaults(defineProps<IconProps>(), {
    name: '',
    size: 'md',
    variant: 'outline',
    colorClass: 'text-current',
    bgClass: '',
    stroke: 2,
    rounded: false,
    rotate: 0,
    flip: '',
    ariaLabel: '',
    svgClass: ''
})

const slots = useSlots()
const attrs = useAttrs()
const hasDefaultSlot = !!slots.default

const attrsNoClass = computed(() => {
    // pass other attrs through but avoid passing class twice
    const { class: _c, ...rest } = attrs
    return rest
})

// simple size map to Tailwind width/height classes
const sizeMap: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
}

const sizeClass = computed(() => {
    if (typeof props.size === 'number') return ''
    return sizeMap[props.size as string] ?? sizeMap.md
})

const sizeStyle = computed((): Record<string, string> => {
    if (typeof props.size === 'number') {
        return { width: `${props.size}px`, height: `${props.size}px` }
    }
    return {}
})

const roundedClass = computed(() => {
    if (!props.rounded) return ''
    if (props.rounded === true) return 'rounded'
    if (props.rounded === 'full') return 'rounded-full'
    return String(props.rounded)
})

const transformClass = computed(() => {
    const classes: string[] = []
    if (props.rotate) classes.push(`transform rotate-[${props.rotate}deg]`) // note: arbitrary values require Tailwind config
    if (props.flip === 'horizontal') classes.push('scale-x-[-1]')
    if (props.flip === 'vertical') classes.push('scale-y-[-1]')
    return classes.join(' ')
})

// Variant classes: rely on provided colorClass and bgClass for safe Tailwind purging.
// Users should pass static Tailwind classes via props for predictable builds.
const variantClass = computed(() => {
    switch (props.variant) {
        case 'fill':
            // colored background + white icon by default
            return `${props.bgClass} ${props.colorClass ? '' : 'text-white'} p-1`
        case 'flat':
            // icon color only, no bg, smaller padding
            return `${props.colorClass} p-0`
        case 'ghost':
            // subtle bg and color
            return `${props.bgClass || ''} ${props.colorClass} p-1`
        case 'outline':
        default:
            // no bg, icon drawn as strokes
            return `${props.colorClass} p-0`
    }
})

const extraClasses = computed(() => transformClass.value)

// determine svg stroke/fill depending on variant
const svgFill = computed(() => (props.variant === 'fill' || props.variant === 'flat' ? 'currentColor' : (props.variant === 'outline' ? 'none' : 'currentColor')))
const svgStroke = computed(() => (props.variant === 'outline' ? 'currentColor' : 'none'))

const stroke = computed(() => props.stroke)

// icon definitions (simple, generic; safe for reuse)
const icons: Record<string, string> = {
    check:
        'M5 13l4 4L19 7',
    x:
        'M6 18L18 6M6 6l12 12',
    menu:
        'M4 6h16M4 12h16M4 18h16',
    search:
        'M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
    home:
        'M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z',
    plus:
        'M12 5v14M5 12h14',
    minus:
        'M5 12h14',
    star:
        'M12 17.3L5.6 20l1.1-6.4L2 9.5l6.6-.9L12 3l3.4 5.6L22 9.5l-4.7 4.1L18.4 20z',
    spinner:
        'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83',
    sun:
        'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
    moon:
        'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
}

const iconPath = computed(() => {
    return props.name && props.name in icons ? icons[props.name] : ''
})

const iconViewBox: string = '0 0 24 24'

const svgClass = props.svgClass

const ariaLabel: string = props.ariaLabel || (props.name ? `icon-${props.name}` : '')
</script>