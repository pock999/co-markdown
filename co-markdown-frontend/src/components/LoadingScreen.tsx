interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = '正在確認登入狀態…',
}: LoadingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f1eb] p-4 text-[#202b25]">
      <section
        role="status"
        aria-live="polite"
        className="flex w-full max-w-sm flex-col items-center rounded-[28px] border border-[#e7e5dc] bg-[#fffefa] px-8 py-10 text-center shadow-[0_24px_80px_-32px_rgba(34,48,39,0.24)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf1e7] text-[#526c4f]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
            <path
              d="M8 9h8M8 12h5M8 15h7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <p className="mt-5 text-lg font-semibold tracking-tight">co-markdown</p>
        <p className="mt-2 text-sm text-[#737a72]">{message}</p>

        <span
          className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-[#e7e5dc]"
          aria-hidden="true"
        >
          <span className="block h-full w-1/2 origin-left animate-pulse rounded-full bg-[#90a880]" />
        </span>
      </section>
    </main>
  );
}
