import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  let nextId = 0;

  function add(message, type = 'success', duration = 3000) {
    const id = ++nextId;
    toasts.value.push({ id, message, type });
    setTimeout(() => remove(id), duration);
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  function success(message) { add(message, 'success'); }
  function error(message) { add(message, 'error'); }
  function info(message) { add(message, 'info'); }

  return { toasts, success, error, info, remove };
});
