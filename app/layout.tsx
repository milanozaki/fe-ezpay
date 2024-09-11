import './globals.css';
import 'antd/dist/reset.css';
import {Provider} from "./provider";
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    {/* ugh */}
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <Script src="/api/env" strategy={"beforeInteractive"}></Script>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
