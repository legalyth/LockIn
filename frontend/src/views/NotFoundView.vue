<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4 text-center"
  >
    <!-- Illustration -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-32 h-32 text-slate-300 dark:text-slate-600 mb-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <h1 class="text-7xl font-black text-slate-800 dark:text-white mb-3">404</h1>
    <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
      Page not found
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
      Looks like this task got lost. The page you're looking for doesn't exist.
    </p>

    <router-link
      to="/dashboard"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
    >
      Go to Dashboard
    </router-link>
  </div>
</template>

<script setup></script>
