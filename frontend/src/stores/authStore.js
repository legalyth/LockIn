import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios.js';
import router from '../router/index.js';
import { useToastStore } from './toastStore.js';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'));
  const userId = ref(localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null);
  const username = ref(localStorage.getItem('username'));
  let expiryTimer = null;

  const isAuthenticated = computed(() => token.value !== null);

  function parseTokenExpiry(tkn) {
    try {
      const payload = JSON.parse(atob(tkn.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch { return null; }
  }

  function scheduleExpiryWarning(tkn) {
    if (expiryTimer) clearTimeout(expiryTimer);
    const expiry = parseTokenExpiry(tkn);
    if (!expiry) return;
    const warnAt = expiry - Date.now() - 5 * 60 * 1000; // warn 5 min before expiry
    const logoutAt = expiry - Date.now();
    if (warnAt > 0) {
      expiryTimer = setTimeout(() => {
        useToastStore().info('Your session expires in 5 minutes. Save your work!');
      }, warnAt);
    }
    setTimeout(() => logout(), logoutAt > 0 ? logoutAt : 0);
  }

  // Schedule warning if token already exists on page load
  if (token.value) scheduleExpiryWarning(token.value);

  async function login(email, password, rememberMe = false) {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;

    token.value = data.token;
    userId.value = data.userId;
    username.value = data.username;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', data.token);
    storage.setItem('userId', String(data.userId));
    storage.setItem('username', data.username);
    // Always keep in localStorage for interceptor compatibility
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('username', data.username);

    scheduleExpiryWarning(data.token);
    router.push('/dashboard');
  }

  async function register(usernameVal, email, password) {
    await api.post('/auth/register', { username: usernameVal, email, password });
    router.push('/login');
  }

  async function updateProfile(newUsername, newPassword) {
    const payload = {};
    if (newUsername) payload.username = newUsername;
    if (newPassword) payload.password = newPassword;
    await api.patch('/auth/profile', payload);
    if (newUsername) {
      username.value = newUsername;
      localStorage.setItem('username', newUsername);
    }
  }

  function logout() {
    if (expiryTimer) clearTimeout(expiryTimer);
    token.value = null;
    userId.value = null;
    username.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    sessionStorage.clear();

    router.push('/login');
  }

  return { token, userId, username, isAuthenticated, login, register, logout, updateProfile };
});
