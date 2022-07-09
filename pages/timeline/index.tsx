import {
  calcCurrentBalanceAmount,
  generateTransactionConfigsOccurrences,
} from 'utils/transactionsCalculator'
import {
  addBalanaceAmountToTransactionsSummery,
  getLastDayOfPeriod,
  getTransactionsSummeryByPeriod,
  TimelineSummerizedTransacrionsPeriod,
} from 'utils/timelineTrascationCalc'
import useTransaction from '../../hooks/useTransactions'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import { TimePeriod } from 'utils/types'
import { format } from 'date-fns'
import styles from './Timeline.module.scss'
import React, { useEffect, useState } from 'react'
import Arrow, { Direction } from 'components/arrow'
import TextNumber from 'components/textNumber'
import Loader from 'components/loader'
import InfiniteScroll from 'react-infinite-scroller'
import useEnsureLogin from '../../hooks/useEnsureLogin'
import useMortgages from 'hooks/useMortgages'
import { generateTransactionMortgageOccurrences } from 'utils/amortizationScheduleCalculator'

function TransactionsSummery({
  transaction,
  periodResolution,
}: {
  transaction: TimelineSummerizedTransacrionsPeriod
  periodResolution: TimePeriod
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
                  getLastDayOfPeriod(transaction.time, periodResolution),
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

function Timeline({
  fromDate = new Date(),
  untilDate,
}: {
  fromDate?: Date
  untilDate: Date
}) {
  const { balanceStatuses, isLoading: isLoadingBalance } =
    useBalanceStatus(true)

  const { transactions } = useTransaction()
  const [periodResolution, setPeriodResolution] = useState(TimePeriod.YEAR)
  const [timelineTransactions, setTimelineTransactions] = useState<
    TimelineSummerizedTransacrionsPeriod[]
  >([])
  const [currentBalanceAmount, setCurrentBalanceAmount] = useState(0)
  const [numberOFitems, setNumberOFitems] = useState(5)
  const [hasMore, setHasMore] = useState(false)
  const { mortgages } = useMortgages()

  useEffect(() => {
    if (
      isLoadingBalance ||
      !transactions ||
      !balanceStatuses?.[0] ||
      !mortgages
    ) {
      return
    }

    const currentBalanceAmount = calcCurrentBalanceAmount(
      transactions,
      balanceStatuses?.[0]!
    )

    setCurrentBalanceAmount(currentBalanceAmount)

    const allTransactionsOccurrences = generateTransactionConfigsOccurrences(
      transactions,
      fromDate,
      untilDate
    )
      ?.concat(
        generateTransactionMortgageOccurrences(mortgages, fromDate, untilDate)
      )
      ?.sort(function compare(t1, t2) {
        return t1.date.getTime() - t2.date.getTime()
      })

    const transactionsSummery = getTransactionsSummeryByPeriod(
      allTransactionsOccurrences,
      periodResolution,
      numberOFitems,
      fromDate,
      untilDate
    )

    if (transactionsSummery.length === timelineTransactions.length) {
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
    balanceStatuses,
    transactions,
    currentBalanceAmount,
    numberOFitems,
    periodResolution,
    isLoadingBalance,
    fromDate,
    untilDate,
  ])

  const loadmore = () => {
    setNumberOFitems(numberOFitems + 5)
  }

  if (!transactions || !balanceStatuses) {
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
          pageStart={0}
          loadMore={loadmore}
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
              />
            )
          })}
        </InfiniteScroll>
      </dl>
    </div>
  )
}
export default Timeline
