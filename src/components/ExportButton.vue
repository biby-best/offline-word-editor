<template>
    <button 
      @click="exportDocument" 
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!document"
    >
      Export to Word
    </button>
  </template>
  
  <script setup lang="ts">
  import { Document } from '@/models/Document';
  import { exportToWord } from '@/services/exportService';
  
  const props = defineProps<{
    document: Document | null;
  }>();
  
  const exportDocument = async () => {
    if (!props.document) return;
    
    try {
      await exportToWord(props.document);
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Failed to export document. Please try again.');
    }
  };
  </script>