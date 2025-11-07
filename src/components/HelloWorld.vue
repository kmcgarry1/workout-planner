<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h1 class="text-2xl font-bold text-green-600 mb-4 text-center lg:text-left">
      {{ msg }}
    </h1>
    <p class="text-lg text-gray-700 text-center lg:text-left">
      You've successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener" 
         class="text-blue-600 hover:text-blue-800 underline">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener"
         class="text-blue-600 hover:text-blue-800 underline">Vue 3</a> +
      <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener"
         class="text-blue-600 hover:text-blue-800 underline">TypeScript</a> +
      <a href="https://tailwindcss.com/" target="_blank" rel="noopener"
         class="text-blue-600 hover:text-blue-800 underline">Tailwind CSS</a>
    </p>
  </div>
</template>

<style scoped>
/* Tailwind CSS handles all styling */
</style>
