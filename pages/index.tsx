import { useState } from 'react'
import { startOfDay, addYears } from 'date-fns'
import useTransaction from '../hooks/useTransactions'
import useBalanceStatus from '../hooks/useBalanceStatus'
import Layout from 'components/layout'
import styles from './Status.module.scss'
import Loader from 'components/loader'
import ScrollToTopButton from 'components/ScrollToTopButton'
import Timeline from './timeline'
import useEnsureLogin from '../hooks/useEnsureLogin'
import ChartsPanel from 'components/ChartsPanel'
import Tickers from 'components/Tickers'
import { Mortgage } from 'utils/types'
import { SWRConfig } from 'swr'
import TargetPanel from 'components/TargetPanel/TargetPanel'

function Home() {

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
        <TargetPanel />
        <div className={styles.graphs}>
          <ChartsPanel />
          {/* <div className={styles.timeline}>
            <Timeline />
          </div> */}
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
  // const mortgages = await fetchMortgagesForSsr(req)
  // return { props: { mortgages: JSON.parse(JSON.stringify(mortgages)) } }
  return { props: { mortgages: [] } }
}
