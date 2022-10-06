import { getDefaultTheme } from 'hooks/useTheme'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html data-theme={getDefaultTheme()}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
