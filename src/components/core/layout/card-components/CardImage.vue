<template>
    <div 
        :class="[
            'overflow-hidden',
            roundedClass,
            aspectClass
        ]"
    >
        <slot>
            <img
                v-if="src"
                :src="src"
                :alt="alt"
                :class="['w-full h-full', objectFitClass]"
            />
        </slot>
    </div>
</template>

<script setup lang="ts">

/*
    CardImage.vue
    - Image container for cards with aspect ratio control
    - Supports custom content via slot
    - Rounded corner options for card edges
    
    Usage Examples:
    
    <!-- Simple image -->
    <CardImage src="/workout.jpg" alt="Workout" />
    
    <!-- Top of card with rounded top -->
    <CardImage 
      src="/hero.jpg" 
      rounded="top"
      aspect="wide"
    />
    
    <!-- Square aspect ratio -->
    <CardImage 
      src="/profile.jpg" 
      aspect="square"
      rounded="lg"
    />
    
    <!-- Portrait orientation -->
    <CardImage 
      src="/portrait.jpg" 
      aspect="portrait"
      object-fit="contain"
    />
    
    <!-- Custom content via slot -->
    <CardImage aspect="video" rounded="top">
      <picture>
        <source srcset="/image.webp" type="image/webp" />
        <img src="/image.jpg" alt="Responsive" />
      </picture>
    </CardImage>
    
    <!-- Video thumbnail -->
    <CardImage aspect="video">
      <video class="w-full h-full object-cover" poster="/thumb.jpg">
        <source src="/video.mp4" type="video/mp4" />
      </video>
    </CardImage>
*/

type AspectRatio = 'square' | 'video' | 'wide' | 'portrait' | 'none'
type ObjectFit = 'cover' | 'contain' | 'fill' | 'none'
type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'top' | 'bottom'

interface CardImageProps {
    src?: string
    alt?: string
    aspect?: AspectRatio
    objectFit?: ObjectFit
    rounded?: RoundedSize
}

const props = withDefaults(defineProps<CardImageProps>(), {
    src: 'https://via.placeholder.com/400x225',
    alt: '',
    aspect: 'video',
    objectFit: 'cover',
    rounded: 'none'
})

const aspectMap: Record<AspectRatio, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    portrait: 'aspect-[3/4]',
    none: ''
}

const objectFitMap: Record<ObjectFit, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none'
}

const roundedMap: Record<RoundedSize, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    top: 'rounded-t-lg',
    bottom: 'rounded-b-lg'
}

const aspectClass = aspectMap[props.aspect]
const objectFitClass = objectFitMap[props.objectFit]
const roundedClass = roundedMap[props.rounded]
</script>
