// File: web/pages/_app.tsx
// Next.js App component that wraps all pages. Provides global context providers including
// theme context, React Query client, and Vercel Analytics. This is the root component for the application.

import { ThemeProvider } from "@/context/themecontext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

// React Query client instance for data fetching and caching
const queryClient = new QueryClient();

// Function: Root app component that wraps all pages with necessary providers
export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
