import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Button from 'components/button'
import TransactionForm from 'components/TransactionForm'
import Layout from 'components/layout'
import useTransactions from 'hooks/useTransactions'
import Loader from 'components/loader'
import Delete from 'components/button/delete.svg'

function PersistTransactionForm() {
  const router = useRouter()
  const { transactions, isLoading, deleteTrasaction } = useTransactions()
  const transaction = transactions?.find(({ id }) => router.query.id === id)

  const onDelete = useCallback(async () => {
    deleteTrasaction(transaction?.id!)
    await router.push('/transactions')
  }, [deleteTrasaction, transaction, router])

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Button
            text="delete"
            bordered
            onClick={() => onDelete()}
            icon={<Delete />}
          />
          <TransactionForm transactionConfig={transaction!} />
        </div>
      )}
    </Layout>
  )
}
export default PersistTransactionForm
