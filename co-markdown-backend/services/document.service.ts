import { DocumentDao } from '../daos/document.dao.js';
import { DocumentEntity } from '../types/entitys/document.entity.js';
import { AppException } from '../common/exception/app.exception.js';
import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';

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

  async updateDocumentMetadata(isUser: boolean, id: string, data: {
    name?: string;
    description?: string | null | undefined;
  }): Promise<DocumentEntity | null> {
    // 未來 transaction ，可考慮 select for update
    const document = await this.documentDao.findById(id);

    if (!document) {
      return null;
    }

    if (!isUser && !document.allowGuestEdit) {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        HttpCode.FORBIDDEN,
        'Guest cannot edit this document',
      );
    }

    return this.documentDao.updateMetadata(id, data);
  }
}