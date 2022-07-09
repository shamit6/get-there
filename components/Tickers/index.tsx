import React from 'react'
import {
  calcCurrentBalanceAmount,
  getCurrentMonthBalanceAmount,
  getCurrentYearBalanceAmount,
} from 'utils/transactionsCalculator'
import styles from './Tickers.module.scss'
import Ticker from 'components/Ticker'
import Loader from 'components/loader'
import useBalanceStatus from 'hooks/useBalanceStatus'
import useTransaction from 'hooks/useTransactions'

export default function Tickers() {
  const nowDate = new Date()

  const { balanceStatuses } = useBalanceStatus()
  const { transactions } = useTransaction()

  if (!transactions || !balanceStatuses) {
    return <Loader />
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
  )
}
