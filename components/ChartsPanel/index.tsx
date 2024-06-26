import React from 'react'
import { format, isAfter, subMonths } from 'date-fns'
import type { Transaction } from 'utils/types'
import {
  generateAssetsValuesOccurrences,
  getTransactionAmounts,
} from 'utils/transactionsCalculator'
import { LineChart, BarChart } from 'components/Charts'
import useBalanceStatus from 'hooks/useBalanceStatus'
import styles from './ChartsPanel.module.scss'
import useTransactionsView from 'hooks/useTransactionsView'
import { useTranslation } from 'hooks/useTranslation'
import useAssets from 'hooks/useAssets'
import type { CartesianMarkerProps } from '@nivo/core'

export default function ChartPanel() {
  const { balanceStatuses } = useBalanceStatus()
  const nowDate = new Date()
  const { t } = useTranslation()

  const {
    transactionsToView,
    transactionsWithBalanceToView,
    targetAmountIndex,
  } = useTransactionsView()

  const { assets } = useAssets()

  if (!balanceStatuses) {
    return null
  }

  const lastBalanceStatuses = balanceStatuses?.filter(
    ({ createdAt }, index) =>
      isAfter(createdAt, subMonths(nowDate, 5)) || index === 0
  )
  const lastBalanceStatus = lastBalanceStatuses[0]

  // const balanceGraphData = lastBalanceStatuses?.map(
  //   ({ amount, createdAt }) => ({
  //     x: format(createdAt, 'dd/MM/yyyy'),
  //     y: amount,
  //   })
  // )

  const transactionsGraphData = [
    {
      x: format(lastBalanceStatus.createdAt, 'dd/MM/yyyy'),
      y: lastBalanceStatus.amount,
    },
  ].concat(
    transactionsWithBalanceToView.map(({ amount, date }) => ({
      x: format(date, 'dd/MM/yyyy'),
      y: amount,
    }))
  )

  const assetValuesGraphData = generateAssetsValuesOccurrences(
    assets,
    [
      {
        date: lastBalanceStatus.createdAt,
      } as Transaction,
    ].concat(transactionsWithBalanceToView)
  ).map(({ amount, date }) => ({
    x: format(date, 'dd/MM/yyyy'),
    y: amount,
  }))

  const lineChartData = [
    {
      id: 'Predicted Balance',
      color: '#e0aaff',
      data: transactionsGraphData,
    },
    // {
    //   id: 'Balance',
    //   color: '#9d4edd',
    //   data: balanceGraphData,
    // },
  ]

  if (assets.length > 0) {
    lineChartData.unshift({
      id: 'Assets',
      color: '#9d0e0d',
      data: assetValuesGraphData,
    })
  }

  let markers: CartesianMarkerProps[] = []
  if (targetAmountIndex !== undefined) {
    markers = [
      {
        axis: 'x',
        value: transactionsToView[targetAmountIndex].date,
        lineStyle: {
          stroke: '#e00a1f',
          strokeWidth: 2,
        },
        legend: t('target'),
      },
    ]
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
        <LineChart data={lineChartData} stacked markers={markers} />
      </div>
      <div className={styles.barChart}>
        <BarChart data={barChartData} indexBy="type" keys={barChartKeys} />
      </div>
    </>
  )
}
