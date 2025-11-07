<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Workout Planner
        </h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <HelloWorld msg="Welcome to your Vue 3 + TypeScript + Tailwind CSS App!" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom styles can be added here if needed */
</style>
