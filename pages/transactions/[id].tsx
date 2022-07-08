import { useRouter } from 'next/router'
import TransactionForm from 'components/TransactionForm'
import Layout from 'components/layout'
import useTransactions from 'hooks/useTransactions'
import Loader from 'components/loader'

function PersistTransactionForm() {
  const router = useRouter()
  const { transactions, isLoading } = useTransactions()
  const transaction = transactions?.find(({ id }) => router.query.id === id)

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <TransactionForm transactionConfig={transaction!} />
      )}
    </Layout>
  )
}
export default PersistTransactionForm
