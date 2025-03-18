<template>
    <div>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">Welcome to Word Editor PWA</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          An offline-first word editor that allows you to create, edit, and export documents even when you're offline.
          Your documents are securely stored locally and sync when you're back online.
        </p>
      </div>
      
      <div class="max-w-3xl mx-auto">
        <document-list
          :documents="documentStore.documentList"
          :loading="documentStore.isLoading"
          :error="documentStore.error"
          @select="openDocument"
          @delete="deleteDocument"
          @create="createNewDocument"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDocumentStore } from '@/stores/documentStore';
  import DocumentList from '@/components/DocumentList.vue';
  
  const router = useRouter();
  const documentStore = useDocumentStore();
  
  // Fetch documents when the component is mounted
  onMounted(() => {
    documentStore.fetchDocuments();
  });
  
  // Navigate to the editor view for a specific document
  const openDocument = (id: string) => {
    router.push({ name: 'editor', params: { id } });
  };
  
  // Create a new document and navigate to the editor
  const createNewDocument = async () => {
    documentStore.createNewDocument();
    router.push({ name: 'editor' });
  };
  
  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      await documentStore.removeDocument(id);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  </script>