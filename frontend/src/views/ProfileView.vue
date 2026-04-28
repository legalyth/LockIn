<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <NavBar @open-create-modal="() => {}" />

    <main class="max-w-lg mx-auto px-4 py-12">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase">
            {{ authStore.username?.charAt(0) }}
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-800 dark:text-white">{{ authStore.username }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Profile settings</p>
          </div>
        </div>

        <form @submit.prevent="handleSave" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              v-model="newUsername"
              type="text"
              :placeholder="authStore.username"
              class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Leave blank to keep current"
                class="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>
            <p v-if="newPassword && newPassword.length < 6" class="text-xs text-red-500 mt-1">Password must be at least 6 characters.</p>
          </div>

          <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 text-sm rounded-lg px-4 py-3">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ errorMessage }}
          </div>

          <div class="flex gap-3 pt-2">
            <router-link to="/dashboard" class="flex-1 text-center border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Back
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useAuthStore } from '../stores/authStore.js';

const authStore = useAuthStore();
const newUsername = ref('');
const newPassword = ref('');
const showPassword = ref(false);
const saving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

async function handleSave() {
  if (!newUsername.value.trim() && !newPassword.value) {
    errorMessage.value = 'Please provide a new username or password.';
    return;
  }
  if (newPassword.value && newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.';
    return;
  }
  saving.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await authStore.updateProfile(
      newUsername.value.trim() || undefined,
      newPassword.value || undefined
    );
    successMessage.value = 'Profile updated successfully!';
    newPassword.value = '';
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Update failed.';
  } finally {
    saving.value = false;
  }
}
</script>
