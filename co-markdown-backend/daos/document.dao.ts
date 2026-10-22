import { AppDataSource } from '../config/data-source.js';
import { DocumentEntity } from '../types/entitys/document.entity.js';

export class DocumentDao {
  private documentRepository = AppDataSource.getRepository(DocumentEntity);

  async findAll(): Promise<Array<DocumentEntity>> {

    const selectColumns = this.documentRepository.metadata.columns
      .map(col => col.propertyName)
      .filter(name => name !== 'content');

    return this.documentRepository.find({
      select: {
        ...Object.fromEntries(
          selectColumns.map(name => [name, true]),
        ),
      },
      // where: {}
    });
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    return this.documentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(userId: string, data: {
    name: string;
    description: string | null;
    allowGuestEdit: boolean;
  }): Promise<DocumentEntity> {
    const newDoc = this.documentRepository.create({
      ownerId: userId,
      ...data,
      content: '',
    });
    return this.documentRepository.save(newDoc);
  }

  async updateMetadata(id: string, data: {
    name?: string;
    description?: string | null | undefined;
  }): Promise<DocumentEntity | null> {
    const doc = await this.documentRepository.findOne({
      where: {
        id,
      },
    });

    if (!doc) {
      return null;
    }

    if (data.name !== undefined) {
      doc.name = data.name;
    }

    if (data.description !== undefined && data.description !== null) {
      doc.description = data.description;
    }

    return this.documentRepository.save(doc);
  }
}