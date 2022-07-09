import React from 'react'
import { format, isAfter, subMonths } from 'date-fns'

import type{ Transaction } from 'utils/types'
import {
  generateTransactionConfigsOccurrences,
  addBalanceToSortTransaction,
  getTransactionAmounts,
} from 'utils/transactionsCalculator'
import { LineChart, BarChart } from 'components/Charts'
import useBalanceStatus from 'hooks/useBalanceStatus'
import useTransactions from 'hooks/useTransactions'
import styles from './ChartsPanel.module.scss'
import useMortgages from 'hooks/useMortgages'
import { generateTransactionMortgageOccurrences } from 'utils/amortizationScheduleCalculator'

export default function ChartPanel({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) {
  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransactions()
  const { mortgages } = useMortgages()

  if (!transactions || !balanceStatuses || !mortgages) {
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
    ?.concat(
      generateTransactionMortgageOccurrences(mortgages, startDate, endDate)
    )
    ?.sort(function compare(t1, t2) {
      return t1.date.getTime() - t2.date.getTime()
    })

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

  const totalTransactionAmounts = getTransactionAmounts(
    allTransactionsOccurrences
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
    [[], []] as [Transaction[], Transaction[]]
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

  const barChartKeys = [
    ...earningsSpendings[0].map((cur) => cur.type),
    ...earningsSpendings[1].map((cur) => cur.type),
  ]

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
