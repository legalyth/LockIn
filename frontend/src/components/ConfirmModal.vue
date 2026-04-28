<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click.self="$emit('confirm', false)"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 w-full max-w-sm p-6"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-slate-800 dark:text-white">{{ title }}</h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {{ message }}
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          @click="$emit('confirm', false)"
          class="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-semibold rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm', true)"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg py-2 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Delete this task?" },
  message: { type: String, default: "This action cannot be undone." },
});
defineEmits(["confirm"]);
</script>
