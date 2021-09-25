import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import TextNumber from '../../components/textNumber'
import Layout from '../../components/layout'
import useBalanceStatus from '../../hooks/useBalanceStatus'
import useTransaction from '../../hooks/useTransactions'
import { calcCurrentBalanceAmount } from '../../utils/transactionsCalculator'
import useEnsureLogin from '../../hooks/useEnsureLogin'

export default function CurrentBalancePanel() {
  useEnsureLogin()
  const [editedAmount, setEditedAmount] = useState(0)
  const { balanceStatuses, updateBalanceStatus, isLoading } =
    useBalanceStatus(true)
  const { transactions, isLoading: isLoadingTransactions } = useTransaction()
  const router = useRouter()

  if (isLoadingTransactions || isLoading) {
    return null
  }

  const currentBalanceAmount = calcCurrentBalanceAmount(
    transactions!,
    balanceStatuses?.[0]!
  )

  const currentBalanceStatus = balanceStatuses![0]

  return (
    <Layout>
      <div>
        <p>
          Current estimted balance is{' '}
          {currentBalanceAmount.toLocaleString('he', {
            style: 'currency',
            currency: 'ILS',
          })}
          <br />
          Last updated was on{' '}
          {format(currentBalanceStatus!.createdAt, 'dd/MM/yyyy  ')} for{' '}
          {currentBalanceStatus!.amount.toLocaleString('he', {
            style: 'currency',
            currency: 'ILS',
          })}
        </p>
        <TextNumber
          displayType="input"
          placeholder={currentBalanceAmount.toLocaleString('he')}
          onValueChange={(values) => {
            const { floatValue } = values
            setEditedAmount(floatValue!)
          }}
        />{' '}
        ₪
        <br />
        <button
          disabled={!editedAmount}
          onClick={async () => {
            updateBalanceStatus(editedAmount!)
            await router.push('/')
          }}
        >
          Update Balance
        </button>
      </div>
    </Layout>
  )
}
