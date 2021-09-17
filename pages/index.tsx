import { useRouter } from 'next/router'
import useUser from '../hooks/useUser'
import { useEffect, useState } from 'react'
import { format, startOfDay, addYears } from 'date-fns'
import useTransaction from '../hooks/useTransactions'
import useBalancesStatus from '../hooks/useBalanceStatus'
import { TransactionConfig } from '../utils/prisma'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
  calcCurrentBalanceAmount,
  getCurrentMonthBalanceAmount,
  getCurrentYearBalanceAmount,
  getTransactionConfigsAmounts,
} from '../utils/transactionsCalculator'
import Layout from '../components/layout'
import styles from './Status.module.scss'
import { LineChart, BarChart } from '../components/Charts'
import Ticker from '../components/Ticker'
import Loader from '../components/loader'
import Field from '../components/Field'
import ScrollToTopButton from '../components/ScrollToTopButton'
import Timeline from './timeline'

export default function Home() {
  const nowDate = new Date()
  const { user, loading } = useUser()
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>(startOfDay(nowDate))
  const [endDate, setEndDate] = useState<Date>(startOfDay(addYears(nowDate, 1)))

  useEffect(() => {
    if (!(user || loading)) {
      router.replace('/login')
    }
  }, [user, loading])

  const { error, balanceStatuses } = useBalancesStatus()

  const balanceGraphData = balanceStatuses?.map(({ amount, createdAt }) => ({
    x: format(createdAt, 'dd/MM/yyyy'),
    y: amount,
  }))

  const { transactions } = useTransaction()
  if (!transactions || !balanceStatuses) {
    return <Loader />
  }

  const allTransactionsOccurances = generateTransactionConfigsOccurances(
    transactions,
    startDate,
    endDate
  )
  const transactionToView = addBalanaceToSortTransaction(
    allTransactionsOccurances.filter(
      ({ date }) =>
        date.getTime() >=
        balanceStatuses[balanceStatuses.length - 1].createdAt.getTime()
    ),
    balanceStatuses[balanceStatuses.length - 1]
  )

  const transactionsGraphData = [
    balanceGraphData![balanceGraphData!.length - 1],
  ].concat(
    transactionToView.map(({ balance, date }) => ({
      x: format(date, 'dd/MM/yyyy'),
      y: balance!,
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

  const totalTransactioAmounnts = getTransactionConfigsAmounts(
    transactions,
    startDate,
    endDate
  )
  const earningsSpendings = totalTransactioAmounnts.reduce(
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
    balanceStatuses[balanceStatuses.length - 1]
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
          <Field label="From date:">
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                setStartDate(e.target.valueAsDate!)
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
        </div>
        <Timeline fromDate={startDate} untillDate={endDate} />
        <ScrollToTopButton />
      </div>
    </Layout>
  )
}
