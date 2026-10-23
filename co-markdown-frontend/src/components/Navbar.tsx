import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e5dc] px-5 py-4 sm:px-8">
      <Link to="/" className="flex items-center gap-3 text-[#244638] no-underline">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6edda]">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M5 4.75h14v14.5H5z" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 9h8M8 12h5M8 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight">co-markdown</span>
      </Link>

      <div className="flex items-center gap-3 text-sm">
        {isAuthenticated ? (
          <>
            <span className="hidden text-[#737a72] sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#dcded5] px-4 py-2 font-medium text-[#244638] transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
            >
              登出
            </button>
          </>
        ) : (
          <Link
            to="/login"
            state={{ from: location }}
            className="rounded-xl border border-[#dcded5] px-4 py-2 font-medium text-[#244638] no-underline transition-colors hover:bg-[#f4f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c4f]"
          >
            登入
          </Link>
        )}
      </div>
    </header>
  );
}
