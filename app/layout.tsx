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

export const metadata: Metadata = {
  description: 'Put your money where your mouth is',
}

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
  const [transactionconfigs, mortgages, balanceStatuses] = await Promise.all([
    getTransactionConfigs(),
    getMortgages(),
    getBalanceStatuses(),
  ])
  return (
    <html>
      <body>
        <Providers
          session={session}
          swrFallback={{
            '/api/transaction-configs': transactionconfigs,
            '/api/mortgages': mortgages,
            '/api/balance-statuses': balanceStatuses,
          }}
        >
          <main className={classnames(styles.wrapper, `theme-light`)}>
            <Header />
            <div className={styles.content}>{children}</div>
          </main>
        </Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}
