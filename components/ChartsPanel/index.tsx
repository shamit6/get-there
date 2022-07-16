import React from 'react'
import { addMonths, format, isAfter, subMonths } from 'date-fns'

import type { Transaction } from 'utils/types'
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
import useFilterOptions from 'hooks/useFilterOptions'

export default function ChartPanel() {
  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransactions()
  const { mortgages } = useMortgages()
  const nowDate = new Date()

  if (!transactions || !balanceStatuses || !mortgages) {
    return null
  }

  const {
    filter: { endDate, targetAmount },
    filterUntilAmount,
  } = useFilterOptions()

  const lastBalanceStatuses = balanceStatuses?.filter(
    ({ createdAt }, index) =>
      isAfter(createdAt, subMonths(nowDate, 5)) || index === 0
  )

  const balanceGraphData = lastBalanceStatuses?.map(
    ({ amount, createdAt }) => ({
      x: format(createdAt, 'dd/MM/yyyy'),
      y: amount,
    })
  )

  const lastBalanceStatus = lastBalanceStatuses[0]

  const allTransactionsOccurrences = generateTransactionConfigsOccurrences(
    transactions,
    lastBalanceStatus.createdAt,
    endDate ?? addMonths(nowDate, 30 * 12 + 4)
  )
    ?.concat(
      generateTransactionMortgageOccurrences(
        mortgages,
        nowDate,
        endDate ?? addMonths(nowDate, 30 * 12 + 4)
      )
    )
    ?.sort(function compare(t1, t2) {
      return t1.date.getTime() - t2.date.getTime()
    })

  const transactionWithBalance = addBalanceToSortTransaction(
    allTransactionsOccurrences,
    lastBalanceStatuses[0]
  )

  let transactionToView: Transaction[] = []
  let targetAmountIndex

  if (targetAmount) {
    try {
      const { index, transactionsUntilAmount } = filterUntilAmount(transactionWithBalance, targetAmount)
      targetAmountIndex = index
      transactionToView = transactionsUntilAmount
    } catch {
      transactionToView = transactionWithBalance
      targetAmountIndex = transactionToView.length
    }
  } else {
    transactionToView = transactionWithBalance.filter(
      ({ date }) => date.getTime() >= lastBalanceStatuses[0].createdAt.getTime()
    )
  }

  const transactionsGraphData = [
    {
      x: format(lastBalanceStatus.createdAt, 'dd/MM/yyyy'),
      y: lastBalanceStatus.amount,
    },
  ].concat(
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

  if (targetAmountIndex !== undefined) {
    lineChartData.push({
      id: 'Target Amount',
      color: '#e00a1f',
      data: [
        {
          x: format(transactionToView[targetAmountIndex].date, 'dd/MM/yyyy'),
          y: 0,
        },
        {
          x: format(transactionToView[targetAmountIndex].date, 'dd/MM/yyyy'),
          y: transactionToView[targetAmountIndex].amount + 20000,
        },
      ],
    })
  }

  const totalTransactionAmounts = getTransactionAmounts(
    allTransactionsOccurrences.slice(0, targetAmountIndex)
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
