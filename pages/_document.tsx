import { getDefaultTheme } from 'hooks/useTheme'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html data-theme={getDefaultTheme()}>
      <Head>
        <meta name="description" content="Put your money where your mouth is" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
