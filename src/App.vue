<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { Icon } from './components/core/basics'

// Dark mode state
const isDark = ref(false)

// Initialize dark mode from localStorage or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

// Watch for changes and update DOM + localStorage
watch(isDark, () => {
  updateTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <header class="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-colors duration-200">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Workout Planner
          </h1>
          
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg transition-all duration-200 hover:scale-110
                   bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-gray-700 dark:text-gray-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun Icon (shown in dark mode) -->
            <Icon 
              v-if="isDark"
              name="sun" 
              size="md" 
              color-class="text-yellow-400"
              :aria-hidden="true"
            />
            <!-- Moon Icon (shown in light mode) -->
            <Icon 
              v-else
              name="moon" 
              size="md" 
              color-class="text-indigo-600"
              :aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <HelloWorld msg="Workout Tracking Dashboard" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles can be added here if needed */
</style>
