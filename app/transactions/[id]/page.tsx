'use client'
import TransactionForm from 'components/TransactionForm'
import useTransactions from 'hooks/useTransactions'

export default function Page({ params }: { params: { id: string } }) {
  const { transactions } = useTransactions()
  const transaction = transactions?.find(({ id }) => params.id === id)
  return <TransactionForm transactionConfig={transaction} />
}
