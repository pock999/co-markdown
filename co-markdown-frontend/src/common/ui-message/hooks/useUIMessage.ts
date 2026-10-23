import { useContext } from 'react';
import { UIMessageContext } from '../contexts/UIMessageProvider';

export function useUIMessage() {
  const context = useContext(UIMessageContext);

  if (!context) {
    throw new Error(
      'useUIMessage must be used within a UIMessageProvider.',
    );
  }

  return context;
}
