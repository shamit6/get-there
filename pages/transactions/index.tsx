import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  createOrUpdateBalanceStatus,
  getAllTransactions,
  getBalanceStatus,
} from '../../utils/db'
import { getCurrentBalanceAmount } from '../../utils/transactionsCalculator'
import { TransactionConfig } from '../../utils/types'
import styles from './Transactions.module.scss'

function List() {
  const [transactions, setTransactions] = useState<TransactionConfig[]>([])
  const [balance, setBalance] = useState<number>()
  const router = useRouter()

  useEffect(() => {
    const allTransactions = getAllTransactions()
    setTransactions(allTransactions)

    const balanceStats = getBalanceStatus()
    if (balanceStats) {
      const currentBalanceAmount = getCurrentBalanceAmount(
        allTransactions,
        balanceStats
      )
      setBalance(currentBalanceAmount)
    }
  }, [])

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
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={styles.tableRow}
                onClick={() => router.push(`/transactions/${transaction.id}`)}
              >
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{format(transaction.date, 'dd/MM/yyyy')}</td>
                <td>
                  {transaction.interval &&
                    `every ${transaction.interval.amount} ${transaction.interval.timePeriod}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.balancePanel}>
          <span>Current Balance:</span>
          <input
            value={balance || ''}
            type="number"
            onChange={(e) => setBalance(Number(e.target.value))}
          />
          <button
            disabled={!balance}
            onClick={() => {
              createOrUpdateBalanceStatus(balance!)
            }}
          >
            Update Balance
          </button>
        </div>
      </div>
    </div>
  )
}
export default List
