'use client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Add from 'components/button/plus.svg'
import Button from 'components/button'
import useMortgages from 'hooks/useMortgages'
import { sumBy } from 'lodash'
import { PageHeader } from 'components/Field'
import Table from 'components/Table'
import { MortgageCourse } from 'utils/types'
import { useTranslation } from 'hooks/useTranslation'

const getTableColumns = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [
    { name: t('mortgageBank'), path: 'bank' },
    {
      name: t('amount'),
      path: 'courses',
      format: (courses: MortgageCourse[]) =>
        Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0,
          notation: 'compact',
          compactDisplay: 'short',
          currency: 'ILS',
          style: 'currency',
        }).format(sumBy(courses, 'amount')),
    },
    {
      name: t('mortgageDate'),
      path: 'offeringDate',
      format: (offeringDate: Date) => format(offeringDate, 'dd/MM/yyyy'),
    },
  ]
}

export default function MortgagesList() {
  const router = useRouter()
  const { mortgages } = useMortgages()
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('mortgages')}>
        <Button
          text={t('mortgageNew')}
          onClick={() => router.push('/mortgages/new')}
          bordered
          linkTheme
          icon={<Add />}
        />
      </PageHeader>
      <Table
        columns={getTableColumns()}
        rows={mortgages}
        onRowClick={(mortgageId: string) =>
          router.push(`/mortgages/${mortgageId}`)
        }
      />
    </>
  )
}
