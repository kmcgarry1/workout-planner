<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Icon } from "./components/core/basics";

// Dark mode state
const isDark = ref(false);

// Initialize dark mode from localStorage or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  updateTheme();
});

// Watch for changes and update DOM + localStorage
watch(isDark, () => {
  updateTheme();
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
});

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200"
  >
    <header
      class="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <router-link
              to="/"
              class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Workout Planner
            </router-link>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-6">
              <router-link
                to="/"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50':
                    $route.name === 'home',
                }"
              >
                <Icon
                  name="home"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                Dashboard
              </router-link>
              <router-link
                to="/library"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50':
                    $route.name === 'library',
                }"
              >
                <Icon
                  name="star"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                Library
              </router-link>
              <router-link
                to="/history"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50':
                    $route.name === 'history',
                }"
              >
                <Icon
                  name="star"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                History
              </router-link>
              <router-link
                to="/records"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50':
                    $route.name === 'records',
                }"
              >
                <Icon
                  name="star"
                  variant="fill"
                  size="sm"
                  class="inline mr-2"
                />
                Records
              </router-link>
              <router-link
                to="/exercises"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50':
                    $route.name === 'exercises',
                }"
              >
                <Icon
                  name="star"
                  variant="fill"
                  size="sm"
                  class="inline mr-2"
                />
                Exercises
              </router-link>
              <router-link
                to="/builder"
                class="px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="{
                  'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50':
                    $route.name === 'builder' || $route.name === 'edit-workout',
                }"
              >
                <Icon
                  name="plus"
                  variant="flat"
                  size="sm"
                  class="inline mr-2"
                />
                Builder
              </router-link>
            </nav>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg transition-all duration-200 hover:scale-110 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            :aria-label="
              isDark ? 'Switch to light mode' : 'Switch to dark mode'
            "
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

        <!-- Mobile Navigation -->
        <nav
          class="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex justify-around">
            <router-link
              to="/"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              :class="{
                'text-blue-600 dark:text-blue-400': $route.name === 'home',
              }"
            >
              <Icon name="home" variant="flat" size="sm" />
              <span class="text-xs">Home</span>
            </router-link>
            <router-link
              to="/library"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              :class="{
                'text-emerald-600 dark:text-emerald-400':
                  $route.name === 'library',
              }"
            >
              <Icon name="star" variant="flat" size="sm" />
              <span class="text-xs">Library</span>
            </router-link>
            <router-link
              to="/records"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              :class="{
                'text-yellow-600 dark:text-yellow-400':
                  $route.name === 'records',
              }"
            >
              <Icon name="star" variant="fill" size="sm" />
              <span class="text-xs">Records</span>
            </router-link>
            <router-link
              to="/builder"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              :class="{
                'text-indigo-600 dark:text-indigo-400':
                  $route.name === 'builder' || $route.name === 'edit-workout',
              }"
            >
              <Icon name="plus" variant="flat" size="sm" />
              <span class="text-xs">Builder</span>
            </router-link>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles can be added here if needed */
</style>
