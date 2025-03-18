<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <router-link to="/" class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Word Editor PWA</h1>
          </router-link>
          <div class="text-sm text-gray-600">
            <span class="mr-2">{{ connectionStatus }}</span>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const connectionStatus = ref('Online');

const updateOnlineStatus = () => {
  connectionStatus.value = navigator.onLine ? 'Online' : 'Offline';
};

onMounted(() => {
  updateOnlineStatus();
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>