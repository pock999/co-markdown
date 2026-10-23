import { Link } from 'react-router';
import type { Document } from '../types/document.type';

interface DocumentSidebarProps {
  documents: Document[];
  activeDocumentId: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  canCreate: boolean;
  onCreate: () => void;
}

export default function DocumentSidebar({
  documents,
  activeDocumentId,
  isLoading,
  error,
  onRetry,
  canCreate,
  onCreate,
}: DocumentSidebarProps) {
  return (
    <aside className="min-w-0 p-4 sm:p-5 xl:flex xl:min-h-0 xl:flex-col xl:overflow-y-auto">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[#526c4f]">文件</h2>
        {canCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="shrink-0 rounded-lg bg-[#183c32] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#244b3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
          >
            + 新增
          </button>
        )}
      </div>

      {isLoading ? (
        <p role="status" className="text-sm text-[#737a72]">
          正在載入文件列表…
        </p>
      ) : error ? (
        <div role="alert" className="text-sm">
          <p className="leading-6 text-[#783f35]">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-lg border border-[#dcded5] px-3 py-1.5 font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
          >
            重試
          </button>
        </div>
      ) : documents.length === 0 ? (
        <p className="text-sm leading-6 text-[#737a72]">目前沒有文件。</p>
      ) : (
        <nav
          aria-label="文件列表"
          className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-x-hidden xl:overflow-y-auto"
        >
          {documents.map((document) => {
            const isActive = document.id === activeDocumentId;

            return (
              <Link
                key={document.id}
                to={`/documents/${encodeURIComponent(document.id)}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-40 max-w-64 shrink-0 rounded-xl border px-3 py-2.5 no-underline transition-colors xl:min-w-0 xl:max-w-none ${
                  isActive
                    ? 'border-[#c5d6a3] bg-[#edf1e7] text-[#183c32]'
                    : 'border-transparent text-[#46544b] hover:border-[#e7e5dc] hover:bg-[#f8f7f0]'
                }`}
              >
                <span className="block truncate text-sm font-medium">
                  {document.name}
                </span>
                <span className="mt-1 block truncate text-xs text-[#828980]">
                  {document.description?.trim() || '尚無文件描述'}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
