<template>
    <div 
        :class="[
            paddingClass,
            spaceClass
        ]"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">

/*
    CardBody.vue
    - Main content area for cards
    - Configurable padding and vertical spacing
    - Automatically spaces child elements
    
    Usage Examples:
    
    <!-- Basic usage -->
    <CardBody>
      <Text variant="body">Card content goes here</Text>
    </CardBody>
    
    <!-- Custom spacing -->
    <CardBody space="lg">
      <Text variant="title">Title</Text>
      <Text variant="body">More breathing room between elements</Text>
    </CardBody>
    
    <!-- Compact padding -->
    <CardBody padding="sm" space="sm">
      <Text variant="subtitle">Compact Layout</Text>
      <Text variant="body">Dense content</Text>
    </CardBody>
    
    <!-- No automatic spacing (manual control) -->
    <CardBody space="none">
      <div class="mb-2">Custom spacing</div>
      <div class="mb-4">Between elements</div>
    </CardBody>
    
    <!-- Mixed content -->
    <CardBody>
      <Text variant="body">Text content</Text>
      <div class="flex gap-2">
        <Icon name="check" />
        <Text variant="footer">With custom elements</Text>
      </div>
    </CardBody>
*/

type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'
type SpaceSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface CardBodyProps {
    padding?: PaddingSize
    space?: SpaceSize
}

const props = withDefaults(defineProps<CardBodyProps>(), {
    padding: 'md',
    space: 'md'
})

const paddingMap: Record<PaddingSize, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-10'
}

const spaceMap: Record<SpaceSize, string> = {
    none: '',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8'
}

const paddingClass = paddingMap[props.padding]
const spaceClass = spaceMap[props.space]
</script>
