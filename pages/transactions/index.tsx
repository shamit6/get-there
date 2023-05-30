import { format } from 'date-fns'
import { useRouter } from 'next/router'
import useTransaction from '../../hooks/useTransactions'
import Layout from 'components/layout'
import Loader from 'components/loader'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import useEnsureLogin from '../../hooks/useEnsureLogin'
import { PageHeader } from 'components/Field'
import Table from 'components/Table'

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
  useEnsureLogin()
  const router = useRouter()
  const { isLoading: isLoadingBalance } = useBalanceStatus(true)
  const { transactions, isLoading } = useTransaction()

  return (
    <Layout>
      {isLoading || isLoadingBalance ? (
        <Loader />
      ) : (
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
      )}
    </Layout>
  )
}
export default List
