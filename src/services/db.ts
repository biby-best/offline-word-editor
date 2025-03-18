import { type Document, type DocumentListItem } from '../models/Document';

import { fireproof } from '@fireproof/core';

// Initialize Fireproof database
const db = fireproof('word-editor-pwa');

// Create a new document
export const createDocument = async (document: Omit<Document, '_id'>): Promise<string> => {
  const response = await db.put(document);
  return response.id;
};

// Get a document by ID
export const getDocument = async (id: string): Promise<Document> => {
  const document = await db.get<Document>(id);
  return document;
};

// Update a document
export const updateDocument = async (document: Document): Promise<void> => {
  if (!document._id) {
    throw new Error('Document ID is required for updates');
  }
  await db.put(document);
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  await db.del(id);
};

// Get all documents
export const getAllDocuments = async (): Promise<DocumentListItem[]> => {
  const result = await db.query('updatedAt', { descending: true, includeDocs: true });
  
  return result.rows.map(row => {
    const doc = row.doc as Document;
    return {
      _id: doc._id as string,
      title: doc.title,
      updatedAt: new Date(doc.updatedAt)
    };
  });
};

// Create an index for the documents by updatedAt field
// db.use({
//   name: 'updatedAt',
//   mapFn: (doc) => {
//     if (doc.updatedAt) {
//       return doc.updatedAt;
//     }
//   }
// });

export { db };