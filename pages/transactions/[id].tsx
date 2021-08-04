import { useRouter } from 'next/router'
import { useCallback } from 'react'
import Button from '../../components/button'
import Form from '../api/transaction-configs/form'
import Layout from '../../components/layout'
import useTransaction from '../../hooks/useTransactions'
import _ from 'lodash'
import { TransactionConfig } from '../../utils/types'

function New2() {
  const router = useRouter()
  const { transactions, isLoading, mutate } = useTransaction()
  const transaction = transactions?.find(({ id }) => router.query.id === id)

  const onDelete = useCallback(async () => {
    await mutate((transactionConfigs: TransactionConfig[] = []) => {
      return _.remove(
        transactionConfigs,
        (transaction) => transaction.id !== router.query.id
      )
    }, false)

    router.push('/transactions')

    fetch(`/api/transaction-configs/${router.query.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(() => {
      return mutate()
    })
  }, [mutate, router])

  return (
    <Layout>
      {isLoading ? (
        'Loading'
      ) : (
        <>
          <Button text="delete" onClick={() => onDelete()} />
          <Form transactionConfig={transaction!} />
        </>
      )}
    </Layout>
  )
}
export default New2
