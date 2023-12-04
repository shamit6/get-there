'use client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import { PageHeader } from 'components/Field'
import Table from 'components/Table'
import useTransactions from 'hooks/useTransactions'

const TABLE_COLUMNS = [
  {
    name: 'Type',
    path: 'type',
  },
  {
    name: 'Amount',
    path: 'amount',
    format: (value: number) => value.toLocaleString('he'),
  },
  {
    name: 'When',
    path: 'date',
    format: (date: Date) => format(date, 'dd/MM/yyyy'),
  },
  {
    name: 'Interval',
    path: ['timePeriod', 'periodAmount'],
    format: (timePeriod: number, ...periodAmount: number[]) =>
      timePeriod && `every ${periodAmount} ${timePeriod}`,
  },
]

function List() {
  const router = useRouter()
  const { transactions } = useTransactions()

  return (
    <>
      <PageHeader title="Transactions">
        <Button
          text="New transaction"
          onClick={() => router.push('/transactions/new')}
          bordered
          linkTheme
          icon={<Add />}
        />
      </PageHeader>
      <Table
        columns={TABLE_COLUMNS}
        onRowClick={(id: string) => router.push(`/transactions/${id}`)}
        rows={transactions}
      />
    </>
  )
}
export default List
