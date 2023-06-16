import classnames from 'classnames'
import Header from 'components/Header/Header'
import Providers from 'components/Providers/Providers'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'
import styles from './Layout.module.scss'

function isBrowserDefaultDark() {
  return !!global?.matchMedia('(prefers-color-scheme: dark)').matches
}

function getDefaultTheme(): 'dark' | 'light' {
  try {
    const localStorageTheme = localStorage.getItem('theme')
    if (localStorageTheme === 'dark' || localStorageTheme === 'light') {
      return localStorageTheme
    }
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light'
    return browserDefault
  } catch (error) {
    return 'light'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)

  return (
    <html lang="en" data-theme={getDefaultTheme()}>
      <head>
        <meta name="description" content="Put your money where your mouth is" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Get-There</title>
      </head>
      <body>
        <Providers session={session}>
          <main className={classnames(styles.wrapper, `theme-dark`)}>
            <Header />
            <div className={styles.content}>{children}</div>
          </main>
          <div id="modal-root"></div>
        </Providers>
      </body>
    </html>
  )
}
