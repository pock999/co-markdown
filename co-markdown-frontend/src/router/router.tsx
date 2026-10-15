import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router';

import type { ReactNode } from 'react';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DocumentsPage from '../pages/DocumentsPage';
import DocumentPreviewPage from '../pages/DocumentPreviewPage';
import DocumentEditorPage from '../pages/DocumentEditorPage';

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (access === 'guest' && isAuthenticated) {
    return <Navigate to="/documents" replace />;
  }

  if (access === 'authenticated' && !isAuthenticated) {
    return <Navigate to="/login" replace />;
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
    element: <DocumentPreviewPage />,
    access: 'public',
  },
  {
    path: '/documents/:documentId/edit',
    element: <DocumentEditorPage />,
    access: 'authenticated',
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