<template>
  <div class="editor-view">
    <div v-if="documentStore.isLoading" class="flex justify-center my-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="documentStore.error" class="bg-red-50 text-red-600 p-4 rounded-lg my-4">
      {{ documentStore.error }}
      <button
        @click="router.push('/')"
        class="ml-4 underline text-blue-600 hover:text-blue-800"
      >
        Go back to home
      </button>
    </div>
    
    <template v-else>
      <toolbar
        :document="documentStore.currentDocument"
        :saving="isSaving"
        :has-changed="hasChanges"
        @save="saveDocument"
        @update:title="updateTitle"
      />
      
      <editor
        v-if="documentStore.currentDocument"
        v-model="content"
        @update="markAsChanged"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDocumentStore } from '@/stores/documentStore';
import Editor from '@/components/Editor.vue';
import Toolbar from '@/components/Toolbar.vue';

const route = useRoute();
const router = useRouter();
const documentStore = useDocumentStore();

const content = ref('');
const isSaving = ref(false);
const hasChanges = ref(false);
const originalContent = ref('');

// Load document when the component is mounted or the route changes
onMounted(async () => {
  const id = route.params.id as string | undefined;
  
  if (id) {
    // Load existing document
    try {
      await documentStore.loadDocument(id);
      if (documentStore.currentDocument) {
        content.value = documentStore.currentDocument.content;
        originalContent.value = documentStore.currentDocument.content;
      }
    } catch (error) {
      console.error('Error loading document:', error);
    }
  } else {
    // Create new document
    documentStore.createNewDocument();
    if (documentStore.currentDocument) {
      content.value = documentStore.currentDocument.content;
      originalContent.value = documentStore.currentDocument.content;
    }
  }
});

// Watch for document changes from the store
watch(() => documentStore.currentDocument, (newDoc) => {
  if (newDoc) {
    content.value = newDoc.content;
    originalContent.value = newDoc.content;
    hasChanges.value = false;
  }
});

// Computed property to check if the document is new
const isNewDocument = computed(() => {
  return documentStore.currentDocument && !documentStore.currentDocument._id;
});

// Mark the document as changed
const markAsChanged = (newContent: string) => {
  content.value = newContent;
  hasChanges.value = content.value !== originalContent.value;
};

// Update document title
const updateTitle = (newTitle: string) => {
  if (documentStore.currentDocument) {
    documentStore.currentDocument.title = newTitle;
    hasChanges.value = true;
  }
};

// Save the document
const saveDocument = async () => {
  if (!documentStore.currentDocument) return;
  
  try {
    isSaving.value = true;
    const doc = { ...documentStore.currentDocument, content: content.value };
    
    if (isNewDocument.value) {
      // Save new document
      const id = await documentStore.addDocument(doc.title, content.value);
      router.replace({ name: 'editor', params: { id } });
    } else {
      // Update existing document
      await documentStore.saveDocument(doc);
    }
    
    originalContent.value = content.value;
    hasChanges.value = false;
  } catch (error) {
    console.error('Error saving document:', error);
  } finally {
    isSaving.value = false;
  }
};

// Prompt user before leaving if there are unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (hasChanges.value) {
    const message = 'You have unsaved changes. Are you sure you want to leave?';
    e.returnValue = message;
    return message;
  }
});
</script>