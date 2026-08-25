import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import  App from './App';
import './index.css';
import NiceModal from '@ebay/nice-modal-react';
import { ThemeProvider } from './context/theme/ThemeProvider';
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        <ThemeProvider>
        <App />
        </ThemeProvider>
      </NiceModal.Provider>
    </QueryClientProvider>
  </StrictMode>,
);
 