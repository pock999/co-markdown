import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import CreateDocumentDialog from '../components/CreateDocumentDialog';
import Navbar from '../components/Navbar';
import { MessageType } from '../common/ui-message/message-type';
import { PresentationType } from '../common/ui-message/presentation-type';
import { useUIMessage } from '../common/ui-message/hooks/useUIMessage';
import { useAuth } from '../contexts/AuthContext';
import {
  createDocument,
  getDocuments,
} from '../services/api/document.api';
import type { CreateDocumentRequest, Document } from '../types/document.type';

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '日期未知';
  }

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function DocumentsPage() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notify } = useUIMessage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadDocuments() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getDocuments(token);

        if (isCurrent) {
          setDocuments(result);
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : '讀取文件時發生未知錯誤。',
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments();

    return () => {
      isCurrent = false;
    };
  }, [token, reloadKey]);

  async function handleCreateDocument(data: CreateDocumentRequest) {
    if (!token) {
      throw new Error('請先登入再建立文件。');
    }

    const document = await createDocument(data, token);
    setDocuments((current) => [
      document,
      ...current.filter((item) => item.id !== document.id),
    ]);
    notify({
      presentation: PresentationType.NOTIFICATION,
      type: MessageType.SUCCESS,
      message: '文件已建立。',
    });
    navigate(`/documents/${encodeURIComponent(document.id)}`);
  }

  return (
    <main className="min-h-screen bg-[#f2f1eb] px-3 py-6 text-[#202b25] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e7e5dc] bg-[#fffefa] shadow-[0_24px_80px_-32px_rgba(34,48,39,0.24)]">
        <Navbar />

        <section className="px-5 py-8 sm:px-8 sm:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-[#829078]">
                MARKDOWN WORKSPACE
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Documents
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#737a72]">
                瀏覽文件，並開啟文件工作區。
              </p>
            </div>

            {isAuthenticated && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#183c32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#244b3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
                >
                  + 新增文件
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div
              role="status"
              className="rounded-2xl border border-[#e7e5dc] bg-[#f8f7f0] px-5 py-10 text-center text-sm text-[#737a72]"
            >
              正在載入文件…
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-[#e7c9c1] bg-[#fff8f5] px-5 py-8 text-center"
            >
              <p className="text-sm font-medium text-[#783f35]">
                無法載入文件
              </p>
              <p className="mt-2 text-sm leading-6 text-[#737a72]">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-5 rounded-xl border border-[#dcded5] px-4 py-2 text-sm font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
              >
                重試
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dcded5] bg-[#f8f7f0] px-5 py-12 text-center">
              <h2 className="text-lg font-semibold text-[#202b25]">
                目前沒有文件
              </h2>
              <p className="mt-2 text-sm text-[#737a72]">
                建立文件後，就能在這裡查看文件。
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#e7e5dc] overflow-hidden rounded-2xl border border-[#e7e5dc]">
              {documents.map((document) => {
                const description = document.description?.trim();
                const previewPath = `/documents/${encodeURIComponent(document.id)}`;

                return (
                  <li
                    key={document.id}
                    className="flex flex-col gap-5 bg-[#fffefa] px-5 py-5 transition-colors hover:bg-[#fcfbf7] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-[#202b25]">
                        {document.name}
                      </h2>
                      <p className="mt-1 break-words text-sm leading-6 text-[#737a72]">
                        {description || '尚無文件描述'}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a8f87]">
                        <span>更新於 {formatDate(document.updatedAt)}</span>
                        {document.allowGuestEdit && (
                          <span className="rounded-full bg-[#edf1e7] px-2.5 py-1 font-medium text-[#526c4f]">
                            允許訪客編輯
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link
                        to={previewPath}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#dcded5] px-4 py-2 text-sm font-medium text-[#244638] no-underline transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
                      >
                        開啟工作區
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
      {isCreateDialogOpen && (
        <CreateDocumentDialog
          onClose={() => setIsCreateDialogOpen(false)}
          onCreate={handleCreateDocument}
        />
      )}
    </main>
  );
}
