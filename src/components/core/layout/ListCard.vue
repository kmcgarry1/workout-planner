<template>
    <div
        :class="containerClasses"
        v-bind="attrsNoClass"
        @click="emitClick"
        role="button"
        :aria-pressed="false"
    >
        <!-- Prepend (image or icon or slot) -->
        <div v-if="hasPrepend || leadingSrc || leadingIcon" :class="leadingClasses">
            <slot name="prepend">
                <img
                    v-if="leadingSrc"
                    :src="leadingSrc"
                    :alt="leadingAlt"
                    :class="leadingImgClasses"
                />
                <Icon
                    v-else-if="leadingIcon"
                    :name="leadingIcon"
                    :size="leadingSizeMap[leadingSize]"
                    :variant="leadingIconVariant"
                    class="text-current"
                />
            </slot>
        </div>

        <!-- Middle content: title and optional subtitle (slots or props) -->
        <div :class="contentClasses">
            <slot name="title">
                <Text v-if="title" variant="title" :class="titleClass">{{ title }}</Text>
            </slot>

            <slot name="subtitle">
                <Text v-if="subtitle" variant="subtitle" :class="subtitleClass">{{ subtitle }}</Text>
            </slot>
        </div>

        <!-- Append (icon or slot) -->
        <div v-if="hasAppend || trailingIcon" :class="trailingClasses">
            <slot name="append">
                <Icon
                    v-if="trailingIcon"
                    :name="trailingIcon"
                    :size="trailingSizeMap[trailingSize]"
                    :variant="trailingIconVariant"
                    class="text-current"
                />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlots, useAttrs } from 'vue'
import { Icon, Text } from '../basics'

type IconSizeOption = 'xs' | 'sm' | 'md' | 'lg'
type IconVariantOption = 'outline' | 'fill' | 'flat' | 'ghost'

const props = defineProps({
    title: { type: String, required: false },
    subtitle: { type: String, required: false },
    leadingSrc: { type: String, required: false },
    leadingAlt: { type: String, required: false, default: '' },
    leadingIcon: { type: String, required: false },
    leadingIconVariant: {
        type: String as () => IconVariantOption,
        required: false,
        default: 'flat'
    },
    leadingSize: {
        type: String as () => IconSizeOption,
        default: 'md'
    },
    trailingIcon: { type: String, required: false },
    trailingIconVariant: {
        type: String as () => IconVariantOption,
        required: false,
        default: 'flat'
    },
    trailingSize: {
        type: String as () => IconSizeOption,
        default: 'md'
    },
    padding: {
        type: String as () => 'none' | 'sm' | 'md' | 'lg',
        default: 'md'
    },
    rounded: {
        type: String as () => 'none' | 'sm' | 'md' | 'lg' | 'xl',
        default: 'md'
    },
    bgClass: { type: String, default: 'bg-white' },
    divider: { type: Boolean, default: false },
    hoverable: { type: Boolean, default: true },
    gapClass: { type: String, default: 'gap-4' }
})

const emit = defineEmits<{
    (e: 'click'): void
}>()

const slots = useSlots()
const attrs = useAttrs()

const hasPrepend = computed(() => !!slots.prepend)
const hasAppend = computed(() => !!slots.append)

const paddingMap: Record<string, string> = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-3 md:p-4',
    lg: 'p-4 md:p-6'
}

const roundedMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
}

const leadingSizeMap: Record<IconSizeOption, IconSizeOption> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg'
}

const trailingSizeMap: Record<IconSizeOption, IconSizeOption> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg'
}

const containerClasses = computed(() => {
    const base = [
        'flex',
        'items-center',
        'w-full',
        paddingMap[props.padding],
        roundedMap[props.rounded],
        props.bgClass,
        props.gapClass,
        props.divider ? 'border-b border-gray-200' : '',
        props.hoverable ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'
    ]
    return base.filter(Boolean).join(' ')
})

const leadingClasses = computed(() => {
    return ['flex-none', 'inline-flex', 'items-center', 'justify-center']
        .concat(sizeToTailwind(props.leadingSize))
        .join(' ')
})

const trailingClasses = computed(() => {
    return ['flex-none', 'inline-flex', 'items-center', 'justify-center']
        .concat(sizeToTailwind(props.trailingSize))
        .join(' ')
})

const contentClasses = computed(() => {
    return ['flex-1', 'min-w-0', 'truncate']
})

const titleClass = computed(() => {
    return 'truncate'
})

const subtitleClass = computed(() => {
    return 'text-gray-500 truncate text-sm'
})

const leadingImgClasses = computed(() => {
    // ensure consistent sizing for images
    const sizes = {
        xs: 'w-5 h-5',
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    }
    return ['object-cover', 'rounded-full', sizes[props.leadingSize]].join(' ')
})

// helper to convert size to tailwind spacing for wrappers
function sizeToTailwind(size: IconSizeOption) {
    switch (size) {
        case 'xs':
            return ['w-6', 'h-6']
        case 'sm':
            return ['w-8', 'h-8']
        case 'md':
            return ['w-10', 'h-10']
        case 'lg':
            return ['w-12', 'h-12']
        default:
            return ['w-10', 'h-10']
    }
}

// forward attrs but exclude class so classes are controlled by computed
const attrsNoClass = computed(() => {
    const { class: _c, ...rest } = attrs as Record<string, unknown>
    return rest
})

function emitClick() {
    // only emit click if hoverable to avoid accidental semantics
    emit('click')
}
</script>
