import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

export default function DocumentsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div>
      <h1>Documents</h1>

      {isAuthenticated ? (
        <>
          <p>目前使用者：{user?.name}</p>
          <button onClick={handleLogout}>登出</button>
        </>
      ) : (
        <p>目前是 Guest</p>
      )}
    </div>
  );
}