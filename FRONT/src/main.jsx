import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './contexts/ThemeContext'
import { I18nextProvider } from 'react-i18next'
import i18n from './config/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

// Configure TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 0,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
            <App />
            {/* Show React Query DevTools in development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)

// Register service worker for PWA support (solo en producción)
// Comentado temporalmente hasta que se implemente el service worker
/*
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ [PWA] Service Worker registered successfully:', registration.scope);

        // Verificar actualizaciones del SW
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 [PWA] New Service Worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✨ [PWA] New version available! Please refresh.');
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ [PWA] Service Worker registration failed:', error);
      });
  });
} else
*/
if ('serviceWorker' in navigator) {
  // Desregistrar cualquier SW existente para evitar conflictos
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('🧹 Service Worker unregistered');
    }
  });
}
