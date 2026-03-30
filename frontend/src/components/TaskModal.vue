<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
    @click.self="$emit('close')"
    @keydown.esc.stop="$emit('close')"
  >
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-slate-800 dark:text-white">
          {{ mode === 'create' ? 'New Task' : 'Edit Task' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4" @keydown.ctrl.enter.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Task title"
            class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <p v-if="titleError" class="text-red-500 text-xs mt-1">{{ titleError }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Optional description"
            class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="form.status" class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select v-model="form.priority" class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
          <input
            v-model="form.due_date"
            type="date"
            class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>

        <!-- Tags input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <div class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
            >
              #{{ tag }}
              <button type="button" @click="removeTag(tag)" class="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200">&times;</button>
            </span>
          </div>
          <input
            v-model="tagInput"
            type="text"
            placeholder="Add tag and press Enter or comma"
            class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter.prevent="addTag"
            @keydown.,="addTag"
          />
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Press Enter or comma to add</p>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="flex-1 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes' }}
          </button>
        </div>
        <p class="text-center text-xs text-gray-400 dark:text-gray-500">Ctrl+Enter to save &bull; Esc to close</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useTaskStore } from '../stores/taskStore.js';

const props = defineProps({
  mode: { type: String, default: 'create' },
  task: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const taskStore = useTaskStore();
const submitting = ref(false);
const titleError = ref('');
const tagInput = ref('');

const form = reactive({
  title: props.task?.title || '',
  description: props.task?.description || '',
  status: props.task?.status || 'todo',
  priority: props.task?.priority || 'medium',
  due_date: props.task?.due_date ? String(props.task.due_date).split('T')[0] : '',
  tags: Array.isArray(props.task?.tags) ? [...props.task.tags] : [],
});

function addTag() {
  const raw = tagInput.value.replace(/,/g, '').trim();
  if (raw && !form.tags.includes(raw)) {
    form.tags.push(raw);
  }
  tagInput.value = '';
}

function removeTag(tag) {
  form.tags = form.tags.filter(t => t !== tag);
}

async function handleSubmit() {
  titleError.value = '';
  if (!form.title.trim()) {
    titleError.value = 'Title is required.';
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      tags: form.tags,
    };

    if (props.mode === 'create') {
      await taskStore.createTask(payload);
    } else {
      await taskStore.updateTask(props.task.id, payload);
    }
    emit('close');
  } catch (err) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
}
</script>
