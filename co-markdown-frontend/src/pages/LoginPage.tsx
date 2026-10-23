/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router';

import { googleLogin } from '../services/api/auth.api';

import { useUIMessage } from '../common/ui-message/hooks/useUIMessage';
import { MessageType } from '../common/ui-message/message-type';
import { PresentationType } from '../common/ui-message/presentation-type';

function getReturnLocation(state: unknown) {
  if (typeof state !== 'object' || state === null || !('from' in state)) {
    return null;
  }

  const from = state.from;
  if (
    typeof from !== 'object' ||
    from === null ||
    !('pathname' in from) ||
    typeof from.pathname !== 'string' ||
    !from.pathname.startsWith('/') ||
    from.pathname.startsWith('//') ||
    from.pathname === '/login'
  ) {
    return null;
  }

  return {
    pathname: from.pathname,
    search:
      'search' in from && typeof from.search === 'string' ? from.search : '',
    hash: 'hash' in from && typeof from.hash === 'string' ? from.hash : '',
  };
}

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { notify } = useUIMessage();

  const handleSuccess = async (response: any) => {
    console.log('success res => ', response);
    const data = await googleLogin(response.credential);
    login(data.jwtToken, { name: data.name, email: data.email });

    notify({
      presentation: PresentationType.NOTIFICATION,
      type: MessageType.SUCCESS,
      message: '登入成功！',
    });

    navigate(getReturnLocation(location.state) ?? '/documents', {
      replace: true,
    });
  };

  const handleFailure = () => {
    console.log('failure');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="flex min-h-screen items-center justify-center bg-[#f2f1eb] p-3 text-[#202b25] sm:p-6">
        <div className="grid min-h-[680px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e7e5dc] bg-[#fffefa] shadow-[0_24px_80px_-32px_rgba(34,48,39,0.24)] md:grid-cols-[1.04fr_0.96fr]">
          <section className="relative hidden flex-col overflow-hidden bg-[#183c32] p-10 text-[#f8f6ec] md:flex lg:p-14">
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#c5d6a3]/10 blur-3xl" />

            <a href="/" className="relative flex w-fit items-center gap-3 text-white no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4e2b4] text-[#183c32]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight">co-markdown</span>
            </a>

            <div className="relative mt-20 max-w-md lg:mt-24">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-[#dbe7c5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c5d6a3]" />
                寫作與協作，更自在
              </span>
              <h1 className="text-4xl font-semibold leading-[1.18] tracking-tight lg:text-[46px]">
                把想法寫下來，
                <br />
                一起完成更多。
              </h1>
              <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#d1dbd2]">
                一個簡潔的 Markdown 空間，讓靈感、筆記與每一次合作，都有地方好好安放。
              </p>
            </div>

            <div className="relative mt-auto pt-12">
              <div className="rotate-[-2deg] rounded-2xl border border-white/15 bg-[#f8f7f0] p-5 text-[#26352d] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.5)] lg:p-6">
                <div className="flex items-center justify-between border-b border-[#e8e7df] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#90a880]" />
                    <span className="text-xs font-medium text-[#667269]">團隊筆記 / 專案構想</span>
                  </div>
                  <div className="flex -space-x-2" aria-label="共同編輯者">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f8f7f0] bg-[#d8b9a1] text-[10px] font-semibold text-[#573d30]">A</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f8f7f0] bg-[#c1cda9] text-[10px] font-semibold text-[#344331]">J</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f8f7f0] bg-[#d8d1eb] text-[10px] font-semibold text-[#4b4265]">M</span>
                  </div>
                </div>
                <div className="pt-5">
                  <p className="font-mono text-[11px] text-[#829078]"># 一起整理好點子</p>
                  <div className="mt-3 h-2.5 w-4/5 rounded-full bg-[#d9ddd2]" />
                  <div className="mt-2 h-2.5 w-3/5 rounded-full bg-[#e7e8e0]" />
                  <div className="mt-5 flex gap-3">
                    <span className="mt-0.5 h-4 w-1 rounded-full bg-[#9eaf83]" />
                    <div className="flex-1">
                      <div className="h-2 w-2/3 rounded-full bg-[#c8d1bd]" />
                      <div className="mt-2 h-2 w-1/2 rounded-full bg-[#e7e8e0]" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-center text-xs tracking-wide text-[#c0cec2]">
                你的下一個好點子，從這裡開始。
              </p>
            </div>
          </section>

          <section className="flex flex-col items-center justify-center px-2 py-12 sm:px-8 md:px-10 lg:px-14">
            <div className="w-full max-w-[320px]">
              <a href="/" className="mb-12 flex w-fit items-center gap-2.5 text-[#244638] no-underline md:hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6edda]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="font-semibold tracking-tight">co-markdown</span>
              </a>

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf1e7] text-[#526c4f]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 3.75v2.5m0 11.5v2.5m8.25-8.25h-2.5m-11.5 0h-2.5m14.08-5.83-1.77 1.77M7.94 16.06l-1.77 1.77m11.66 0-1.77-1.77M7.94 7.94 6.17 6.17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </div>
              <h2 className="text-[28px] font-semibold tracking-tight text-[#202b25]">歡迎回來</h2>
              <p className="mt-2 text-sm leading-6 text-[#737a72]">
                登入 co-markdown，繼續你的寫作與協作。
              </p>

              <div className="mt-9 flex flex-col items-center gap-3">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleFailure}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="280"
                />
              </div>

              <p className="mt-7 text-center text-xs leading-5 text-[#8a8f87]">
                登入即表示你同意我們妥善保護你的帳戶與文件。
              </p>
            </div>

            <footer className="mt-16 text-xs text-[#a0a39b]">
              © {new Date().getFullYear()} co-markdown
            </footer>
          </section>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
