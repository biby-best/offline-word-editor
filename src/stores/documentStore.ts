import { createDocument, db, deleteDocument, getAllDocuments, getDocument, updateDocument } from '@/services/db';
import { type Document, type DocumentListItem } from '@/models/Document';

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDocumentStore = defineStore('documents', () => {
  const currentDocument = ref<Document | null>(null);
  const documentList = ref<DocumentListItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Subscribe to changes in the database
  const unsubscribe = db.subscribe(() => {
    fetchDocuments();
  });

  // Fetch all documents
  const fetchDocuments = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      documentList.value = await getAllDocuments();
    } catch (err) {
      console.error('Error fetching documents:', err);
      error.value = '';
    } finally {
      isLoading.value = false;
    }
  };

  // Load a document by ID
  const loadDocument = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      currentDocument.value = await getDocument(id);
    } catch (err) {
      console.error('Error loading document:', err);
      error.value = 'Failed to load document';
      currentDocument.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new document
  const addDocument = async (title: string, content: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const now = new Date();
      const doc: Omit<Document, '_id'> = {
        title,
        content,
        createdAt: now,
        updatedAt: now
      };
      
      const id = await createDocument(doc);
      currentDocument.value = await getDocument(id);
      
      // Refresh the document list
      await fetchDocuments();
      
      return id;
    } catch (err) {
      console.error('Error creating document:', err);
      error.value = 'Failed to create document';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing document
  const saveDocument = async (document: Document) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      document.updatedAt = new Date();
      await updateDocument(document);
      currentDocument.value = document;
      
      // Refresh the document list
      await fetchDocuments();
    } catch (err) {
      console.error('Error saving document:', err);
      error.value = 'Failed to save document';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a document
  const removeDocument = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await deleteDocument(id);
      
      // Clear current document if it's the one being deleted
      if (currentDocument.value && currentDocument.value._id === id) {
        currentDocument.value = null;
      }
      
      // Refresh the document list
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      error.value = 'Failed to delete document';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new empty document in memory (not saved yet)
  const createNewDocument = () => {
    const now = new Date();
    currentDocument.value = {
      title: 'Untitled Document',
      content: '',
      createdAt: now,
      updatedAt: now
    };
  };

  return {
    currentDocument,
    documentList,
    isLoading,
    error,
    fetchDocuments,
    loadDocument,
    addDocument,
    saveDocument,
    removeDocument,
    createNewDocument,
    unsubscribe
  };
});