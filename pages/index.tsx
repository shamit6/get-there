import { useState } from 'react'
import { format, startOfDay, addYears } from 'date-fns'
import useTransaction from '../hooks/useTransactions'
import useBalanceStatus from '../hooks/useBalanceStatus'
import Layout from 'components/layout'
import styles from './Status.module.scss'
import Loader from 'components/loader'
import Field from 'components/Field'
import ScrollToTopButton from 'components/ScrollToTopButton'
import Timeline from './timeline'
import useEnsureLogin from '../hooks/useEnsureLogin'
import ChartsPanel from 'components/ChartsPanel'
import { fetchMortgagesForSsr } from './api/mortgages'
import Tickers from 'components/Tickers'
import { Mortgage } from 'utils/types'
import { SWRConfig } from 'swr'

function Home() {
  const nowDate = new Date()
  const [startDate, setStartDate] = useState<Date>(startOfDay(nowDate))
  const [endDate, setEndDate] = useState<Date>(startOfDay(addYears(nowDate, 1)))
  useEnsureLogin()

  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransaction()

  if (!transactions || !balanceStatuses) {
    return (
      <Layout>
        <Loader />
      </Layout>
    )
  } else if (balanceStatuses.length === 0) {
    return <Layout>Empty State</Layout>
  }

  return (
    <Layout>
      <div className={styles.status}>
        <Tickers />
        <div className={styles.filterPanel}>
          <Field label="From date:">
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                setStartDate(e.target.valueAsDate!)
              }}
            />
          </Field>
          <Field label="Until date:">
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                setEndDate(e.target.valueAsDate!)
              }}
            />
          </Field>
        </div>
        <div className={styles.graphs}>
          <ChartsPanel startDate={startDate} endDate={endDate} />
          <div className={styles.timeline}>
            <Timeline fromDate={startDate} untilDate={endDate} />
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </Layout>
  )
}

export default function Wrapper({ mortgages }: { mortgages: Mortgage[] }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/mortgages': mortgages.map((mortgage: any) => ({
            ...mortgage,
            offeringDate: new Date(mortgage.offeringDate),
          })),
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

// @ts-ignore
export async function getServerSideProps({ req }) {
  const mortgages = await fetchMortgagesForSsr(req)

  // return { props: { mortgages: JSON.parse(JSON.stringify(mortgages)) } }
  return { props: { mortgages: [] } }
}
