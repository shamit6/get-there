'use client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import { PageHeader } from 'components/Field'
import Table from 'components/Table'
import useTransactions from 'hooks/useTransactions'
import { useTranslation } from 'hooks/useTranslation'

const getTableColumns = (t: (key: string, params?: any) => string) => [
  {
    name: t('transactionType'),
    path: 'type',
  },
  {
    name: t('amount'),
    path: 'amount',
    format: (value: number) => value.toLocaleString('he'),
  },
  {
    name: t('when'),
    path: 'date',
    format: (date: Date) => format(date, 'dd/MM/yyyy'),
  },
  {
    name: t('interval'),
    path: ['timePeriod', 'periodAmount'],
    format: (timePeriod: number, ...periodAmount: number[]) =>
      timePeriod &&
      t('intervalDescription', {
        periodAmount,
        timePeriod: t(String(timePeriod)),
      }),
  },
]

export default function TransactionTable() {
  const router = useRouter()
  const { transactions } = useTransactions()
  const { t } = useTranslation()

  const tableColumns = getTableColumns(t)

  return (
    <>
      <PageHeader title={t('transactions')}>
        <Button
          text={t('newTransaction')}
          onClick={() => router.push('/transactions/new')}
          bordered
          linkTheme
          icon={<Add />}
        />
      </PageHeader>
      <Table
        columns={tableColumns}
        onRowClick={(id: string) => router.push(`/transactions/${id}`)}
        rows={transactions}
      />
    </>
  )
}
