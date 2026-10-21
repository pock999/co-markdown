import { type Request, type Response, Router } from 'express';
import { DocumentService } from '../services/document.service.js';
import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export class DocumentController {
  private documentService = new DocumentService();
  async getDocuments(req: Request, res: Response) {
    const data = await this.documentService.getAllDocuments();

    return ResponseUtils.sendResponse(res, {
      message: 'Documents retrieved successfully',
      code: 'OK',
      httpStatus: HttpCode.OK,
      data,
    });
  }
  async getDocumentById(req: Request, res: Response) {
    const {
      id,
    } = req.getData() as { id: string };

    const data = this.documentService.getDocumentById(id);

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

    const {
      name,
      description,
    } = req.getData() as {
      name: string;
      description: string | null;
    };

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

    const {
      id,
      name,
      description,
    } = req.getData() as {
      id: string
      name: string;
      description: string | null;
    };

    const data = await this.documentService.updateDocumentMetadata(id, {
      name, description,
    });

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
DocumentRouter.patch('/:id', documentController.updateDocumentMetadata.bind(documentController));

export default DocumentRouter;