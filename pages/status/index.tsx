import { format, add } from 'date-fns'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import useTransaction from '../../hooks/useTransactions'
import { BalanceStatus, TransactionConfig } from '../../utils/prisma'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
} from '../../utils/transactionsCalculator'
import Layout from '../../components/layout'
import styles from './Status.module.scss'
import { LineChart, BarChart } from '../../components/Charts'
import Ticker from '../../components/Ticker'

function Status() {
  const router = useRouter()
  const { error, data: balanceStatus } = useSWR<BalanceStatus[]>(
    '/api/balance-statuses',
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((r: BalanceStatus[]) =>
          r.map(({ createdAt, ...rest }) => ({
            createdAt: new Date(createdAt),
            ...rest,
          }))
        )
  )

  const balanceGraphData = balanceStatus?.map(({ amount, createdAt }) => ({
    x: format(createdAt, 'dd/MM/yyyy hh:mm'),
    y: amount,
  }))

  const { transactions } = useTransaction()
  if (!transactions || !balanceStatus) {
    return 'loading'
  }

  const allTransactionsOccurances = generateTransactionConfigsOccurances(
    transactions,
    new Date(),
    add(Date.now(), { months: 6 })
  )
  const transactionToView = addBalanaceToSortTransaction(
    allTransactionsOccurances.filter(
      ({ date }) =>
        date.getTime() >=
        balanceStatus[balanceStatus.length - 1].createdAt.getTime()
    ),
    balanceStatus[balanceStatus.length - 1]
  )

  const transactionsGraphData = [
    balanceGraphData![balanceGraphData!.length - 1],
  ].concat(
    transactionToView.map(({ balance, date }) => ({
      x: format(date, 'dd/MM/yyyy hh:mm'),
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

  const earningsSpendings = transactions.reduce(
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

  return (
    <Layout>
      <div className={styles.status}>
        <div className={styles.first}>
          <Ticker number={balanceStatus[balanceStatus.length - 1].amount} />
        </div>
        <div className={styles.graphs}>
          <div className={styles.lineChart}>
            <LineChart data={lineChartData} />
          </div>
          <div className={styles.barChart}>
            <BarChart
              data={barChartData}
              indexBy="type"
              keys={transactions.map((cur) => cur.type)}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Status
