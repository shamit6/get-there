import { ResponsiveLine } from '@nivo/line'
import { format, add } from 'date-fns'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import useTransaction from '../../hooks/useTransactions'
import { BalanceStatus } from '../../utils/prisma'
import {
  generateTransactionConfigsOccurances,
  addBalanaceToSortTransaction,
} from '../../utils/transactionsCalculator'

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
    //@ts-ignore
    transactions,
    add(Date.now(), { years: 1 })
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
      color: '#FFA726',
      data: balanceGraphData,
    },
    {
      id: 'Predicted Balance',
      color: '#FFE0B2',
      data: transactionsGraphData,
    },
  ]

  return (
    <div style={{ height: '90vh' }}>
      <LineChart data={lineChartData} />
    </div>
  )
}
export default Status

function LineChart({ data }: any) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Updated',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Amount',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  )
}
