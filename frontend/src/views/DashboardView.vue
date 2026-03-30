<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <NavBar @open-create-modal="showModal = true" />

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Summary banner + progress bar -->
      <div
        v-if="!taskStore.loading && taskStore.totalCount > 0"
        class="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4"
      >
        <div class="flex flex-wrap items-center gap-4 mb-3">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            <span class="text-slate-800 dark:text-white font-bold">{{
              taskStore.totalCount
            }}</span>
            total
          </div>
          <div class="text-sm font-medium text-orange-600 dark:text-orange-400">
            <span class="font-bold">{{ taskStore.doingCount }}</span> in
            progress
          </div>
          <div
            v-if="taskStore.overdueCount"
            class="text-sm font-medium text-red-600 dark:text-red-400"
          >
            <span class="font-bold">⚠ {{ taskStore.overdueCount }}</span>
            overdue
          </div>
          <div class="text-sm font-medium text-green-600 dark:text-green-400">
            <span class="font-bold">{{ taskStore.doneCount }}</span> done
          </div>
        </div>
        <!-- Progress bar -->
        <div class="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
          <div
            class="bg-green-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: taskStore.progressPercent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {{ taskStore.progressPercent }}% complete
        </p>
      </div>

      <div
        v-if="taskStore.error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm"
      >
        {{ taskStore.error }}
      </div>

      <KanbanBoard @open-create-modal="showModal = true" />
    </main>

    <TaskModal v-if="showModal" mode="create" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "../components/NavBar.vue";
import KanbanBoard from "../components/KanbanBoard.vue";
import TaskModal from "../components/TaskModal.vue";
import { useTaskStore } from "../stores/taskStore.js";

const taskStore = useTaskStore();
const showModal = ref(false);

onMounted(() => {
  taskStore.fetchTasks();
});
</script>
