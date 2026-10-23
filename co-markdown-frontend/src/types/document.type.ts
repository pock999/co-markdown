export interface Document {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  allowGuestEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentDetail extends Document {
  content: string;
}

export interface CreateDocumentRequest {
  name: string;
  description?: string | null;
}

export interface UpdateDocumentMetadataRequest {
  name: string;
  description: string;
}
