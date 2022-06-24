import { useState } from 'react'
import { format, startOfDay, addYears } from 'date-fns'
import useTransaction from '../hooks/useTransactions'
import useBalanceStatus from '../hooks/useBalanceStatus'
import {
  calcCurrentBalanceAmount,
  getCurrentMonthBalanceAmount,
  getCurrentYearBalanceAmount,
} from 'utils/transactionsCalculator'
import Layout from 'components/layout'
import styles from './Status.module.scss'
import Ticker from 'components/Ticker'
import Loader from 'components/loader'
import Field from 'components/Field'
import ScrollToTopButton from 'components/ScrollToTopButton'
import Timeline from './timeline'
import useEnsureLogin from '../hooks/useEnsureLogin'
import ChartsPanel from 'components/ChartsPanel'

export default function Home() {
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

  const currentBalanceAmount = calcCurrentBalanceAmount(
    transactions,
    balanceStatuses[0]
  )

  const currentYearBalanceAmount = getCurrentYearBalanceAmount(
    transactions,
    nowDate
  )
  const currentMonthBalanceAmount = getCurrentMonthBalanceAmount(
    transactions,
    nowDate
  )

  return (
    <Layout>
      <div className={styles.status}>
        <div className={styles.first}>
          <Ticker label="Balance" number={currentBalanceAmount} />
          <div className={styles.smallTickers}>
            <Ticker
              small
              label="This Year"
              prefix={currentYearBalanceAmount < 0 ? '-' : '+'}
              number={currentYearBalanceAmount}
              duration={4}
            />
            <Ticker
              small
              label="This Month"
              prefix={currentMonthBalanceAmount < 0 ? '-' : '+'}
              number={currentMonthBalanceAmount}
              duration={4}
            />
            <Ticker
              small
              label="Month AVG"
              prefix={currentYearBalanceAmount < 0 ? '-' : '+'}
              number={currentYearBalanceAmount / 12}
              duration={4}
            />
          </div>
        </div>
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
