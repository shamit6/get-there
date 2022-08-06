import React from 'react'
import styles from './Tickers.module.scss'
import Ticker from 'components/Ticker'
import useTransactionsView from 'hooks/useTransactionsView'
export default function Tickers() {
  const {currentBalanceAmount} = useTransactionsView()

  return (
    <div className={styles.first}>
      <Ticker label="Balance" number={currentBalanceAmount} />
      {/* <div className={styles.smallTickers}>
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
      </div> */}
    </div>
  )
}
