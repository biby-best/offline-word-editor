<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Your Documents</h2>
        <button 
          @click="$emit('create')" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          New Document
        </button>
      </div>
      
      <div v-if="loading" class="p-4 text-center">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Loading documents...</p>
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 text-red-600">
        {{ error }}
      </div>
      
      <div v-else-if="documents.length === 0" class="p-6 text-center text-gray-500">
        <p>You don't have any documents yet.</p>
        <button 
          @click="$emit('create')" 
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create your first document
        </button>
      </div>
      
      <ul v-else class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        <li 
          v-for="doc in documents" 
          :key="doc._id" 
          class="p-4 hover:bg-gray-50 cursor-pointer"
        >
          <div class="flex items-center justify-between" @click="$emit('select', doc._id)">
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ doc.title }}</h3>
              <p class="text-xs text-gray-500">Updated: {{ formatDate(doc.updatedAt) }}</p>
            </div>
            <button 
              @click.stop="confirmDelete(doc._id, doc.title)" 
              class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
              title="Delete document"
            >
              🗑️
            </button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { DocumentListItem } from '@/models/Document';
  
  const props = defineProps<{
    documents: DocumentListItem[];
    loading: boolean;
    error: string | null;
  }>();
  
  const emit = defineEmits<{
    (e: 'select', id: string): void;
    (e: 'delete', id: string): void;
    (e: 'create'): void;
  }>();
  
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
  
  // Confirm delete
  const confirmDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      emit('delete', id);
    }
  };
  </script>