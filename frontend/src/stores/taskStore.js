import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios.js';
import { useToastStore } from './toastStore.js';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Search, filter, sort state
  const searchQuery = ref('');
  const filterPriority = ref('all');
  const sortBy = ref('created_at'); // 'created_at' | 'due_date' | 'priority'
  const currentPage = ref(1);
  const pageSize = 20;

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  function applyFiltersAndSort(list) {
    let result = [...list];
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    if (filterPriority.value !== 'all') {
      result = result.filter(t => t.priority === filterPriority.value);
    }
    result.sort((a, b) => {
      if (sortBy.value === 'priority') {
        return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
      }
      if (sortBy.value === 'due_date') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      // default: created_at desc
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return result;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isOverdue(task) {
    if (!task.due_date || task.status === 'done') return false;
    return new Date(task.due_date) < today;
  }

  const filteredTasks = computed(() => applyFiltersAndSort(tasks.value));
  const todoTasks  = computed(() => applyFiltersAndSort(tasks.value.filter(t => t.status === 'todo')));
  const doingTasks = computed(() => applyFiltersAndSort(tasks.value.filter(t => t.status === 'doing')));
  const doneTasks  = computed(() => applyFiltersAndSort(tasks.value.filter(t => t.status === 'done')));

  const overdueCount = computed(() => tasks.value.filter(isOverdue).length);
  const totalCount   = computed(() => tasks.value.length);
  const doneCount    = computed(() => tasks.value.filter(t => t.status === 'done').length);
  const doingCount   = computed(() => tasks.value.filter(t => t.status === 'doing').length);
  const progressPercent = computed(() => totalCount.value === 0 ? 0 : Math.round((doneCount.value / totalCount.value) * 100));

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/tasks');
      tasks.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch tasks.';
    } finally {
      loading.value = false;
    }
  }

  async function createTask(payload) {
    const toast = useToastStore();
    await api.post('/tasks', payload);
    await fetchTasks();
    toast.success('Task created successfully!');
  }

  async function updateTask(id, payload) {
    const toast = useToastStore();
    await api.patch(`/tasks/${id}`, payload);
    await fetchTasks();
    toast.success('Task updated!');
  }

  async function deleteTask(id) {
    const toast = useToastStore();
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
    toast.success('Task deleted.');
  }

  return {
    tasks, loading, error,
    searchQuery, filterPriority, sortBy, currentPage, pageSize,
    filteredTasks, todoTasks, doingTasks, doneTasks,
    overdueCount, totalCount, doneCount, doingCount, progressPercent,
    isOverdue,
    fetchTasks, createTask, updateTask, deleteTask
  };
});
