<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
    :class="[
      taskStore.isOverdue(task)
        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20'
        : 'border-gray-200 dark:border-slate-700',
    ]"
  >
    <div class="flex items-start justify-between gap-2">
      <h3
        class="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug flex-1"
      >
        {{ task.title }}
      </h3>
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
        :class="priorityClasses"
      >
        {{ task.priority }}
      </span>
    </div>

    <!-- Overdue badge -->
    <span
      v-if="taskStore.isOverdue(task)"
      class="self-start text-xs font-semibold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full"
    >
      ⚠ Overdue
    </span>

    <!-- Description toggle -->
    <div v-if="task.description">
      <button
        @click="showDesc = !showDesc"
        class="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 transition-transform"
          :class="showDesc ? 'rotate-90' : ''"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
        {{ showDesc ? "Hide" : "Show" }} description
      </button>
      <p v-if="showDesc" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ task.description }}
      </p>
    </div>

    <!-- Tags -->
    <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-1">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
      >
        #{{ tag }}
      </span>
    </div>

    <div
      v-if="task.due_date"
      class="text-xs flex items-center gap-1"
      :class="
        taskStore.isOverdue(task)
          ? 'text-red-500 dark:text-red-400'
          : 'text-gray-400 dark:text-gray-500'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {{ formatDate(task.due_date) }}
    </div>

    <div class="flex items-center gap-2 mt-1 flex-wrap">
      <button
        @click="$emit('edit-task', task)"
        class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg px-3 py-1.5 transition-colors"
      >
        Edit
      </button>
      <button
        @click="showConfirm = true"
        class="text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold rounded-lg px-3 py-1.5 transition-colors"
      >
        Delete
      </button>
      <button
        v-if="nextStatus"
        @click="handleMove"
        class="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold rounded-lg px-3 py-1.5 transition-colors ml-auto"
      >
        Move →
      </button>
    </div>
  </div>

  <ConfirmModal
    v-if="showConfirm"
    title="Delete Task"
    :message="`Are you sure you want to delete &quot;${task.title}&quot;?`"
    @confirm="onConfirmDelete"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import { useTaskStore } from "../stores/taskStore.js";
import ConfirmModal from "./ConfirmModal.vue";

const props = defineProps({ task: Object });
defineEmits(["edit-task"]);

const taskStore = useTaskStore();
const showDesc = ref(false);
const showConfirm = ref(false);

const priorityClasses = computed(() => {
  const map = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  };
  return map[props.task.priority] || "bg-gray-100 text-gray-700";
});

const nextStatus = computed(() => {
  const map = { todo: "doing", doing: "done" };
  return map[props.task.status] || null;
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function onConfirmDelete(confirmed) {
  showConfirm.value = false;
  if (confirmed) await taskStore.deleteTask(props.task.id);
}

async function handleMove() {
  if (nextStatus.value) {
    await taskStore.updateTask(props.task.id, { status: nextStatus.value });
  }
}
</script>
