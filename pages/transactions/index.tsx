import { format } from 'date-fns'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { BalanceStatus } from '../../utils/types'
import useTransaction from '../../hooks/useTransactions'
import styles from './Transactions.module.scss'
import Layout from '../../components/layout'
import Link from 'next/link'
import Loader from '../../components/loader'
import useBalanceStatus from '../../hooks/useBalanceStatus'

function CurrentBalancePanel({
  balanceStatus,
}: {
  balanceStatus?: BalanceStatus
}) {
  const [editedAmount, setEditedAmount] = useState(balanceStatus?.amount || 0)
  const { mutate } = useBalanceStatus(true)

  const updateBalanceStatus = async (amount: number) => {
    mutate({ amount, createdAt: new Date() }, false)
    await fetch(`/api/balance-statuses`, {
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
  const { balanceStatuses } = useBalanceStatus(true)
  const { transactions, isLoading } = useTransaction()

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
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
          <div>
            <Link href="/transactions/new">
              <a>New transaction</a>
            </Link>
          </div>
          <div>
            {balanceStatuses && (
              <CurrentBalancePanel balanceStatus={balanceStatuses} />
            )}{' '}
          </div>
        </div>
      )}
    </Layout>
  )
}
export default List
