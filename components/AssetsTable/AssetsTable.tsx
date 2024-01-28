'use client'
import { PageHeader } from 'components/Field'
import Button from 'components/button'
import useAssets from 'hooks/useAssets'
import { useTranslation } from 'hooks/useTranslation'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Table from 'components/Table'
import { Asset } from '@prisma/client'
import { calcCurrentEstimatedAssetValue } from 'utils/assetsCalculator'

function getTableColumns() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = useTranslation()

  return [
    {
      name: t('assetType'),
      path: 'type',
    },
    {
      name: t('estimatedCurrentAssetValue'),
      format: (asset: Asset) => {
        const estimatedCurrentValue = calcCurrentEstimatedAssetValue(asset)
        return Intl.NumberFormat('en-US', {
          maximumFractionDigits: 1,
          notation: 'compact',
          compactDisplay: 'short',
          currency: 'ILS',
          style: 'currency',
        }).format(estimatedCurrentValue)
      },
    },
    {
      name: t('assetPeriodicIncomeAmount'),
      path: ['periodicIncomeAmount', 'timePeriod', 'periodAmount'],
      format: (
        periodicIncomeAmount: number,
        timePeriod: string,
        periodAmount: string
      ) =>
        timePeriod &&
        `${periodicIncomeAmount.toLocaleString('he', {
          currency: 'ILS',
          style: 'currency',
          maximumFractionDigits: 0,
        })} ${t('intervalDescription', {
          periodAmount,
          timePeriod: t(timePeriod),
        })}`,
    },
  ]
}

export default function AssetsTable() {
  const router = useRouter()
  const { assets } = useAssets()
  const { t } = useTranslation()

  const tableColumns = getTableColumns()

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
