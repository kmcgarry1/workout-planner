<!--
	Input.vue
	Versatile text input component with variants, sizes, states, optional label, helper text,
	leading/trailing icon slots, and a clearable control.

	Usage examples:
	Basic:
	<Input v-model="name" label="Name" placeholder="Enter name" />

	Filled + helper:
	<Input v-model="email" variant="filled" label="Email" type="email" helper="We'll never share your email." />

	Underline + error state:
	<Input v-model="password" variant="underline" label="Password" type="password" state="error" errorMessage="Min 8 chars" />

	With leading & trailing icon slots:
	<Input v-model="query" placeholder="Search workouts" >
		<template #leading>
			<Icon name="search" variant="flat" size="sm" class="text-gray-400" />
		</template>
		<template #trailing>
			<Icon v-if="query" name="x" variant="flat" size="sm" class="text-gray-400 cursor-pointer" @click="query=''" />
		</template>
	</Input>

	Clearable:
	<Input v-model="notes" label="Notes" clearable />
-->
<template>
	<div :class="wrapperClasses" v-bind="attrsNoClass">
		<!-- Label -->
		<label v-if="label" :for="id" class="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">{{ label }}</label>

		<div :class="innerClasses">
			<!-- Leading icon/slot -->
			<div v-if="hasLeading" class="flex items-center pl-2" :class="leadingClasses">
				<slot name="leading" />
			</div>

			<!-- Input element -->
			<input
				:id="id"
				v-model="localValue"
				:type="type"
				:placeholder="placeholder"
				:disabled="disabled"
				:class="inputClasses"
				@focus="focused = true"
				@blur="focused = false"
				@keydown.enter="emit('enter', localValue)"
			/>

			<!-- Clear button -->
			<button
				v-if="clearable && !!localValue"
				type="button"
				class="flex items-center justify-center ml-1 mr-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				@click="clearValue"
				aria-label="Clear input"
			>
				<Icon name="x" variant="flat" size="sm" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
			</button>

			<!-- Trailing icon/slot -->
			<div v-if="hasTrailing" class="flex items-center pr-2" :class="trailingClasses">
				<slot name="trailing" />
			</div>
		</div>

		<!-- Helper / error messages -->
		<div v-if="helper || (state === 'error' && errorMessage)" class="mt-1 text-xs">
			<p v-if="state === 'error' && errorMessage" class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
			<p v-else class="text-gray-500 dark:text-gray-400">{{ helper }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useSlots, useAttrs } from 'vue'
import { Icon } from './index'

// Props interface
interface InputProps {
	modelValue?: string
	label?: string
	placeholder?: string
	type?: string
	variant?: 'default' | 'filled' | 'underline' | 'unstyled'
	size?: 'sm' | 'md' | 'lg'
	state?: 'default' | 'error' | 'success'
	helper?: string
	errorMessage?: string
	disabled?: boolean
	clearable?: boolean
	id?: string
	wrapperClass?: string
	inputClass?: string
}

const props = withDefaults(defineProps<InputProps>(), {
	modelValue: '',
	type: 'text',
	variant: 'default',
	size: 'md',
	state: 'default',
	disabled: false,
	clearable: false,
	id: undefined,
	wrapperClass: '',
	inputClass: ''
})

const emit = defineEmits<{
	(e: 'update:modelValue', v: string): void
	(e: 'enter', v: string): void
	(e: 'clear'): void
}>()

const slots = useSlots()
const attrs = useAttrs()
const localValue = ref(props.modelValue)
const focused = ref(false)

watch(() => props.modelValue, v => {
	if (v !== localValue.value) localValue.value = v
})

watch(localValue, v => emit('update:modelValue', v))

const hasLeading = computed(() => !!slots.leading)
const hasTrailing = computed(() => !!slots.trailing)

function clearValue() {
	localValue.value = ''
	emit('clear')
}

// Mappings
const sizeMap: Record<'sm'|'md'|'lg', string> = {
	sm: 'text-sm h-8',
	md: 'text-sm h-10',
	lg: 'text-base h-12'
}

const paddingMap: Record<'sm'|'md'|'lg', string> = {
	sm: 'px-2',
	md: 'px-3',
	lg: 'px-4'
}

const variantMap: Record<'default'|'filled'|'underline'|'unstyled', string> = {
	default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
	filled: 'bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
	underline: 'border-b border-gray-300 dark:border-gray-500 focus:border-blue-500 focus:ring-0 bg-transparent rounded-none px-0',
	unstyled: 'border-none focus:ring-0 bg-transparent'
}

const stateMap: Record<'default'|'error'|'success', string> = {
	default: '',
	error: 'border-red-500 focus:border-red-600 focus:ring-red-500',
	success: 'border-green-500 focus:border-green-600 focus:ring-green-500'
}

const wrapperClasses = computed(() => [
	'flex flex-col',
	props.wrapperClass
].filter(Boolean).join(' '))

const innerClasses = computed(() => {
	const base = [
		'flex items-center w-full rounded-md transition-colors duration-150',
		props.variant === 'underline' ? 'border-b' : '',
		props.variant === 'filled' ? 'border' : '',
		props.variant === 'default' ? 'border' : '',
		props.disabled ? 'opacity-60 cursor-not-allowed' : 'focus-within:ring-2'
	].filter(Boolean)
	// Provide a subtle background for wrappers except underline/unstyled
	if (props.variant === 'filled') base.push('bg-gray-100 dark:bg-gray-700')
	if (props.variant === 'default') base.push('bg-white dark:bg-gray-800')
	return base.join(' ')
})

const inputClasses = computed(() => {
	const base: string[] = [
		'flex-1 w-full outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500',
		sizeMap[props.size],
		paddingMap[props.size],
		props.variant === 'underline' ? 'pb-2' : '',
		variantMap[props.variant],
		props.state !== 'default' ? stateMap[props.state] : '',
		props.inputClass
	]
	// Remove border duplication for wrapper-managed variants
	if (props.variant === 'default' || props.variant === 'filled') {
		base.push('border-none focus:ring-0 focus:outline-none')
	}
	return base.filter(Boolean).join(' ')
})

const leadingClasses = computed(() => [
	'text-gray-400 dark:text-gray-500'
].join(' '))

const trailingClasses = computed(() => [
	'text-gray-400 dark:text-gray-500'
].join(' '))

const attrsNoClass = computed(() => {
	const { class: _c, ...rest } = attrs as Record<string, unknown>
	return rest
})
</script>

