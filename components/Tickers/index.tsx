import React from 'react'
import Ticker from 'components/Ticker'
import useTransactionsView from 'hooks/useTransactionsView'
import UpdateBalance from 'components/UpdateBalance'
import { useTranslation } from 'hooks/useTranslation'

export default function Tickers() {
  const { currentBalanceAmount } = useTransactionsView()
  const { t } = useTranslation()

  return (
    <div className="mx-auto relative inline-block">
      <Ticker label={t('balance')} number={currentBalanceAmount} />
      <UpdateBalance />
    </div>
  )
}
