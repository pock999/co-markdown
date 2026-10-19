import { DocumentDao } from '../daos/document.dao.js';
import { DocumentEntity } from '../types/entitys/document.entity.js';

export class DocumentService {
  private documentDao = new DocumentDao();
  async getAllDocuments(): Promise<Array<DocumentEntity>> {
    return this.documentDao.findAll();
  }
  async getDocumentById(id: string): Promise<DocumentEntity | null> {
    return this.documentDao.findById(id);
  }
  async createDocument(userId: string, data: {
    name: string;
    description: string | null;
    allowGuestEdit: boolean;
  }): Promise<DocumentEntity> {

    // 預設名稱
    const name = data.name.trim() || 'Default';

    return this.documentDao.create(userId, {
      ...data,
      name,
    });
  }

  async updateDocumentMetadata(id: string, data: {
    name?: string;
    description?: string | null;
  }): Promise<DocumentEntity | null> {
    return this.documentDao.updateMetadata(id, data);
  }
}