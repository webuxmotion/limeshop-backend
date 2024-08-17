import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css";
import store from '@/lib/edgestore';

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <store.EdgeStoreProvider>
        <Component {...pageProps}/>
      </store.EdgeStoreProvider>
    </SessionProvider>
  )
}


