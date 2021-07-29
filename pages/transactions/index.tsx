import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { BalanceStatus } from '../../utils/types'
import useTransaction from '../../hooks/useTransactions'
import styles from './Transactions.module.scss'

function CurrentBalancePanel({
  balanceStatus,
}: {
  balanceStatus?: BalanceStatus
}) {
  const [editedAmount, setEditedAmount] = useState(balanceStatus?.amount || 0)

  const updateBalanceStatus = async (amount: number) => {
    mutate(
      '/api/balance-statuses?last=true',
      { amount, createdAt: new Date() },
      false
    )
    const data = await fetch(`/api/balance-statuses`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
  }

  return (
    <div className={styles.balancePanel}>
      <span>Current Balance:</span>
      <input
        defaultValue={editedAmount}
        type="number"
        onChange={(e) => setEditedAmount(Number(e.target.value))}
      />
      <button
        disabled={!editedAmount}
        onClick={() => updateBalanceStatus(editedAmount!)}
      >
        Update Balance
      </button>
      <div>
        Last updated at: {new Date(balanceStatus?.createdAt!).toLocaleString()}
      </div>
    </div>
  )
}

function List() {
  const router = useRouter()

  const balanceStatus = useSWR('/api/balance-statuses?last=true', (url) =>
    fetch(url)
      .then((r) => r.json())
      .then(({ createdAt, amount }) => ({
        createdAt: new Date(createdAt),
        amount,
      }))
  )

  const { transactions, isLoading } = useTransaction()

  if (isLoading) {
    return 'loading'
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/timeline">
          <a>Timeline</a>
        </Link>
        <Link href="/transactions/new">
          <a>New Transaction</a>
        </Link>
      </div>
      <div className={styles.content}>
        <table className={styles.transactionTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Type</th>
              <th>Amount</th>
              <th>When</th>
              <th>Interval</th>
            </tr>
          </thead>
          <tbody>
            {transactions!.map((transaction) => (
              <tr
                key={transaction.id}
                className={styles.tableRow}
                onClick={() => router.push(`/transactions/${transaction.id}`)}
              >
                <td>{transaction.type}</td>
                <td>{transaction.amount.toLocaleString('he')}</td>
                <td>{format(transaction.date, 'dd/MM/yyyy')}</td>
                <td>
                  {transaction.timePeriod &&
                    `every ${transaction.periodAmount} ${transaction.timePeriod}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {balanceStatus.data && !balanceStatus.error && (
          <CurrentBalancePanel balanceStatus={balanceStatus.data} />
        )}{' '}
      </div>
    </div>
  )
}
export default List
