'use client'
import useTransaction from '../hooks/useTransactions'
import useBalanceStatus from '../hooks/useBalanceStatus'
import styles from './Status.module.scss'
import ScrollToTopButton from 'components/ScrollToTopButton'
import ChartsPanel from 'components/ChartsPanel'
import Tickers from 'components/Tickers'
import TargetPanel from 'components/TargetPanel/TargetPanel'
import Timeline from 'components/Timeline/Timeline'
import { useState } from 'react'
import { UpdateBalanceModal } from 'components/UpdateBalance/UpdateBalanceModal'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Page() {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransaction()
  const { data: session } = useSession()
  const user = session?.user

  if (!user) {
    return (
      <>
        <h2>Welcome to Get There</h2>
        <p>
          Please <Link href="/login">sign in</Link> to use the app{' '}
        </p>
      </>
    )
  }
  if (balanceStatuses?.length === 0) {
    return (
      <>
        <h2>Welcome to Get There</h2>
        <p>
          Please{' '}
          <span
            className={styles.addBalanceClick}
            onClick={() => {
              setIsBalanceModalOpen(true)
            }}
          >
            add
          </span>{' '}
          your current balance amount{' '}
        </p>
        <UpdateBalanceModal
          isOpen={isBalanceModalOpen}
          onClose={() => setIsBalanceModalOpen(false)}
        />
      </>
    )
  } else if (transactions?.length === 0) {
    return (
      <>
        <h2>Welcome to Get There</h2>
        <p>
          Please{' '}
          <Link href="/transactions/new">
            <span className={styles.addBalanceClick}>add</span>
          </Link>{' '}
          transactions so we can calculate your future balance{' '}
        </p>
        <UpdateBalanceModal
          isOpen={isBalanceModalOpen}
          onClose={() => setIsBalanceModalOpen(false)}
        />
      </>
    )
  }

  return (
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
  )
}
