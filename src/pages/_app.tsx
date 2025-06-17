import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BlogProvider } from "@/context/BlogContext";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Check if the current path is in the admin section
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <BlogProvider>
          {isAdminPage ? (
            // Admin pages use the AdminLayout
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            // Regular pages use the Layout with navbar
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </BlogProvider>
        <Toaster />
      </SessionProvider>
    </QueryClientProvider>
  );
}
