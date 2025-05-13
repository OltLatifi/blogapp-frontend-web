import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/layout";
import { BlogProvider } from "@/context/BlogContext";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <BlogProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BlogProvider>
    </SessionProvider>
  )
}
