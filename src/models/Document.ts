export interface Document {
  _id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentListItem {
  _id: string;
  title: string;
  updatedAt: Date;
}
