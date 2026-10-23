import { Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f1eb] p-3 text-[#202b25] sm:p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e7e5dc] bg-[#fffefa] shadow-[0_24px_80px_-32px_rgba(34,48,39,0.24)] md:min-h-[520px] md:grid-cols-[1.04fr_0.96fr]">
        <section className="flex flex-col bg-[#183c32] p-8 text-[#f8f6ec] sm:p-10 lg:p-14">
          <Link to="/" className="flex w-fit items-center gap-3 text-white no-underline">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4e2b4] text-[#183c32]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight">co-markdown</span>
          </Link>

          <div className="mt-12 max-w-md sm:mt-16 md:my-auto">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-[#dbe7c5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5d6a3]" />
              簡潔的 Markdown 工作空間
            </span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              撰寫與預覽 Markdown，
              <br className="hidden sm:block" />
              從這裡開始。
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#d1dbd2]">
              Co-Markdown 讓你在同一個地方撰寫、整理並預覽 Markdown 文件。
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-14">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf1e7] text-[#526c4f]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
              <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#202b25]">
            開始使用 Co-Markdown
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#737a72]">
            前往文件列表，查看並管理你的 Markdown 文件。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Link
              to="/documents"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#183c32] px-5 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#244b3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
            >
              前往文件列表
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                state={{ from: location }}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#dcded5] bg-[#fffefa] px-5 py-3 text-sm font-semibold text-[#244638] no-underline transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
              >
                登入
              </Link>
            )}
          </div>

          <footer className="mt-12 text-xs text-[#a0a39b]">
            © {new Date().getFullYear()} co-markdown
          </footer>
        </section>
      </div>
    </main>
  );
}
