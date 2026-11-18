import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
  useLocation,
} from 'react-router';

import type { ReactNode } from 'react';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DocumentsPage from '../pages/DocumentsPage';
import DocumentEditorPage from '../pages/DocumentEditorPage';
import LoadingScreen from '../components/LoadingScreen';
import TestPage from '../surveys/TestPage';

import { useAuth } from '../contexts/AuthContext';

type RouteAccess = 'public' | 'guest' | 'authenticated';

interface AppRoute {
  path: string;
  element: ReactNode;
  access: RouteAccess;
}
/* eslint-disable react-refresh/only-export-components */
function RouteGuard({
  access,
  children,
}: {
  access: RouteAccess;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (access === 'guest' && isAuthenticated) {
    return <Navigate to="/documents" replace />;
  }

  if (access === 'authenticated' && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

const routes: AppRoute[] = [
  {
    path: '/',
    element: <LandingPage />,
    access: 'public',
  },
  {
    path: '/login',
    element: <LoginPage />,
    access: 'guest',
  },
  {
    path: '/documents',
    element: <DocumentsPage />,
    access: 'public',
  },
  {
    path: '/documents/:documentId',
    element: <DocumentEditorPage />,
    access: 'public',
  },
  {
    path: '/test',
    element: <TestPage />,
    access: 'public',
  },
];

const routeObjects: RouteObject[] = routes.map(
  ({ access, ...route }) => ({
    ...route,
    element: (
      <RouteGuard access={access}>
        {route.element}
      </RouteGuard>
    ),
  }),
);

export const router = createBrowserRouter(routeObjects);