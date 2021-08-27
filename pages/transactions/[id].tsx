import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Button from '../../components/button'
import Form from './form'
import Layout from '../../components/layout'
import useTransactions from '../../hooks/useTransactions'
import Loader from '../../components/loader'
import Delete from './delete.svg'

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
        <>
          <Button
            text="delete"
            bordered
            onClick={() => onDelete()}
            icon={<Delete />}
          />
          <Form transactionConfig={transaction!} />
        </>
      )}
    </Layout>
  )
}
export default PersistTransactionForm
