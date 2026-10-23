import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router/router';
import { UIMessageProvider } from './common/ui-message/contexts/UIMessageProvider';

function App() {
  return (
    <UIMessageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </UIMessageProvider>
  );
}

export default App;
