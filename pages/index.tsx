import { useState } from 'react'
import { format, startOfDay, addYears, isAfter, subMonths } from 'date-fns'
import useTransaction from '../hooks/useTransactions'
import useBalancesStatus from '../hooks/useBalanceStatus'
import { TransactionConfig } from 'utils/types'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
  calcCurrentBalanceAmount,
  getCurrentMonthBalanceAmount,
  getCurrentYearBalanceAmount,
  getTransactionConfigsAmounts,
} from 'utils/transactionsCalculator'
import Layout from 'components/layout'
import styles from './Status.module.scss'
import { LineChart, BarChart } from 'components/Charts'
import Ticker from 'components/Ticker'
import Loader from 'components/loader'
import Field from 'components/Field'
import ScrollToTopButton from 'components/ScrollToTopButton'
import Timeline from './timeline'
import useEnsureLogin from '../hooks/useEnsureLogin'
import { roundUp } from 'utils/roundUp'

export default function Home() {
  const nowDate = new Date()
  const [startDate, setStartDate] = useState<Date>(startOfDay(nowDate))
  const [endDate, setEndDate] = useState<Date>(startOfDay(addYears(nowDate, 1)))

  useEnsureLogin()

  const { balanceStatuses } = useBalancesStatus()
  const { transactions } = useTransaction()

  const [targetAmount, setTargetAmount] = useState<number>(
    roundUp(balanceStatuses?.[balanceStatuses?.length - 1].amount)
  )

  if (!transactions || !balanceStatuses) {
    return (
      <Layout>
        <Loader />
      </Layout>
    )
  } else if (balanceStatuses.length === 0) {
    return <Layout>Empty State</Layout>
  }

  const lastBalanceStatuses = balanceStatuses?.filter(
    ({ createdAt }, index) =>
      isAfter(createdAt, subMonths(new Date(), 5)) || index === 0
  )

  const balanceGraphData = lastBalanceStatuses?.map(
    ({ amount, createdAt }) => ({
      x: format(createdAt, 'dd/MM/yyyy'),
      y: amount,
    })
  )

  const allTransactionsOccurances = generateTransactionConfigsOccurances(
    transactions,
    startDate,
    endDate
  )
  const transactionToView = addBalanaceToSortTransaction(
    allTransactionsOccurances.filter(
      ({ date }) => date.getTime() >= lastBalanceStatuses[0].createdAt.getTime()
    ),
    lastBalanceStatuses[0]
  )

  const transactionsGraphData = [balanceGraphData![0]].concat(
    transactionToView.map(({ amount, date }) => ({
      x: format(date, 'dd/MM/yyyy'),
      y: amount!,
    }))
  )

  const lineChartData = [
    {
      id: 'Balance',
      color: '#9d4edd',
      data: balanceGraphData,
    },
    {
      id: 'Predicted Balance',
      color: '#e0aaff',
      data: transactionsGraphData,
    },
  ]

  const totalTransactionAmounts = getTransactionConfigsAmounts(
    transactions,
    startDate,
    endDate
  )
  const earningsSpendings = totalTransactionAmounts.reduce(
    (res, cur) => {
      if (cur.amount > 0) {
        // @ts-ignore-next-line
        res[0].push(cur)
      } else {
        // @ts-ignore-next-line
        res[1].push(cur)
      }
      return res
    },
    [[], []] as [TransactionConfig[], TransactionConfig[]]
  )

  const barChartData = earningsSpendings.map((earnSpend, index) => {
    const earnings = index === 0
    return {
      type: earnings ? 'Earnings' : 'Spendings',
      ...earnSpend.reduce((res, cur) => {
        res[cur.type] = Math.abs(cur.amount)
        res[`${cur.type}Color`] = earnings ? '#036666' : '#e01e37'
        return res
      }, {} as any),
    }
  })

  const currentBalanceAmount = calcCurrentBalanceAmount(
    transactions,
    balanceStatuses[0]
  )

  const currentYearBalanceAmount = getCurrentYearBalanceAmount(
    transactions,
    nowDate
  )
  const currentMonthBalanceAmount = getCurrentMonthBalanceAmount(
    transactions,
    nowDate
  )

  return (
    <Layout>
      <div className={styles.status}>
        <div className={styles.first}>
          <Ticker label="Balance" number={currentBalanceAmount} />
          <div className={styles.smallTickers}>
            <Ticker
              small
              label="This Year"
              prefix={currentYearBalanceAmount < 0 ? '-' : '+'}
              number={currentYearBalanceAmount}
              duration={4}
            />
            <Ticker
              small
              label="This Month"
              prefix={currentMonthBalanceAmount < 0 ? '-' : '+'}
              number={currentMonthBalanceAmount}
              duration={4}
            />
            <Ticker
              small
              label="Month AVG"
              prefix={currentYearBalanceAmount < 0 ? '-' : '+'}
              number={currentYearBalanceAmount / 12}
              duration={4}
            />
          </div>
        </div>
        <div className={styles.filterPanel}>
          {/* <Field label="From date:">
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                setStartDate(e.target.valueAsDate!)
              }}
            />
          </Field> */}
          <Field label="Target amount:">
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => {
                setTargetAmount(e.target.valueAsNumber)
              }}
            />
          </Field>
          <Field label="Until date:">
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                setEndDate(e.target.valueAsDate!)
              }}
            />
          </Field>
        </div>
        <div className={styles.graphs}>
          <div className={styles.lineChart}>
            <LineChart data={lineChartData} />
          </div>
          <div className={styles.barChart}>
            <BarChart
              data={barChartData}
              indexBy="type"
              keys={Array.from(new Set(transactions.map((cur) => cur.type)))}
            />
          </div>
          <div className={styles.timeline}>
            <Timeline fromDate={startDate} untillDate={endDate} />
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </Layout>
  )
}
