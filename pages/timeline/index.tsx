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
import classnames from 'classnames'
import { useState } from 'react'

function Arrow({ className }: { className: string }) {
  return <div className={classnames(styles.arrow, styles.right, className)} />
}

function TransactionsSummery({
  transaction,
}: {
  transaction: TimelineSummerizedTransacrionsPeriod
}) {
  const [isOpen, setOpen] = useState(false)

  return (
    <div>
      <dt className={styles.periodTitle}>{transaction.time.year}</dt>
      <dd className={styles.periodContent}>
        <table>
          <tbody>
            <tr
              onClick={() => setOpen(!isOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <td>
                <Arrow className={styles.collapseIcon} /> total income:
              </td>
              <td style={{ textAlign: 'right' }}>{transaction.totalAmount}</td>
            </tr>
            {isOpen &&
              transaction.transaction.map((spesificTransaction) => (
                <tr key={spesificTransaction.type}>
                  <td>{spesificTransaction.type}:</td>
                  <td style={{ textAlign: 'right' }}>
                    {spesificTransaction.amount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {`On ${format(
          getLastDayOfPeriod(transaction.time, TimePeriod.YEAR),
          'dd/MM/yyyy'
        )}, expected balance: ${transaction.amountWithBalance}`}
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
    3,
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
