import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BlogProvider } from "@/context/BlogContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <BlogProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </BlogProvider>
        <Toaster />
      </SessionProvider>
    </QueryClientProvider>
  )
}
