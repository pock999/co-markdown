import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export interface User {
  email: string;
  name: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface StorageAuth {
  token: string | null;
  user: User | null;
}

function getStorageAuth(): StorageAuth {
  try {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return { token: null, user: null };
    }

    const user: User = JSON.parse(savedUser);

    return { token, user };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initialStorageAuth] = useState(getStorageAuth);

  const [user, setUser] = useState<User | null>(initialStorageAuth.user);
  const [token, setToken] = useState<string | null>(initialStorageAuth.token);
  const [isLoading, setIsLoading] = useState(true);

  function login(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  }

  const isAuthenticated = token !== null && user !== null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


/* eslint-disable react-refresh/only-export-components */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}