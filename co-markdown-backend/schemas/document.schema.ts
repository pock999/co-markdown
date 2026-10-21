import { z } from 'zod';

export const getDocumentByIdSchema = z.object({
  id: z.uuid(),
});

export type GetDocumentByIdInput = z.infer<
  typeof getDocumentByIdSchema
>;

export const createDocumentSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).nullable(),
});

export type CreateDocumentInput = z.infer<
  typeof createDocumentSchema
>;


export const updateDocumentMetadataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().min(1).nullable(),
});

export type UpdateDocumentMetadataInput = z.infer<
  typeof updateDocumentMetadataSchema
>;