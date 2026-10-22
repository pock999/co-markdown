import { type Request, type Response, Router } from 'express';
import { DocumentService } from '../services/document.service.js';
import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { identifyUserMiddleware } from '../middlewares/identify-user.middleware.js';

import { getDocumentByIdSchema, createDocumentSchema, updateDocumentMetadataSchema } from '../schemas/document.schema.js';

export class DocumentController {
  private documentService = new DocumentService();
  async getDocuments(req: Request, res: Response) {
    console.log('log getDocuments');
    console.debug('debug getDocuments');
    const data = await this.documentService.getAllDocuments();

    return ResponseUtils.sendResponse(res, {
      message: 'Documents retrieved successfully',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data,
    });
  }
  async getDocumentById(req: Request, res: Response) {
    console.log('log getDocumentById');
    console.debug('debug getDocumentById');
    const parseResult = getDocumentByIdSchema.safeParse(req.getData());

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return ResponseUtils.sendResponse(res, {
        message: 'Validation failed',
        code: ErrorCode.BAD_REQUEST,
        httpStatus: HttpCode.BAD_REQUEST,
        data: errors,
      });
    }

    const {
      id,
    } = parseResult.data;

    const data = await this.documentService.getDocumentById(id);

    if (!data) {
      return ResponseUtils.sendResponse(res, {
        message: 'Document not found',
        code: ErrorCode.RESOURCE_NOT_FOUND,
        httpStatus: HttpCode.NOT_FOUND,
        data: null,
      });
    }

    return ResponseUtils.sendResponse(res, {
      message: 'Document retrieved successfully',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data,
    });
  }
  async createDocument(req: Request, res: Response) {
    if (!req.user) {
      return ResponseUtils.sendResponse(res, {
        message: 'Unauthorized',
        code: ErrorCode.AUTHENTICATION_REQUIRED,
        httpStatus: HttpCode.UNAUTHORIZED,
        data: null,
      });
    }

    const parseResult = createDocumentSchema.safeParse(req.getData());

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return ResponseUtils.sendResponse(res, {
        message: 'Validation failed',
        code: ErrorCode.BAD_REQUEST,
        httpStatus: HttpCode.BAD_REQUEST,
        data: errors,
      });
    }

    const {
      name,
      description,
    } = parseResult.data;

    const { id: userId } = req.user;
    // TODO:
    const allowGuestEdit = false;

    const data = await this.documentService.createDocument(userId, {
      name, description, allowGuestEdit,
    });

    return ResponseUtils.sendResponse(res, {
      message: 'Document Create successfully',
      code: 'OK',
      httpStatus: HttpCode.CREATED,
      data,
    });
  }
  async updateDocumentMetadata(req: Request, res: Response) {
    // TODO: 目前不考慮 allowGuestEdit

    const parseResult = updateDocumentMetadataSchema.safeParse(req.getData());

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return ResponseUtils.sendResponse(res, {
        message: 'Validation failed',
        code: ErrorCode.BAD_REQUEST,
        httpStatus: HttpCode.BAD_REQUEST,
        data: errors,
      });
    }

    const isUser = !!req.user;

    const {
      id,
      name,
      description,
    } = parseResult.data;

    const data = await this.documentService.updateDocumentMetadata(isUser, id, {
      name, description,
    });

    if (!data) {
      return ResponseUtils.sendResponse(res, {
        message: 'Document not found',
        code: ErrorCode.RESOURCE_NOT_FOUND,
        httpStatus: HttpCode.NOT_FOUND,
        data: null,
      });
    }

    return ResponseUtils.sendResponse(res, {
      message: 'Document Update Metadata successfully',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data,
    });
  }
}

const DocumentRouter = Router();
const documentController = new DocumentController();

DocumentRouter.get('/', documentController.getDocuments.bind(documentController));
DocumentRouter.get('/:id', documentController.getDocumentById.bind(documentController));
DocumentRouter.post('/', authMiddleware, documentController.createDocument.bind(documentController));
DocumentRouter.patch('/:id', identifyUserMiddleware, documentController.updateDocumentMetadata.bind(documentController));

export default DocumentRouter;