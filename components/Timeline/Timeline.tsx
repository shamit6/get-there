import {
  addBalanaceAmountToTransactionsSummery,
  getLastDayOfPeriod,
  getTransactionsSummeryByPeriod,
  TimelineSummerizedTransacrionsPeriod,
} from 'utils/timelineTrascationCalc'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import { TimePeriod } from 'utils/types'
import { format, min } from 'date-fns'
import styles from './Timeline.module.scss'
import React, { useEffect, useState } from 'react'
import Arrow, { Direction } from 'components/arrow'
import TextNumber from 'components/textNumber'
import Loader from 'components/loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import useEnsureLogin from '../../hooks/useEnsureLogin'
import useTransactionsView from 'hooks/useTransactionsView'

function TransactionsSummery({
  transaction,
  periodResolution,
  maxDate,
}: {
  transaction: TimelineSummerizedTransacrionsPeriod
  periodResolution: TimePeriod
  maxDate: Date
}) {
  useEnsureLogin()
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
                Total income
              </th>
              <th style={{ textAlign: 'right' }}>
                <TextNumber value={transaction.totalAmount} />
              </th>
            </tr>
          </thead>
          <tbody>
            {isOpen &&
              transaction.transactions.map((spesificTransaction) => (
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
                  min([
                    getLastDayOfPeriod(transaction.time, periodResolution),
                    maxDate,
                  ]),
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
  const { isLoading: isLoadingBalance } = useBalanceStatus(true)

  const [periodResolution, setPeriodResolution] = useState(TimePeriod.YEAR)
  const [timelineTransactions, setTimelineTransactions] = useState<
    TimelineSummerizedTransacrionsPeriod[]
  >([])

  const [numberOFitems, setNumberOFitems] = useState(5)
  const [hasMore, setHasMore] = useState(false)

  const { transactionsToView, transactionsWithBalanceToView, targetAmountIndex, currentBalanceAmount } =
    useTransactionsView()

  const nowDate = new Date()
  const untilDate = transactionsWithBalanceToView[transactionsWithBalanceToView.length - 1].date

  useEffect(() => {
    if (transactionsToView?.length === 0) {
      return
    }

    const transactionsSummery = getTransactionsSummeryByPeriod(
      transactionsToView,
      periodResolution,
      numberOFitems,
      nowDate,
      untilDate
    )

    if (transactionsSummery?.length === timelineTransactions?.length) {
      setHasMore(false)
    } else {
      const transactionsWithBalanceSummery =
        addBalanaceAmountToTransactionsSummery(
          transactionsSummery,
          currentBalanceAmount
        )

      setTimelineTransactions(transactionsWithBalanceSummery)
      setHasMore(true)
    }
  }, [
    transactionsToView,
    currentBalanceAmount,
    numberOFitems,
    periodResolution,
    isLoadingBalance,
    untilDate,
    targetAmountIndex,
  ])

  const loadmore = () => {
    setNumberOFitems(numberOFitems + 5)
  }

  if (transactionsToView.length === 0) {
    return <Loader />
  }

  return (
    <div className={styles.timeline}>
      <div style={{ display: 'flex' }}>
        <span style={{ flex: '1' }}>
          current balance amount <TextNumber value={currentBalanceAmount} />
        </span>
        <select
          defaultValue={TimePeriod.YEAR}
          onChange={(e) => {
            setTimelineTransactions([])
            setPeriodResolution(e.target.value as TimePeriod)
          }}
        >
          <option value={TimePeriod.MONTH}>month</option>
          <option value={TimePeriod.YEAR}>year</option>
        </select>
      </div>
      <dl>
        <InfiniteScroll
          dataLength={numberOFitems}
          next={loadmore}
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          {timelineTransactions.map((transaction, index) => {
            return (
              <TransactionsSummery
                key={index}
                transaction={transaction}
                periodResolution={periodResolution}
                maxDate={untilDate}
              />
            )
          })}
        </InfiniteScroll>
      </dl>
    </div>
  )
}
export default Timeline
