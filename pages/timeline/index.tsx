import {
  addBalanaceAmountToTransactionsSummery,
  calcCurrentBalanceAmount,
  getLastDayOfPeriod,
  getTransactionsSummeryByPeriod,
  TimelineSummerizedTransacrionsPeriod,
} from '../../utils/transactionsCalculator'
import Layout from '../../components/layout'
import useTransaction from '../../hooks/useTransactions'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import { TimePeriod } from '../../utils/types'
import { format } from 'date-fns'
import styles from './Timeline.module.scss'
import React, { useState } from 'react'
import Arrow, { Direction } from '../../components/arrow'
import TextNumber from '../../components/textNumber'

function TransactionsSummery({
  transaction,
}: {
  transaction: TimelineSummerizedTransacrionsPeriod
}) {
  const [isOpen, setOpen] = useState(false)

  return (
    <div>
      <dt className={styles.periodTitle}>
        {transaction.time.month != undefined
          ? `${transaction.time.month + 1} - `
          : ''}
        {transaction.time.year}
      </dt>
      <dd className={styles.periodContent}>
        <table className={styles.periodTransactionAmounts}>
          <thead>
            <tr
              onClick={() => setOpen(!isOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <th style={{ textAlign: 'left' }}>
                <Arrow
                  className={styles.collapseIcon}
                  direction={isOpen ? Direction.DOWN : Direction.RIGHT}
                />{' '}
                total income
              </th>
              <th style={{ textAlign: 'right' }}>
                <TextNumber value={transaction.totalAmount} />
              </th>
            </tr>
          </thead>
          <tbody>
            {isOpen &&
              transaction.transaction.map((spesificTransaction) => (
                <tr key={spesificTransaction.type}>
                  <td>{spesificTransaction.type}</td>
                  <td style={{ textAlign: 'right' }}>
                    <TextNumber value={spesificTransaction.amount} />
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot style={{ margin: '.3em 0' }}>
            <tr>
              <td style={{ padding: '.5em 0' }}>
                Expected Balance on{' '}
                {format(
                  getLastDayOfPeriod(transaction.time, TimePeriod.YEAR),
                  'dd/MM/yyyy'
                )}
              </td>
              <td style={{ textAlign: 'right', padding: '.5em 0' }}>
                <TextNumber value={transaction.amountWithBalance} />
              </td>
            </tr>
          </tfoot>
        </table>
      </dd>
    </div>
  )
}

function Timeline() {
  const { balanceStatuses, isLoading: isLoadingBalance } =
    useBalanceStatus(true)

  const { transactions, isLoading: isLoadingTransactions } = useTransaction()

  if (isLoadingBalance || isLoadingTransactions) {
    return 'loading'
  }
  const currentBalanceAmount = calcCurrentBalanceAmount(
    transactions!,
    balanceStatuses!
  )
  const transactionsSummery = getTransactionsSummeryByPeriod(
    transactions!,
    TimePeriod.YEAR,
    6,
    new Date()
  )
  const transactionsWithBalanceSummery = addBalanaceAmountToTransactionsSummery(
    transactionsSummery,
    currentBalanceAmount
  )

  return (
    <Layout>
      {`current balance amount ${currentBalanceAmount}`}
      <dl className={styles.timeline}>
        {transactionsWithBalanceSummery.map((transaction, index) => {
          return <TransactionsSummery key={index} transaction={transaction} />
        })}
      </dl>
    </Layout>
  )
}
export default Timeline
