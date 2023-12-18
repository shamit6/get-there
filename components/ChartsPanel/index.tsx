import React from 'react'
import { format, isAfter, subMonths } from 'date-fns'
import type { Transaction } from 'utils/types'
import { getTransactionAmounts } from 'utils/transactionsCalculator'
import { LineChart, BarChart } from 'components/Charts'
import useBalanceStatus from 'hooks/useBalanceStatus'
import styles from './ChartsPanel.module.scss'
import useTransactionsView from 'hooks/useTransactionsView'
import { maxBy } from 'lodash'
import { useTranslation } from 'hooks/useTranslation'

export default function ChartPanel() {
  const { balanceStatuses } = useBalanceStatus()
  const nowDate = new Date()
  const { t } = useTranslation()

  const {
    transactionsToView,
    transactionsWithBalanceToView,
    targetAmountIndex,
  } = useTransactionsView()

  if (!balanceStatuses) {
    return null
  }

  const lastBalanceStatuses = balanceStatuses?.filter(
    ({ createdAt }, index) =>
      isAfter(createdAt, subMonths(nowDate, 5)) || index === 0
  )
  const lastBalanceStatus = lastBalanceStatuses[0]

  const balanceGraphData = lastBalanceStatuses?.map(
    ({ amount, createdAt }) => ({
      x: format(createdAt, 'dd/MM/yyyy'),
      y: amount,
    })
  )

  const transactionsGraphData = [
    {
      x: format(lastBalanceStatus.createdAt, 'dd/MM/yyyy'),
      y: lastBalanceStatus.amount,
    },
  ].concat(
    transactionsWithBalanceToView.map(({ amount, date }) => ({
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
    lineChartData.unshift({
      id: 'Target Amount',
      color: '#e00a1f',
      data: [
        {
          x: format(transactionsToView[targetAmountIndex].date, 'dd/MM/yyyy'),
          y: 0,
        },
        {
          x: format(transactionsToView[targetAmountIndex].date, 'dd/MM/yyyy'),
          y:
            maxBy(transactionsWithBalanceToView, 'amount')?.amount ?? 0 + 40000,
        },
      ],
    })
  }

  const totalTransactionAmounts = getTransactionAmounts(
    transactionsToView.slice(0, targetAmountIndex)
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
  const sums = earningsSpendings.map((earnSpend) => {
    return earnSpend.reduce((res, cur) => {
      return res + Math.abs(cur.amount)
    }, 0)
  })

  const barChartData = earningsSpendings.map((earnSpend, index) => {
    const earnings = index === 0
    const type = earnings ? 'Earnings' : 'Spendings'
    const sum: string = Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(sums[index])
    return {
      type: `${type} ${sum}`,
      ...earnSpend.reduce((res, cur) => {
        res[t(cur.type)] = Math.abs(cur.amount)
        res[`${t(cur.type)}Color`] = earnings ? '#036666' : '#e01e37'
        return res
      }, {} as any),
    }
  })

  const barChartKeys = [
    ...earningsSpendings[0].map((cur) => t(cur.type)),
    ...earningsSpendings[1].map((cur) => t(cur.type)),
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
