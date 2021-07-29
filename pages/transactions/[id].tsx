import { useRouter } from 'next/router'
import Form from './Form'
import useTransaction from '../../hooks/useTransactions'

function New2() {
  const router = useRouter()
  const { transactions, isLoading } = useTransaction()
  const transaction = transactions?.find(({ id }) => router.query.id === id)
  return isLoading ? 'Loading' : <Form transactionConfig={transaction!} />
}
export default New2
