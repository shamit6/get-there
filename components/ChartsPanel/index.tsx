import React from 'react'
import { format, isAfter, subMonths } from 'date-fns'

import { TransactionConfig } from 'utils/types'
import {
  generateTransactionConfigsOccurrences,
  addBalanceToSortTransaction,
  getTransactionConfigsAmounts,
} from 'utils/transactionsCalculator'
import { LineChart, BarChart } from 'components/Charts'
import useBalanceStatus from 'hooks/useBalanceStatus'
import useTransactions from 'hooks/useTransactions'
import styles from './ChartsPanel.module.scss'

export default function ChartPanel({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) {
  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransactions()

  if (!transactions || !balanceStatuses) {
    return null
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

  const allTransactionsOccurrences = generateTransactionConfigsOccurrences(
    transactions,
    startDate,
    endDate
  )
  const transactionToView = addBalanceToSortTransaction(
    allTransactionsOccurrences.filter(
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

  const barChartKeys = Array.from(
    new Set(
      transactions
        .filter(
          ({ type }) => !!barChartData[0][type] || !!barChartData[1][type]
        )
        .map((cur) => cur.type)
    )
  )

  return (
    <>
      <div className={styles.lineChart}>
        <LineChart data={lineChartData} />
      </div>
      <div className={styles.barChart}>
        <BarChart data={barChartData} indexBy="type" keys={barChartKeys} />
      </div>
    </>
  )
}
