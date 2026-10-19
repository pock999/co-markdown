import { type Request, type Response, Router } from 'express';
import { DocumentService } from '../services/document.service.js';
import { HttpCode } from '../../shared/http-code.constant.js';
// import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';

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
  async getDocumentById() { }
  async createDocument(req: Request, res: Response) {
    console.log(req, res);
    // const {

    // } = req.body;

    // this.documentService.createDocument();

  }
  async updateDocumentMetadata() { }
}

const DocumentRouter = Router();
const documentController = new DocumentController();

DocumentRouter.get('/', documentController.getDocuments.bind(documentController));
DocumentRouter.get('/:id', documentController.getDocumentById.bind(documentController));
DocumentRouter.post('/', documentController.createDocument.bind(documentController));
DocumentRouter.patch('/:id', documentController.updateDocumentMetadata.bind(documentController));

export default DocumentRouter;