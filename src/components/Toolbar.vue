<template>
    <div class="bg-white shadow-sm p-4 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-4">
        <input
          v-model="localTitle"
          @blur="updateTitle"
          @keydown.enter="$event.target.blur()"
          type="text"
          class="text-xl font-semibold border-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-w-[200px]"
          placeholder="Document Title"
          :disabled="!document"
        />
        
        <span v-if="document" class="text-sm text-gray-500">
          Last updated: {{ formatDate(document.updatedAt) }}
        </span>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="save" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!document || !hasChanged || saving"
        >
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        
        <export-button :document="document" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Document } from '@/models/Document';
  import ExportButton from './ExportButton.vue';
  
  const props = defineProps<{
    document: Document | null;
    saving: boolean;
    hasChanged: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'save'): void;
    (e: 'update:title', value: string): void;
  }>();
  
  const localTitle = ref('');
  
  // Update local title when document changes
  watch(() => props.document?.title, (newTitle) => {
    if (newTitle) {
      localTitle.value = newTitle;
    }
  }, { immediate: true });
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Update title
  const updateTitle = () => {
    if (props.document && localTitle.value !== props.document.title) {
      emit('update:title', localTitle.value);
    }
  };
  
  // Save document
  const save = () => {
    emit('save');
  };
  </script>