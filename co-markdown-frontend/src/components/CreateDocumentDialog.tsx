import { useState, type FormEvent } from 'react';
import type { CreateDocumentRequest } from '../types/document.type';

interface CreateDocumentDialogProps {
  onClose: () => void;
  onCreate: (data: CreateDocumentRequest) => Promise<void>;
}

export default function CreateDocumentDialog({
  onClose,
  onCreate,
}: CreateDocumentDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('請輸入文件名稱。');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreate({
        name: normalizedName,
        description: description.trim() || null,
      });
      onClose();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : '建立文件時發生未知錯誤。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202b25]/45 p-4"
      onMouseDown={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-document-title"
        className="w-full max-w-lg rounded-2xl border border-[#e7e5dc] bg-[#fffefa] p-6 shadow-[0_24px_80px_-32px_rgba(34,48,39,0.4)] sm:p-8"
      >
        <h2
          id="create-document-title"
          className="text-xl font-semibold tracking-tight text-[#202b25]"
        >
          新增文件
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#737a72]">
          建立一份新的 Markdown 文件。
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="new-document-name"
              className="mb-1.5 block text-sm font-medium text-[#334138]"
            >
              文件名稱 <span className="text-[#9a5749]">*</span>
            </label>
            <input
              id="new-document-name"
              autoFocus
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#dcded5] bg-white px-3.5 py-2.5 text-sm text-[#202b25] outline-none focus:border-[#90a880] focus:ring-2 focus:ring-[#c5d6a3]/50 disabled:bg-[#f8f7f0]"
            />
          </div>

          <div>
            <label
              htmlFor="new-document-description"
              className="mb-1.5 block text-sm font-medium text-[#334138]"
            >
              描述 <span className="font-normal text-[#8a8f87]">（選填）</span>
            </label>
            <textarea
              id="new-document-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSubmitting}
              className="w-full resize-y rounded-xl border border-[#dcded5] bg-white px-3.5 py-2.5 text-sm leading-6 text-[#202b25] outline-none focus:border-[#90a880] focus:ring-2 focus:ring-[#c5d6a3]/50 disabled:bg-[#f8f7f0]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm leading-6 text-[#783f35]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#dcded5] px-4 py-2.5 text-sm font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#183c32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#244b3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? '建立中…' : '建立'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
