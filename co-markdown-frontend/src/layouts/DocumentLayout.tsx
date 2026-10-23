import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface DocumentLayoutProps {
  title: string;
  sidebar: ReactNode;
  metadata: ReactNode;
  editor?: ReactNode;
  preview: ReactNode;
}

export default function DocumentLayout({
  title,
  sidebar,
  metadata,
  editor,
  preview,
}: DocumentLayoutProps) {
  const hasEditor = editor !== undefined;

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#f2f1eb] p-2 text-left text-[#202b25] sm:p-4">
      <div className="mx-auto flex min-h-[calc(100svh-1rem)] w-full max-w-[1440px] flex-1 flex-col overflow-hidden rounded-[24px] border border-[#e7e5dc] bg-[#fffefa] shadow-[0_24px_80px_-32px_rgba(34,48,39,0.24)] sm:min-h-[calc(100svh-2rem)] xl:h-[calc(100svh-2rem)] xl:min-h-0">
        <Navbar />

        <div className="flex items-center justify-between gap-4 border-b border-[#e7e5dc] px-5 py-3 sm:px-7">
          <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-[#202b25]">
            {title}
          </h1>
          {hasEditor && (
            <span className="shrink-0 text-xs text-[#8a8f87]">
              編輯內容尚未儲存
            </span>
          )}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(200px,20%)_minmax(0,1fr)]">
          <div className="min-w-0 border-b border-[#e7e5dc] xl:border-b-0 xl:border-r">
            {sidebar}
          </div>

          <section className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)]">
            <div className="min-w-0 border-b border-[#e7e5dc]">{metadata}</div>
            {hasEditor ? (
              <div className="grid min-h-0 min-w-0 grid-cols-1 xl:grid-cols-2">
                <section className="min-h-[360px] min-w-0 overflow-hidden border-b border-[#e7e5dc] xl:border-b-0 xl:border-r">
                  {editor}
                </section>
                <section className="min-h-[360px] min-w-0 overflow-hidden">
                  {preview}
                </section>
              </div>
            ) : (
              <section className="min-h-[360px] min-w-0 overflow-hidden">
                {preview}
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
