import '@/styles/globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

/**
 * Global layout for the application. Wraps all pages with providers and common UI.
 */
const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>ReactDocsPulse</title>
        <meta name="description" content="AI‑generated summaries of the React documentation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background text-text min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              {children}
            </main>
          </div>
          <footer className="bg-secondary text-white py-4 text-center">
            © {new Date().getFullYear()} ReactDocsPulse. All rights reserved.
          </footer>
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
