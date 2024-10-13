'use client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import useStocks from 'hooks/useStocks'
import { PageHeader } from 'components/Field'
import Table from 'components/Table'
import { useTranslation } from 'hooks/useTranslation'

const getTableColumns = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [
    { name: t('stockSymbol'), path: 'symbol' },
    {
      name: t('amount'),
      path: 'amount',
    },
    {
      name: t('buyingPrice'),
      path: 'buyingPrice',
      format: (price: number) =>
        Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0,
          notation: 'compact',
          compactDisplay: 'short',
          currency: 'ILS',
          style: 'currency',
        }).format(price),
    },
    {
      name: t('stockBuyDate'),
      path: 'stockBuyDate',
      format: (stockBuyDate: Date) => format(stockBuyDate, 'dd/MM/yyyy'),
    },
  ]
}

export default function StocksList() {
  const router = useRouter()
  const { stocks } = useStocks()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('stocks')}>
        <Button
          text={t('newStock')}
          onClick={() => router.push('/stocks/new')}
          bordered
          linkTheme
          icon={<Add />}
        />
      </PageHeader>
      <Table
        columns={getTableColumns()}
        rows={stocks}
        onRowClick={(stock: string) => router.push(`/stocks/${stock}`)}
      />
    </>
  )
}
