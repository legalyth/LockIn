<template>
  <nav
  <nav class="bg-slate-800 dark:bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-2">
      <router-link to="/dashboard" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text-xl font-bold tracking-tight">Lock-In</span>
      </router-link>
    </div>

    <div class="flex items-center gap-2">
      <button @click="$emit('open-create-modal')" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-3 sm:px-4 py-2 text-sm transition-colors">
        <span class="hidden sm:inline">+ New Task</span>
        <span class="sm:hidden">+</span>
      </button>

      <!-- Dark mode toggle -->
      <button
        @click="themeStore.toggle()"
        class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <svg v-if="themeStore.isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-6.07l-.707.707M7.636 17.364l-.707.707M17.364 17.364l.707.707M6.343 6.343l.707-.707M12 5a7 7 0 100 14A7 7 0 0012 5z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        </svg>
      </button>

      <!-- Profile link -->
      <router-link to="/profile" class="flex items-center gap-2 border-l border-slate-600 pl-2 group">
        <div class="w-7 h-7 bg-blue-500 group-hover:bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-colors">
          {{ authStore.username?.charAt(0) }}
        </div>
        <span class="text-slate-300 text-sm font-medium hidden sm:block group-hover:text-white transition-colors">{{ authStore.username }}</span>
      </router-link>

      <button @click="authStore.logout()" class="bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg px-3 sm:px-4 py-2 text-sm transition-colors">
        <span class="hidden sm:inline">Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore.js';
import { useThemeStore } from '../stores/themeStore.js';

defineEmits(['open-create-modal']);

const authStore = useAuthStore();
const themeStore = useThemeStore();
</script>
