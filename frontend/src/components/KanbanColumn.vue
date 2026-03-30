<template>
  <div
    class="rounded-xl border p-4 flex flex-col gap-3 min-h-96"
    :class="columnClasses"
  >
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-base font-bold" :class="titleColor">{{ title }}</h2>
      <span
        class="text-xs font-semibold px-2.5 py-1 rounded-full"
        :class="badgeClasses"
        >{{ tasks.length }}</span
      >
    </div>

    <!-- Skeleton loading -->
    <template v-if="taskStore.loading">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 p-4 animate-pulse"
      >
        <div class="h-3 bg-gray-200 dark:bg-slate-500 rounded w-3/4 mb-3"></div>
        <div
          class="h-2 bg-gray-100 dark:bg-slate-600 rounded w-full mb-2"
        ></div>
        <div class="h-2 bg-gray-100 dark:bg-slate-600 rounded w-1/2"></div>
      </div>
    </template>

    <!-- Empty state -->
    <div
      v-else-if="tasks.length === 0"
      class="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-gray-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p class="text-sm italic">No tasks here</p>
      <button
        @click="$emit('open-create')"
        class="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        :class="addBtnClasses"
      >
        + Add a task
      </button>
    </div>

    <!-- Draggable task list -->
    <draggable
      v-else
      v-model="localTasks"
      group="tasks"
      item-key="id"
      class="flex flex-col gap-3"
      ghost-class="opacity-30"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <Transition name="card" appear>
          <TaskCard :task="element" @edit-task="$emit('edit-task', element)" />
        </Transition>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import { useTaskStore } from "../stores/taskStore.js";

const props = defineProps({
  title: String,
  color: String,
  status: String,
  tasks: Array,
});

const emit = defineEmits(["edit-task", "open-create"]);
const taskStore = useTaskStore();

const localTasks = ref([...props.tasks]);
watch(
  () => props.tasks,
  (val) => {
    localTasks.value = [...val];
  },
);

async function onDragEnd(evt) {
  if (evt.from !== evt.to) {
    const task = evt.item?._underlying_vm_;
    if (task && task.status !== props.status) {
      await taskStore.updateTask(task.id, { status: props.status });
    }
  }
}

const columnClasses = computed(() => ({
  "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800":
    props.color === "blue",
  "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800":
    props.color === "orange",
  "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800":
    props.color === "green",
}));

const titleColor = computed(() => ({
  "text-blue-700 dark:text-blue-400": props.color === "blue",
  "text-orange-700 dark:text-orange-400": props.color === "orange",
  "text-green-700 dark:text-green-400": props.color === "green",
}));

const badgeClasses = computed(() => ({
  "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300":
    props.color === "blue",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300":
    props.color === "orange",
  "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300":
    props.color === "green",
}));

const addBtnClasses = computed(() => ({
  "bg-blue-100 hover:bg-blue-200 text-blue-700": props.color === "blue",
  "bg-orange-100 hover:bg-orange-200 text-orange-700": props.color === "orange",
  "bg-green-100 hover:bg-green-200 text-green-700": props.color === "green",
}));
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.25s ease;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
