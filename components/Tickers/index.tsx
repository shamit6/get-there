import React from 'react'
import styles from './Tickers.module.scss'
import Ticker from 'components/Ticker'
import useTransactionsView from 'hooks/useTransactionsView'
import UpdateBalance from 'components/UpdateBalance'
import { useTranslation } from 'hooks/useTranslation'

export default function Tickers() {
  const { currentBalanceAmount } = useTransactionsView()
  const { t } = useTranslation()

  return (
    <div className={styles.currentBalanceTicker}>
      <Ticker label={t('balance')} number={currentBalanceAmount} />
      <UpdateBalance />
    </div>
  )
}
