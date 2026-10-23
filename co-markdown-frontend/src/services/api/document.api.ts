
import { apiRequest } from './api-client';
import type {
  CreateDocumentRequest,
  Document,
  DocumentDetail,
} from '../../types/document.type';

export function getDocuments(
  token?: string | null,
): Promise<Document[]> {
  return apiRequest<Document[]>('/docs', {
    method: 'GET',
    token,
  });
}

export function getDocument(
  id: string,
  token?: string | null,
): Promise<DocumentDetail> {
  return apiRequest<DocumentDetail>(
    `/docs/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      token,
    },
  );
}

export function createDocument(
  data: CreateDocumentRequest,
  token: string,
): Promise<DocumentDetail> {
  return apiRequest<DocumentDetail>('/docs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    token,
  });
}
