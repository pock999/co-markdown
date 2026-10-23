import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';
import CreateDocumentDialog from '../components/CreateDocumentDialog';
import DocumentSidebar from '../components/DocumentSidebar';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import { MessageType } from '../common/ui-message/message-type';
import { PresentationType } from '../common/ui-message/presentation-type';
import { useUIMessage } from '../common/ui-message/hooks/useUIMessage';
import { useAuth } from '../contexts/AuthContext';
import DocumentLayout from '../layouts/DocumentLayout';
import {
  createDocument,
  getDocument,
  getDocuments,
  updateDocumentMetadata,
} from '../services/api/document.api';
import type {
  CreateDocumentRequest,
  Document,
  DocumentDetail,
  UpdateDocumentMetadataRequest,
} from '../types/document.type';

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : '處理文件時發生未知錯誤。';
}

interface DocumentListState {
  requestKey: string;
  documents: Document[];
}

interface DocumentListError {
  requestKey: string;
  message: string;
}

interface CurrentDocumentState {
  requestKey: string;
  document: DocumentDetail;
}

interface CurrentDocumentError {
  requestKey: string;
  message: string;
}

interface DraftState {
  requestKey: string;
  content: string;
}

interface MetadataFormState {
  documentId: string;
  name: string;
  description: string;
}

export default function DocumentEditorPage() {
  const { documentId } = useParams();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notify } = useUIMessage();
  const [documentList, setDocumentList] = useState<DocumentListState | null>(null);
  const [documentListError, setDocumentListError] =
    useState<DocumentListError | null>(null);
  const [documentListRetry, setDocumentListRetry] = useState(0);
  const [currentDocument, setCurrentDocument] =
    useState<CurrentDocumentState | null>(null);
  const [currentDocumentError, setCurrentDocumentError] =
    useState<CurrentDocumentError | null>(null);
  const [documentRetry, setDocumentRetry] = useState(0);
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [metadataForm, setMetadataForm] = useState<MetadataFormState | null>(null);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState<{
    documentId: string;
    message: string;
  } | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const prefetchedDocument = useRef<CurrentDocumentState | null>(null);

  const documentListRequestKey = JSON.stringify([token, documentListRetry]);
  const currentDocumentRequestKey = JSON.stringify([
    documentId ?? null,
    token,
    documentRetry,
  ]);

  useEffect(() => {
    let isCurrent = true;

    async function loadDocuments() {
      setDocumentListError(null);

      try {
        const documents = await getDocuments(token);

        if (isCurrent) {
          setDocumentList({
            requestKey: documentListRequestKey,
            documents,
          });
        }
      } catch (error) {
        if (isCurrent) {
          setDocumentListError({
            requestKey: documentListRequestKey,
            message: getErrorMessage(error),
          });
        }
      }
    }

    void loadDocuments();

    return () => {
      isCurrent = false;
    };
  }, [token, documentListRequestKey]);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    const id = documentId;
    if (prefetchedDocument.current?.requestKey === currentDocumentRequestKey) {

      setCurrentDocument(prefetchedDocument.current);
      setDraft({
        requestKey: currentDocumentRequestKey,
        content: prefetchedDocument.current.document.content,
      });
      prefetchedDocument.current = null;
      return;
    }

    let isCurrent = true;

    setCurrentDocumentError(null);

    async function loadDocument() {
      try {
        const document = await getDocument(id, token);

        if (isCurrent) {
          setCurrentDocument({
            requestKey: currentDocumentRequestKey,
            document,
          });
          setDraft({
            requestKey: currentDocumentRequestKey,
            content: document.content,
          });
        }
      } catch (error) {
        if (isCurrent) {
          setCurrentDocumentError({
            requestKey: currentDocumentRequestKey,
            message: getErrorMessage(error),
          });
        }
      }
    }

    void loadDocument();

    return () => {
      isCurrent = false;
    };
  }, [documentId, token, documentRetry, currentDocumentRequestKey]);

  const documents =
    documentList?.requestKey === documentListRequestKey
      ? documentList.documents
      : [];
  const listError =
    documentListError?.requestKey === documentListRequestKey
      ? documentListError.message
      : null;
  const isDocumentListLoading =
    documentList?.requestKey !== documentListRequestKey && listError === null;
  const loadedDocument =
    currentDocument?.requestKey === currentDocumentRequestKey
      ? currentDocument.document
      : null;
  const documentError =
    currentDocumentError?.requestKey === currentDocumentRequestKey
      ? currentDocumentError.message
      : null;
  const canEdit = Boolean(
    loadedDocument && (isAuthenticated || loadedDocument.allowGuestEdit),
  );
  const draftContent =
    draft?.requestKey === currentDocumentRequestKey
      ? draft.content
      : loadedDocument?.content ?? '';
  const previewContent = canEdit
    ? draftContent
    : loadedDocument?.content ?? '';

  const metadataName =
    loadedDocument &&
      metadataForm?.documentId === loadedDocument.id
      ? metadataForm.name
      : loadedDocument?.name ?? '';
  const metadataDescription =
    loadedDocument &&
      metadataForm?.documentId === loadedDocument.id
      ? metadataForm.description
      : loadedDocument?.description ?? '';
  const isMetadataDirty = Boolean(
    loadedDocument &&
    (metadataName !== loadedDocument.name ||
      metadataDescription !== (loadedDocument.description ?? '')),
  );
  const currentMetadataError =
    metadataError?.documentId === loadedDocument?.id
      ? metadataError?.message
      : null;

  async function handleMetadataSave() {
    if (!loadedDocument || isSavingMetadata || !isMetadataDirty) {
      return;
    }

    const name = metadataName.trim();
    if (!name) {
      setMetadataError({
        documentId: loadedDocument.id,
        message: '文件名稱為必填欄位。',
      });
      return;
    }

    setIsSavingMetadata(true);
    setMetadataError(null);

    const requestKey = currentDocumentRequestKey;
    const metadata: UpdateDocumentMetadataRequest = {
      name,
      description: metadataDescription.trim(),
    };

    try {
      const updatedDocument = await updateDocumentMetadata(
        loadedDocument.id,
        metadata,
        token,
      );
      const savedMetadataForm = {
        documentId: loadedDocument.id,
        name: updatedDocument.name,
        description: updatedDocument.description ?? '',
      };

      setCurrentDocument((current) =>
        current?.requestKey === requestKey
          ? {
            ...current,
            document: {
              ...current.document,
              name: updatedDocument.name,
              description: updatedDocument.description,
              updatedAt: updatedDocument.updatedAt,
            },
          }
          : current,
      );
      if (isDocumentListLoading) {
        setDocumentList(null);
        setDocumentListRetry((retry) => retry + 1);
      } else {
        setDocumentList((current) =>
          current?.requestKey === documentListRequestKey
            ? {
              ...current,
              documents: current.documents.map((document) =>
                document.id === updatedDocument.id
                  ? {
                    ...document,
                    name: updatedDocument.name,
                    description: updatedDocument.description,
                    updatedAt: updatedDocument.updatedAt,
                  }
                  : document,
              ),
            }
            : current,
        );
      }
      setMetadataForm(savedMetadataForm);
      notify({
        presentation: PresentationType.NOTIFICATION,
        type: MessageType.SUCCESS,
        message: '文件資訊已儲存。',
      });
    } catch (error) {
      setMetadataError({
        documentId: loadedDocument.id,
        message: getErrorMessage(error),
      });
    } finally {
      setIsSavingMetadata(false);
    }
  }

  async function handleCreateDocument(data: CreateDocumentRequest) {
    if (!isAuthenticated || !token) {
      throw new Error('請先登入再建立文件。');
    }

    const createdDocument = await createDocument(data, token);
    const nextDocumentRequestKey = JSON.stringify([
      createdDocument.id,
      token,
      documentRetry,
    ]);
    const nextDocuments = [
      createdDocument,
      ...documents.filter((document) => document.id !== createdDocument.id),
    ];

    setDocumentList({
      requestKey: documentListRequestKey,
      documents: nextDocuments,
    });
    prefetchedDocument.current = {
      requestKey: nextDocumentRequestKey,
      document: createdDocument,
    };

    notify({
      presentation: PresentationType.NOTIFICATION,
      type: MessageType.SUCCESS,
      message: '文件已建立。',
    });
    navigate(`/documents/${encodeURIComponent(createdDocument.id)}`);
  }

  const sidebar = (
    <DocumentSidebar
      documents={documents}
      activeDocumentId={documentId ?? ''}
      isLoading={isDocumentListLoading}
      error={listError}
      canCreate={isAuthenticated}
      onCreate={() => setIsCreateDialogOpen(true)}
      onRetry={() => {
        setDocumentListError(null);
        setDocumentList(null);
        setDocumentListRetry((retry) => retry + 1);
      }}
    />
  );

  const editor = canEdit && loadedDocument ? (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="border-b border-[#e7e5dc] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#526c4f]">Markdown 編輯</h2>
        <p className="mt-1 text-xs leading-5 text-[#8a8f87]">
          內容只暫存在此頁，離開文件後不會保留。
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <MarkdownEditor
          value={draftContent}
          onChange={(content) => {
            setDraft({
              requestKey: currentDocumentRequestKey,
              content,
            });
          }}
        />
      </div>
    </div>
  ) : undefined;

  const metadata = loadedDocument ? (
    canEdit ? (
      <form
        className="grid gap-4 p-4 sm:px-6 sm:py-5"
        onSubmit={(event) => {
          event.preventDefault();
          void handleMetadataSave();
        }}
      >
        <div className="min-w-0">
          <label
            htmlFor="document-name"
            className="mb-1.5 block text-xs font-medium text-[#737a72]"
          >
            文件名稱
          </label>
          <input
            id="document-name"
            required
            value={metadataName}
            disabled={isSavingMetadata}
            onChange={(event) => {
              setMetadataForm({
                documentId: loadedDocument.id,
                name: event.target.value,
                description: metadataDescription,
              });
              setMetadataError(null);
            }}
            className="w-full rounded-xl border border-[#dcded5] bg-white px-3.5 py-2.5 text-base font-semibold text-[#202b25] outline-none focus:border-[#90a880] focus:ring-2 focus:ring-[#c5d6a3]/50 disabled:bg-[#f8f7f0]"
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="document-description"
            className="mb-1.5 block text-xs font-medium text-[#737a72]"
          >
            文件描述
          </label>
          <textarea
            id="document-description"
            rows={2}
            value={metadataDescription}
            disabled={isSavingMetadata}
            onChange={(event) => {
              setMetadataForm({
                documentId: loadedDocument.id,
                name: metadataName,
                description: event.target.value,
              });
              setMetadataError(null);
            }}
            className="w-full resize-y rounded-xl border border-[#dcded5] bg-white px-3.5 py-2.5 text-sm leading-6 text-[#46544b] outline-none focus:border-[#90a880] focus:ring-2 focus:ring-[#c5d6a3]/50 disabled:bg-[#f8f7f0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isSavingMetadata || !isMetadataDirty}
            onClick={() => {
              setMetadataForm(null);
              setMetadataError(null);
            }}
            className="rounded-xl border border-[#dcded5] px-4 py-2.5 text-sm font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={
              isSavingMetadata ||
              !isMetadataDirty ||
              !metadataName.trim()
            }
            className="min-w-20 rounded-xl bg-[#183c32] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#244b3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingMetadata ? '儲存中…' : '儲存'}
          </button>
        </div>

        {currentMetadataError && (
          <p
            role="alert"
            className="text-sm leading-6 text-[#783f35] sm:col-span-full"
          >
            {currentMetadataError}
          </p>
        )}
      </form>
    ) : (
      <section className="px-5 py-5 sm:px-7">
        <h2 className="break-words text-2xl font-semibold tracking-tight text-[#202b25] sm:text-3xl">
          {loadedDocument.name}
        </h2>
        {loadedDocument.description?.trim() && (
          <p className="mt-2 break-words text-sm leading-6 text-[#737a72]">
            {loadedDocument.description}
          </p>
        )}
      </section>
    )
  ) : (
    <p
      role={documentError ? 'alert' : 'status'}
      className="px-5 py-4 text-sm text-[#737a72] sm:px-7"
    >
      {documentError ? '無法載入文件資訊。' : '正在載入文件資訊…'}
    </p>
  );

  let previewBody: ReactNode;

  if (!documentId) {
    previewBody = (
      <p role="alert" className="text-sm text-[#783f35]">
        找不到文件識別碼。
      </p>
    );
  } else if (loadedDocument) {
    previewBody = (
      <MarkdownPreview content={previewContent} />
    );
  } else if (documentError) {
    previewBody = (
      <div role="alert" className="py-8 text-center">
        <p className="text-sm font-medium text-[#783f35]">無法載入文件</p>
        <p className="mt-2 text-sm leading-6 text-[#737a72]">{documentError}</p>
        <button
          type="button"
          onClick={() => setDocumentRetry((retry) => retry + 1)}
          className="mt-5 rounded-xl border border-[#dcded5] px-4 py-2 text-sm font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
        >
          重試
        </button>
      </div>
    );
  } else {
    previewBody = (
      <p role="status" className="py-8 text-center text-sm text-[#737a72]">
        正在載入文件…
      </p>
    );
  }

  const preview = (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="border-b border-[#e7e5dc] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#526c4f]">Markdown 預覽</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        {previewBody}
      </div>
    </div>
  );

  return (
    <>
      <DocumentLayout
        title={loadedDocument?.name ?? '文件工作區'}
        sidebar={sidebar}
        metadata={metadata}
        editor={editor}
        preview={preview}
      />
      {isCreateDialogOpen && (
        <CreateDocumentDialog
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={handleCreateDocument}
        />
      )}
    </>
  );
}
