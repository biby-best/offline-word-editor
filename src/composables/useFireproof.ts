import { onUnmounted, ref } from 'vue';

import { fireproof } from '@fireproof/core';

/**
 * Custom composable for using Fireproof in Vue components
 * @param dbName The name of the database
 */
export function useFireproof(dbName: string) {
  // Create or open the database
  const db = fireproof(dbName);
  
  // Reactive state
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Subscribe to database changes
  const unsubscribe = db.subscribe(() => {
    // You can add custom logic here if needed when the database changes
    console.log('Database updated');
  });
  
  // Clean up subscription when component is unmounted
  onUnmounted(() => {
    unsubscribe();
  });
  
  // General query function
  const query = async (mapFn: string, options = {}) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const result = await db.query(mapFn, options);
      return result;
    } catch (err) {
      console.error('Fireproof query error:', err);
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    db,
    isLoading,
    error,
    query
  };
}