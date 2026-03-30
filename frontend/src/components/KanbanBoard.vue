<template>
  <div>
    <!-- Search / Filter / Sort toolbar -->
    <div class="mb-6 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
          />
        </svg>
        <input
          v-model="taskStore.searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        v-model="taskStore.filterPriority"
        class="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All priorities</option>
        <option value="high">&#x1F534; High</option>
        <option value="medium">&#x1F7E1; Medium</option>
        <option value="low">&#x1F7E2; Low</option>
      </select>
      <select
        v-model="taskStore.sortBy"
        class="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="created_at">Sort: Newest</option>
        <option value="due_date">Sort: Due Date</option>
        <option value="priority">Sort: Priority</option>
      </select>
    </div>

    <!-- Kanban columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn
        title="To Do"
        color="blue"
        status="todo"
        :tasks="taskStore.todoTasks"
        @edit-task="handleEditTask"
        @open-create="$emit('open-create-modal')"
      />
      <KanbanColumn
        title="Doing"
        color="orange"
        status="doing"
        :tasks="taskStore.doingTasks"
        @edit-task="handleEditTask"
        @open-create="$emit('open-create-modal')"
      />
      <KanbanColumn
        title="Done"
        color="green"
        status="done"
        :tasks="taskStore.doneTasks"
        @edit-task="handleEditTask"
        @open-create="$emit('open-create-modal')"
      />
    </div>
  </div>

  <TaskModal
    v-if="editingTask"
    mode="edit"
    :task="editingTask"
    @close="editingTask = null"
  />
</template>

<script setup>
import { ref } from "vue";
import KanbanColumn from "./KanbanColumn.vue";
import TaskModal from "./TaskModal.vue";
import { useTaskStore } from "../stores/taskStore.js";

defineEmits(["open-create-modal"]);

const taskStore = useTaskStore();
const editingTask = ref(null);

function handleEditTask(task) {
  editingTask.value = task;
}
</script>
