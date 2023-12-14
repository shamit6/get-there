'use client'
import { PageHeader } from 'components/Field'
import Button from 'components/button'
import useAssets from 'hooks/useAssets'
import { useTranslation } from 'hooks/useTranslation'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Table from 'components/Table'

function getTableColumns(t: any) {
  return [
    {
      name: t('assetType'),
      path: 'type',
    },
    {
      name: t('assetCashValue'),
      path: 'cashValue',
      format: (value: number) =>
        value.toLocaleString('he', { currency: 'ILS', style: 'currency' }),
    },
    {
      name: t('interval'),
      path: ['periodicIncomeAmount', 'timePeriod', 'periodAmount'],
      format: (
        periodicIncomeAmount: number,
        timePeriod: number,
        ...periodAmount: number[]
      ) =>
        timePeriod &&
        `${periodicIncomeAmount.toLocaleString('he')} ${t(
          'intervalDescription',
          { periodAmount, timePeriod: t(timePeriod) }
        )}`,
    },
  ]
}

export default function AssetsTable() {
  const router = useRouter()
  const { assets } = useAssets()
  const { t } = useTranslation()

  const tableColumns = getTableColumns(t)

  return (
    <>
      <PageHeader title={t('assets')}>
        <Button
          text={t('assetNew')}
          onClick={() => router.push('/assets/new')}
          bordered
          linkTheme
          icon={<Add />}
        />
      </PageHeader>
      <Table
        columns={tableColumns}
        onRowClick={(id: string) => router.push(`/assets/${id}`)}
        rows={assets}
      />
    </>
  )
}
