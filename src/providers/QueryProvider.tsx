'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Handle 401 Unauthorized errors
 * Clears auth cookie and redirects to landing page
 */
async function handle401Error() {
  try {
    // Clear the auth-token cookie by setting it to expire
    document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Strict';
    
    // Redirect to landing page
    window.location.href = '/';
  } catch (error) {
    console.error('Error handling 401:', error);
    // Force redirect anyway
    window.location.href = '/';
  }
}

/**
 * React Query Provider for data fetching and caching
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: true,
            retry: (failureCount, error: any) => {
              // Don't retry on 401 errors
              if (error?.response?.status === 401 || error?.status === 401) {
                handle401Error();
                return false;
              }
              // Retry other errors up to 3 times
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount, error: any) => {
              // Don't retry on 401 errors
              if (error?.response?.status === 401 || error?.status === 401) {
                handle401Error();
                return false;
              }
              // Retry other errors up to 3 times
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
