import {
  addBalanaceAmountToTransactionsSummery,
  getLastDayOfPeriod,
  getTransactionsSummeryByPeriod,
  SummerizedTransacrionsPeriod,
  TimelineSummerizedTransacrionsPeriod,
} from 'utils/timelineTrascationCalc'
import { TimePeriod } from 'utils/types'
import { format, min } from 'date-fns'
import styles from './Timeline.module.scss'
import React, { useEffect, useState } from 'react'
import Arrow, { Direction } from 'components/arrow'
import TextNumber from 'components/textNumber'
import InfiniteScroll from 'react-infinite-scroll-component'
import useTransactionsView from 'hooks/useTransactionsView'
import { useTranslation } from 'hooks/useTranslation'

function TransactionsSummery({
  transaction,
  periodResolution,
  maxDate,
}: {
  transaction: TimelineSummerizedTransacrionsPeriod
  periodResolution: TimePeriod
  maxDate: Date
}) {
  const [isOpen, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div>
      <dt className={styles.periodTitle}>
        {transaction.time.month != undefined
          ? `${transaction.time.month + 1} - `
          : ''}
        {transaction.time.year}
      </dt>
      <dd className={styles.periodContent}>
        <Arrow
          className={styles.collapseIcon}
          direction={isOpen ? Direction.DOWN : Direction.RIGHT}
        />
        <table className={styles.periodTransactionAmounts}>
          <thead>
            <tr
              onClick={() => setOpen(!isOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <td>{t('totalIncome')}</td>
              <td dir="ltr" className={styles.amount}>
                <TextNumber value={transaction.totalAmount} />
              </td>
            </tr>
          </thead>
          <tbody>
            {isOpen &&
              transaction.transactions.map((spesificTransaction) => (
                <tr key={spesificTransaction.type}>
                  <td>{t(spesificTransaction.type)}</td>
                  <td dir="ltr" className={styles.amount}>
                    <TextNumber value={spesificTransaction.amount} />
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot style={{ margin: '.3em 0' }}>
            <tr>
              <td style={{ padding: '.5em 0' }}>
                {t('expectedBalanceOn', {
                  date: format(
                    min([
                      getLastDayOfPeriod(transaction.time, periodResolution),
                      maxDate,
                    ]),
                    'P'
                  ),
                })}
              </td>
              <td
                style={{ padding: '.5em 0' }}
                dir="ltr"
                className={styles.amount}
              >
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
  const [periodResolution, setPeriodResolution] = useState(TimePeriod.YEAR)
  const [timelineTransactions, setTimelineTransactions] = useState<
    TimelineSummerizedTransacrionsPeriod[]
  >([])

  const [transactionsSummery, setTransactionsSummery] = useState<
    SummerizedTransacrionsPeriod[]
  >([])
  const [hasMore, setHasMore] = useState(true)
  const { t } = useTranslation()

  const {
    transactionsToView,
    transactionsWithBalanceToView,
    currentBalanceAmount,
  } = useTransactionsView()

  const untilDate =
    transactionsWithBalanceToView[transactionsWithBalanceToView.length - 1].date

  useEffect(() => {
    if (transactionsToView?.length === 0) {
      return
    }

    setTransactionsSummery(
      getTransactionsSummeryByPeriod(
        transactionsToView,
        periodResolution,
        new Date(),
        transactionsToView[transactionsToView.length - 1].date
      )
    )
  }, [
    // transactionsToView,
    transactionsToView.length,
    currentBalanceAmount,
    transactionsSummery.length,
    periodResolution,
  ])

  useEffect(() => {
    const transactionsWithBalanceSummery =
      addBalanaceAmountToTransactionsSummery(
        transactionsSummery,
        currentBalanceAmount
      )
    setTimelineTransactions(
      transactionsWithBalanceSummery.slice(
        0,
        Math.min(5, transactionsWithBalanceSummery.length)
      )
    )
    if (
      transactionsSummery?.length ===
      Math.min(5, transactionsWithBalanceSummery.length)
    ) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [transactionsSummery])

  const loadmore = () => {
    const newTimelineTransactionsLength = Math.min(
      timelineTransactions.length + 5,
      transactionsSummery.length
    )
    const transactionsWithBalanceSummery =
      addBalanaceAmountToTransactionsSummery(
        transactionsSummery,
        currentBalanceAmount
      )
    setTimelineTransactions(
      transactionsWithBalanceSummery.slice(0, newTimelineTransactionsLength)
    )
    if (transactionsSummery?.length === newTimelineTransactionsLength) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }

  if (transactionsToView.length === 0) {
    return null
  }

  return (
    <div className={styles.timeline}>
      <div style={{ display: 'flex' }}>
        <span style={{ flex: '1' }}>
          {t('currentEstimatedBalanceIs', {
            amount: currentBalanceAmount.toLocaleString('he', {
              style: 'currency',
              currency: 'ILS',
              maximumFractionDigits: 0,
            }),
          })}
        </span>
        <select
          defaultValue={TimePeriod.YEAR}
          onChange={(e) => {
            setTimelineTransactions([])
            setPeriodResolution(e.target.value as TimePeriod)
          }}
        >
          <option value={TimePeriod.MONTH}>{t('month')}</option>
          <option value={TimePeriod.YEAR}>{t('year')}</option>
        </select>
      </div>
      <dl>
        <InfiniteScroll
          style={{ overflowX: 'hidden' }}
          dataLength={timelineTransactions.length}
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
