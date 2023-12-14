import type { Metadata } from 'next'
import '../styles/variables.scss'
import '../styles/globals.css'
import { getServerSession } from 'next-auth/next'
import { nextAuthOptions } from 'utils/auth'
import Providers from 'components/Providers/Providers'
import Header from 'components/Header/Header'
import classnames from 'classnames'
import styles from './Layout.module.scss'
import { getTransactionConfigs } from 'db/transactionConfigs'
import { getMortgages } from 'db/mortgages'
import { getBalanceStatuses } from 'db/balanceStatuses'
import { getDefaultTheme } from 'utils/theme'
import { getDictionary } from '../utils/dictionaries'
import { getAssets } from 'db/assets'

export const metadata: Metadata = {
  description: 'Put your money where your mouth is',
  manifest: '/manifest.json',
}
export const revalidate = 0
export const viewPort = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1.0,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(nextAuthOptions)
  const { locale, translations } = await getDictionary()

  const [transactionsConfigs, mortgages, balanceStatuses, assets] =
    await Promise.all([
      getTransactionConfigs(),
      getMortgages(),
      getBalanceStatuses(),
      getAssets(),
    ])
  const rtl = locale === 'he'
  return (
    <html dir={rtl ? 'rtl' : 'ltr'}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.document?.head?.parentElement?.setAttribute('data-theme', (${getDefaultTheme.toString()})())
          `,
          }}
        />
      </head>
      <body>
        <Providers
          session={session}
          swrFallback={{
            '/api/transaction-configs': transactionsConfigs,
            '/api/mortgages': mortgages,
            '/api/balance-statuses': balanceStatuses,
            '/api/assets': assets,
          }}
          translations={{ translations, locale }}
        >
          <main className={classnames(styles.wrapper)}>
            <Header />
            <div className={styles.content}>{children}</div>
          </main>
        </Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
