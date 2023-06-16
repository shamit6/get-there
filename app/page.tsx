import { getServerSession } from 'next-auth/next';
import { getBalanceStatuses } from 'queries/balanceStatus'
import { getTransactionConfigs } from 'queries/transactionConfig';
import { nextAuthOptions } from 'utils/auth';
import styles from './Status.module.scss'
import ScrollToTopButton from 'components/ScrollToTopButton'
import ChartsPanel from 'components/ChartsPanel'
import Tickers from 'components/Tickers'
import TargetPanel from 'components/TargetPanel/TargetPanel'
import Timeline from 'components/Timeline/Timeline'
import { UpdateBalanceModal } from 'components/UpdateBalance/UpdateBalanceModal'
import Link from 'next/link'

// `app/page.tsx` is the UI for the `/` URL
export default async function Page() {
  const session = await getServerSession(nextAuthOptions);
  
  const balanceStatuses = await getBalanceStatuses(session?.user?.email!)
  const transactionConfigs = await getTransactionConfigs(session?.user?.email!)

  if (balanceStatuses.length === 0) {
    return (
      <>
        <h2>Welcome to Get There</h2>
        <p>
          Please{' '}
          <span
            className={styles.addBalanceClick}
            onClick={() => {
            }}
          >
            add
          </span>{' '}
          your current balance amount{' '}
        </p>
        <UpdateBalanceModal
          isOpen={false}
          onClose={() => {}}
        />
      </>
    )
  } else if (transactionConfigs.length === 0) {
    return (
      <>
        <h2>Welcome to Get There</h2>
        <p>
          Please{' '}
          <Link href="/transactions/new" className={styles.addBalanceClick}>
            add
          </Link>{' '}
          transactions so we can calculate your future balance{' '}
        </p>
        <UpdateBalanceModal
          isOpen={false}
          onClose={() => {}}
        />
      </>
    )
  }

  return (
    <>
      <div className={styles.status}>
        <Tickers />
        <TargetPanel />
        <div className={styles.graphs}>
          <ChartsPanel />
          <div className={styles.timeline}>
            <Timeline />
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  )
}
